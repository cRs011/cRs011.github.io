#!/usr/bin/env python3
"""
Adauga un proiect nou: intrare in data/projects.json plus pagina in projects/.

    python3 scripts/new_project.py <identificator> "<titlu>"

Identificatorul devine si numele fisierului, deci se scrie cu litere mici si
cratime. Scriptul refuza sa suprascrie o pagina existenta si nu atinge nimic daca
identificatorul e deja folosit.

Ce ramane de facut manual dupa rulare este exact partea care nu se poate genera:
descrierea si textul paginii. Restul — randarea in index.html si sitemap — se face
la urmatorul build.
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_FILE = os.path.join(ROOT, "data", "projects.json")
PAGES_DIR = os.path.join(ROOT, "projects")
TEMPLATE_SOURCE = os.path.join(PAGES_DIR, "bettertanks.html")

ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title} · Cristian Lăcătuș</title>

  <meta name="description" content="TODO: one sentence describing what this is.">
  <meta name="theme-color" content="#fbf9f5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#16151b" media="(prefers-color-scheme: dark)">
  <link rel="canonical" href="https://crs011.github.io/projects/{slug}.html">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.min.css?v=20260817">
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="masthead">
    <div class="wrap masthead-inner">
      <a href="../" class="wordmark">cRs</a>
      <nav aria-label="Sections">
        <ul>
          <li><a href="../#work">Work</a></li>
          <li><a href="../#about">About</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main" class="wrap case">
    <div class="case-head">
      <a class="back-link" href="../#work">← back to work</a>
      <h1>{title}</h1>
      <p class="lede">TODO: the one sentence that makes someone keep reading.</p>

      <dl class="case-facts">
        <div><dt>Context</dt><dd>TODO</dd></div>
        <div><dt>Stack</dt><dd>TODO</dd></div>
        <div><dt>Status</dt><dd>TODO</dd></div>
        <div><dt>Code</dt><dd>TODO</dd></div>
      </dl>
    </div>

    <div class="case-body">
      <h2>What it had to do</h2>
      <p>TODO: the problem, before any solution.</p>

      <h2>How it works</h2>
      <p>TODO: the one mechanism worth explaining. Show the code that matters.</p>

      <h2>What went wrong first</h2>
      <p>TODO: the bug that took the longest. This is the part people believe.</p>

      <div class="honest">
        <h3>What I would fix</h3>
        <ul>
          <li>TODO: something genuinely wrong with it. Do not skip this section.</li>
        </ul>
      </div>

      <h2>What I took from it</h2>
      <p>TODO: what you know now that you did not know before.</p>

      <p><a class="back-link" href="../#work">← back to work</a></p>
    </div>
  </main>

  <footer class="wrap site-footer">
    <p>© 2026 Cristian Lăcătuș · Bucharest</p>
    <p class="footer-links"><a href="../">Home</a></p>
  </footer>
</body>
</html>
"""


def die(message):
    print(message, file=sys.stderr)
    sys.exit(1)


def main():
    if len(sys.argv) != 3:
        die('Utilizare: python3 scripts/new_project.py <identificator> "<titlu>"')

    slug, title = sys.argv[1], sys.argv[2]

    if not ID_PATTERN.match(slug):
        die(f"Identificatorul '{slug}' trebuie sa fie litere mici si cratime, de exemplu 'grid-solver'.")

    page_path = os.path.join(PAGES_DIR, f"{slug}.html")
    if os.path.exists(page_path):
        die(f"projects/{slug}.html exista deja. Alege alt identificator sau editeaza pagina existenta.")

    with open(PROJECTS_FILE, encoding="utf-8") as handle:
        projects = json.load(handle)

    if any(project.get("id") == slug for project in projects):
        die(f"Identificatorul '{slug}' e deja folosit in data/projects.json.")

    os.makedirs(PAGES_DIR, exist_ok=True)
    with open(page_path, "w", encoding="utf-8") as handle:
        handle.write(PAGE_TEMPLATE.format(title=title, slug=slug))

    projects.append({
        "id": slug,
        "title": title,
        "meta": "TODO: stack · context · period",
        "blurb": "TODO: two or three sentences. What it is, and the one detail worth clicking for.",
        "tags": ["TODO"],
        "case": f"projects/{slug}.html",
        "repo": None,
        "media": None,
    })

    with open(PROJECTS_FILE, "w", encoding="utf-8") as handle:
        json.dump(projects, handle, indent=2, ensure_ascii=False)
        handle.write("\n")

    print(f"Creat projects/{slug}.html si intrarea din data/projects.json.")
    print("Mai departe:")
    print(f"  1. scrie textul in projects/{slug}.html (cauta TODO)")
    print("  2. completeaza 'meta', 'blurb' si 'tags' in data/projects.json")
    print("  3. python3 scripts/build_prod.py")


if __name__ == "__main__":
    main()
