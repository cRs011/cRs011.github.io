#!/usr/bin/env python3
"""
cRs011 Portfolio — Production Build & Minification Pipeline
Compiles styles.css -> styles.min.css and script.js -> script.min.js
Strips verbose development comments, compresses whitespace, and optimizes for 120 FPS production.
"""

import os
import re
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def minify_css(css_content: str) -> str:
    # 1. Remove comments
    css = re.sub(r"/\*[\s\S]*?\*/", "", css_content)
    # 2. Normalize whitespace
    css = re.sub(r"\s+", " ", css)
    # 3. Remove spaces around symbols
    css = re.sub(r"\s*([\{\}\:\;\,\>\+\~])\s*", r"\1", css)
    # 4. Remove trailing semicolons before closing brace
    css = re.sub(r";\}", "}", css)
    return css.strip()


def minify_js(js_content: str) -> str:
    # Preserve console easter egg at the very top
    easter_egg_match = re.search(r"(\(function initConsoleEasterEgg\(\)[\s\S]*?\}\)\(\);)", js_content)
    easter_egg = easter_egg_match.group(1) if easter_egg_match else ""

    # Remove single line comments (carefully avoiding URLs)
    clean_js = re.sub(r"(?<!:)//[^\n]*", "", js_content)
    # Remove multi-line comments
    clean_js = re.sub(r"/\*[\s\S]*?\*/", "", clean_js)

    # Normalize whitespace while preserving strings and basic syntax
    lines = [line.strip() for line in clean_js.split("\n") if line.strip()]
    minified = "\n".join(lines)

    # Add header comment
    header = "/*! cRs.dev — Cristian Lăcătuș (Software & Automation Engineer) | MIT License */\n"
    return header + minified


def build():
    css_path = os.path.join(ROOT_DIR, "styles.css")
    css_min_path = os.path.join(ROOT_DIR, "styles.min.css")

    js_path = os.path.join(ROOT_DIR, "script.js")
    js_min_path = os.path.join(ROOT_DIR, "script.min.js")

    print("⚡ Starting Production Build Pipeline...")

    # Minify CSS
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            raw_css = f.read()
        min_css = minify_css(raw_css)
        with open(css_min_path, "w", encoding="utf-8") as f:
            f.write(min_css)
        orig_kb = len(raw_css) / 1024
        min_kb = len(min_css) / 1024
        saved = (1 - min_kb / orig_kb) * 100
        print(f"✓ CSS Minified: {orig_kb:.1f} KB -> {min_kb:.1f} KB ({saved:.1f}% reduction) -> styles.min.css")

    # Minify JS
    if os.path.exists(js_path):
        with open(js_path, "r", encoding="utf-8") as f:
            raw_js = f.read()
        min_js = minify_js(raw_js)
        with open(js_min_path, "w", encoding="utf-8") as f:
            f.write(min_js)
        orig_kb = len(raw_js) / 1024
        min_kb = len(min_js) / 1024
        saved = (1 - min_kb / orig_kb) * 100
        print(f"✓ JS Minified:  {orig_kb:.1f} KB -> {min_kb:.1f} KB ({saved:.1f}% reduction) -> script.min.js")

    print("🚀 Production Build Complete!")


if __name__ == "__main__":
    build()
