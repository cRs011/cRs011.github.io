#!/usr/bin/env python3
"""
cRs011 Portfolio — Production Build & Minification Pipeline
Compiles styles.css -> styles.min.css and script.js -> script.min.js via Terser & Clean-CSS
"""

import os
import subprocess
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def build():
    css_path = os.path.join(ROOT_DIR, "styles.css")
    css_min_path = os.path.join(ROOT_DIR, "styles.min.css")
    js_path = os.path.join(ROOT_DIR, "script.js")
    js_min_path = os.path.join(ROOT_DIR, "script.min.js")

    print("⚡ Starting Production Build Pipeline (Terser & Clean-CSS)...")

    try:
        # 1. Compile JS with Terser (Mangle variables, compress AST, single line output)
        subprocess.run(
            ["npx", "-y", "terser", js_path, "-o", js_min_path, "--compress", "--mangle"],
            check=True,
            cwd=ROOT_DIR,
        )
        print("✓ JS Minified with Terser -> script.min.js (1 single line, mangled variables)")

        # 2. Compile CSS with Clean-CSS (Zero line breaks, single line output)
        subprocess.run(
            ["npx", "-y", "clean-css-cli", "-o", css_min_path, css_path],
            check=True,
            cwd=ROOT_DIR,
        )
        print("✓ CSS Minified with Clean-CSS -> styles.min.css (1 single line)")
    except Exception as e:
        print(f"Build error: {e}", file=sys.stderr)
        sys.exit(1)

    print("🚀 Production Build Complete!")


if __name__ == "__main__":
    build()
