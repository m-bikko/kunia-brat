"""White line-art copy of the furniture layer for the blueprint intro.

Usage: python3 scripts/make_furniture_outline.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "illustrations" / "room-furniture.svg"
OUT = ROOT / "assets" / "illustrations" / "room-furniture-outline.svg"

svg = SRC.read_text(encoding="utf-8")
svg = re.sub(r'fill="(?!none)[^"]*"', 'fill="none"', svg)
svg = re.sub(r'stroke="[^"]*"', 'stroke="#ffffff"', svg)
svg = re.sub(r'stroke-width="[^"]*"', 'stroke-width=".9"', svg)
OUT.write_text(svg, encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)}")
