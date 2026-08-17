#!/usr/bin/env python3
"""
Build de productie: randeaza lista de proiecte, apoi minifica CSS-ul si JS-ul.

Ordinea conteaza. Randarea ruleaza prima si poate opri build-ul daca data/projects.json
nu se leaga cu fisierele de pe disc, ca sa nu ajunga o legatura rupta in bundle.
"""

import os
import subprocess
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(ROOT_DIR, "scripts")


def run(command, description):
    try:
        subprocess.run(command, check=True, cwd=ROOT_DIR)
    except FileNotFoundError:
        print(f"Build oprit: comanda '{command[0]}' nu a fost gasita.", file=sys.stderr)
        sys.exit(1)
    except subprocess.CalledProcessError as err:
        print(f"Build oprit la pasul '{description}' (cod {err.returncode}).", file=sys.stderr)
        sys.exit(1)


def build():
    print("Build de productie")

    run([sys.executable, os.path.join(SCRIPTS_DIR, "render_site.py")], "randare proiecte")

    run(
        ["npx", "-y", "terser", os.path.join(ROOT_DIR, "script.js"),
         "-o", os.path.join(ROOT_DIR, "script.min.js"), "--compress", "--mangle"],
        "minificare JS",
    )
    print("  script.min.js scris")

    run(
        ["npx", "-y", "clean-css-cli", "-o", os.path.join(ROOT_DIR, "styles.min.css"),
         os.path.join(ROOT_DIR, "styles.css")],
        "minificare CSS",
    )
    print("  styles.min.css scris")

    print("Gata.")


if __name__ == "__main__":
    build()
