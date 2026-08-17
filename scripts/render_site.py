#!/usr/bin/env python3
"""
Randeaza lista de proiecte din data/projects.json in index.html si regenereaza
sitemap.xml.

data/projects.json este singura sursa de adevar pentru proiecte. Un proiect nou
inseamna o intrare acolo plus o pagina in projects/ — restul se genereaza. Blocul
din index.html dintre marcajele `projects:start` si `projects:end` este suprascris
la fiecare rulare, deci nu se editeaza manual.

Scriptul valideaza inainte sa scrie si iese cu cod diferit de zero daca ceva nu se
leaga: camp lipsa, identificator duplicat, pagina de proiect inexistenta sau fisier
media care nu se afla pe disc. Motivul e simplu — un build care trece cu o legatura
rupta publica o legatura rupta.
"""

import html
import json
import os
import re
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_FILE = os.path.join(ROOT, "data", "projects.json")
INDEX_FILE = os.path.join(ROOT, "index.html")
SITEMAP_FILE = os.path.join(ROOT, "sitemap.xml")

SITE_URL = "https://crs011.github.io"
START_MARKER = "<!-- projects:start"
END_MARKER = "<!-- projects:end -->"

REQUIRED_FIELDS = ("id", "title", "meta", "blurb", "tags", "case")


def fail(messages):
    print("Randarea a fost oprita:", file=sys.stderr)
    for message in messages:
        print(f"  - {message}", file=sys.stderr)
    sys.exit(1)


def load_projects():
    if not os.path.exists(PROJECTS_FILE):
        fail([f"lipseste {PROJECTS_FILE}"])

    with open(PROJECTS_FILE, encoding="utf-8") as handle:
        try:
            projects = json.load(handle)
        except json.JSONDecodeError as err:
            fail([f"data/projects.json nu este JSON valid: {err}"])

    if not isinstance(projects, list) or not projects:
        fail(["data/projects.json trebuie sa fie o lista cu cel putin un proiect"])

    return projects


def validate(projects):
    problems = []
    seen_ids = set()

    for index, project in enumerate(projects):
        label = project.get("id") or f"proiectul #{index + 1}"

        if not isinstance(project, dict):
            problems.append(f"{label}: intrarea nu este un obiect")
            continue

        for field in REQUIRED_FIELDS:
            if not project.get(field):
                problems.append(f"{label}: campul obligatoriu '{field}' lipseste sau e gol")

        if not isinstance(project.get("tags", []), list):
            problems.append(f"{label}: 'tags' trebuie sa fie o lista")

        project_id = project.get("id")
        if project_id in seen_ids:
            problems.append(f"{label}: identificator duplicat")
        seen_ids.add(project_id)

        case_path = project.get("case")
        if case_path and not os.path.exists(os.path.join(ROOT, case_path)):
            problems.append(f"{label}: pagina '{case_path}' nu exista pe disc")

        media = project.get("media")
        if media:
            if not media.get("mp4") or not media.get("poster"):
                problems.append(f"{label}: media are nevoie si de 'mp4', si de 'poster'")
            if not media.get("alt"):
                problems.append(f"{label}: media are nevoie de 'alt' pentru cititoarele de ecran")
            for key in ("mp4", "poster", "gif"):
                asset = media.get(key)
                if asset and not os.path.exists(os.path.join(ROOT, asset)):
                    problems.append(f"{label}: fisierul media '{asset}' nu exista pe disc")

    if problems:
        fail(problems)


def esc(value):
    return html.escape(str(value), quote=True)


def render_media(media):
    if not media:
        return ""

    gif = media.get("gif")
    fallback = ""
    if gif:
        fallback = (
            f'\n            <img src="{esc(gif)}" alt="{esc(media["alt"])}" '
            f'loading="lazy" width="960" height="540">'
        )

    return (
        '\n          <div class="work-media">'
        '\n            <video autoplay loop muted playsinline preload="metadata" '
        f'poster="{esc(media["poster"])}" width="960" height="540">'
        f'\n              <source src="{esc(media["mp4"])}" type="video/mp4">'
        f"{fallback}"
        "\n            </video>"
        "\n          </div>"
    )


def render_project(project):
    media_html = render_media(project.get("media"))
    item_class = "work-item" if media_html else "work-item no-media"

    tags = "".join(
        f"\n              <li>{esc(tag)}</li>" for tag in project.get("tags", [])
    )

    links = [f'<a href="{esc(project["case"])}">Read the write-up</a>']
    if project.get("repo"):
        links.append(f'<a href="{esc(project["repo"])}">Source on GitHub</a>')
    links_html = "".join(f"\n              {link}" for link in links)

    return f"""        <article class="{item_class}">
          <div class="work-body">
            <h3><a href="{esc(project["case"])}">{esc(project["title"])}</a></h3>
            <p class="work-meta">{esc(project["meta"])}</p>
            <p>{esc(project["blurb"])}</p>
            <ul class="tags">{tags}
            </ul>
            <div class="work-links">{links_html}
            </div>
          </div>{media_html}
        </article>"""


def render_index(projects):
    with open(INDEX_FILE, encoding="utf-8") as handle:
        markup = handle.read()

    start = markup.find(START_MARKER)
    end = markup.find(END_MARKER)
    if start == -1 or end == -1 or end < start:
        fail(["index.html nu contine marcajele 'projects:start' si 'projects:end'"])

    body = "\n".join(render_project(project) for project in projects)
    block = (
        "<!-- projects:start — generat de scripts/render_site.py din "
        "data/projects.json. Nu edita intre marcaje. -->\n"
        '      <div class="work-list">\n'
        f"{body}\n"
        "      </div>\n"
        "      " + END_MARKER
    )

    updated = markup[:start] + block + markup[end + len(END_MARKER):]

    if updated == markup:
        print("index.html: deja la zi")
        return False

    with open(INDEX_FILE, "w", encoding="utf-8") as handle:
        handle.write(updated)
    print(f"index.html: {len(projects)} proiecte randate")
    return True


def render_sitemap(projects):
    today = date.today().isoformat()
    urls = [f"{SITE_URL}/"] + [
        f"{SITE_URL}/{project['case']}" for project in projects if project.get("case")
    ]

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in urls:
        lines.append(f"  <url><loc>{url}</loc><lastmod>{today}</lastmod></url>")
    lines.append("</urlset>")

    with open(SITEMAP_FILE, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")
    print(f"sitemap.xml: {len(urls)} adrese")


def orphan_pages(projects):
    """Pagini din projects/ pe care nu le mai indica nicio intrare din JSON."""
    listed = {project.get("case") for project in projects}
    folder = os.path.join(ROOT, "projects")
    if not os.path.isdir(folder):
        return

    for name in sorted(os.listdir(folder)):
        if not name.endswith(".html"):
            continue
        if f"projects/{name}" not in listed:
            print(f"  atentie: projects/{name} exista dar nu apare in data/projects.json")


def main():
    projects = load_projects()
    validate(projects)
    render_index(projects)
    render_sitemap(projects)
    orphan_pages(projects)


if __name__ == "__main__":
    main()
