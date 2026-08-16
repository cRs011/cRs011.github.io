#!/usr/bin/env python3
"""
cRs011 Portfolio — Automated GitHub Activity & Telemetry Sync
Fetches public GitHub events, repositories, and activity to generate data/activity.json
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone

USERNAME = "cRs011"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "activity.json")


def fetch_json(url: str, token: str = None) -> dict | list | None:
    headers = {
        "User-Agent": "cRs011-Portfolio-Sync/1.0",
        "Accept": "application/vnd.github.v3+json",
    }
    if token:
        headers["Authorization"] = f"token {token}"

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} fetching {url}: {e.reason}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error fetching {url}: {e}", file=sys.stderr)
        return None


def format_time_ago(iso_timestamp: str) -> str:
    try:
        dt = datetime.fromisoformat(iso_timestamp.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        diff = now - dt

        seconds = int(diff.total_seconds())
        if seconds < 60:
            return "just now"
        minutes = seconds // 60
        if minutes < 60:
            return f"{minutes}m ago"
        hours = minutes // 60
        if hours < 24:
            return f"{hours}h ago"
        days = hours // 24
        if days < 30:
            return f"{days}d ago"
        months = days // 30
        return f"{months}mo ago"
    except Exception:
        return "recently"


def sanitize_commit_message(msg: str) -> str:
    """Strips local file paths, IPs, emails, and sensitive data from public commit displays."""
    import re
    if not msg:
        return "Updated codebase"
    # Remove absolute file paths (e.g., /Volumes/..., /Users/...)
    clean = re.sub(r"/(?:Volumes|Users|home|root|var|etc)/[^\s]+", "[path]", msg)
    # Remove IP addresses
    clean = re.sub(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", "[ip]", clean)
    # Remove email addresses
    clean = re.sub(r"[\w\.-]+@[\w\.-]+\.\w+", "[email]", clean)
    # Remove token-like hex hashes
    clean = re.sub(r"\b[a-f0-9]{24,64}\b", "[hash]", clean, flags=re.I)
    return clean.strip()


def sync():
    token = os.environ.get("GITHUB_TOKEN")
    print(f"Fetching GitHub activity for user: {USERNAME}...")

    # 1. Fetch public events for latest commit
    events_url = f"https://api.github.com/users/{USERNAME}/events/public?per_page=15"
    events = fetch_json(events_url, token)

    latest_activity = None
    if events and isinstance(events, list):
        for ev in events:
            if ev.get("type") == "PushEvent":
                repo_name = ev.get("repo", {}).get("name", "")
                created_at = ev.get("created_at", "")
                payload = ev.get("payload", {})
                commits = payload.get("commits", [])
                
                commit_msg = "Updated codebase"
                if commits and len(commits) > 0:
                    raw_msg = commits[-1].get("message", "Updated codebase").split("\n")[0]
                    commit_msg = sanitize_commit_message(raw_msg)

                clean_repo = repo_name.split("/")[-1] if "/" in repo_name else repo_name
                
                latest_activity = {
                    "repo": clean_repo,
                    "full_repo": repo_name,
                    "repo_url": f"https://github.com/{repo_name}",
                    "message": commit_msg[:80] + ("..." if len(commit_msg) > 80 else ""),
                    "timestamp": created_at,
                    "time_ago": format_time_ago(created_at),
                }
                break

    # 2. Fetch public repos for languages and project highlights
    repos_url = f"https://api.github.com/users/{USERNAME}/repos?sort=pushed&per_page=20"
    repos = fetch_json(repos_url, token)

    active_repos = []
    language_counts = {}

    if repos and isinstance(repos, list):
        for r in repos:
            if r.get("fork"):
                continue  # Skip forks, highlight original work
            
            lang = r.get("language")
            if lang:
                language_counts[lang] = language_counts.get(lang, 0) + 1

            if len(active_repos) < 4:
                active_repos.append({
                    "name": r.get("name"),
                    "url": r.get("html_url"),
                    "description": r.get("description") or "Active software repository",
                    "language": lang or "Code",
                    "stars": r.get("stargazers_count", 0),
                    "pushed_at": r.get("pushed_at", ""),
                })

    # Sort languages by prevalence
    sorted_langs = sorted(language_counts.keys(), key=lambda k: language_counts[k], reverse=True)
    if not sorted_langs:
        sorted_langs = ["Python", "C#", "JavaScript", "HTML/CSS", "Shell"]

    # Fallback if latest activity couldn't be resolved
    if not latest_activity:
        latest_activity = {
            "repo": "DeviDevs",
            "full_repo": f"{USERNAME}/DeviDevs",
            "repo_url": f"https://github.com/{USERNAME}/DeviDevs",
            "message": "Continuous system enhancements",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "time_ago": "recently",
        }

    data = {
        "username": USERNAME,
        "last_synced": datetime.now(timezone.utc).isoformat(),
        "status": "Active & Shipping",
        "latest_activity": latest_activity,
        "top_languages": sorted_langs[:5],
        "active_repos": active_repos,
    }

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully synced activity to {OUTPUT_FILE}")
    print(f"Latest activity: {latest_activity['repo']} — \"{latest_activity['message']}\" ({latest_activity['time_ago']})")


if __name__ == "__main__":
    sync()
