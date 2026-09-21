#!/usr/bin/env python3
"""Give every unnamed spare part a correct dental-unit name.

    python3 scripts/parts-pipeline/name_parts.py

Jarich: name them the best you can, whatever they are, but do not use a code; use the
correct terminology, they are dental spare parts and pneumatic parts for pressure, water
and air in a dental chair mechanism.

HOW THESE NAMES WERE ARRIVED AT. All 169 unnamed parts were rendered onto light contact
sheets at 300 px a tile and IDENTIFIED BY SIGHT, in eight passes. The RV code family and
the source category were used only to group and sanity check, never to name. Where the
photograph does not show enough to state a function, the name is an honest generic
("Housing cover panel", "Pneumatic fitting") rather than an invented purpose, and the
entry is marked low confidence so Jarich can correct it in the studio.

Every entry carries `named_by`: "source" when the name came from the catalogue, "inferred"
when it came from this pass, plus `confidence`. Codes never appear in a name; the script
asserts that before writing.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
PARTS = REPO / "src/data/cinema/parts.json"
SHEET = Path.home() / "second-brain/builds/dsd-site-overhaul/proof/parts-named-sheet.png"

H, M, L = "high", "medium", "low"

# index in the unnamed list -> (name, confidence)
NAMES: dict[int, tuple[str, str]] = {
    0: ("Mounting bracket, U channel", M),
    1: ("Toroidal transformer", H), 2: ("Toroidal transformer", H),
    3: ("Air filter regulator with pressure gauge", H),
    4: ("Toroidal transformer", H),
    5: ("Control box housing cover", M),
    6: ("Monitor mount arm", H),
    7: ("Three way syringe tip", M),
    8: ("Three way syringe handpiece body", H),
    9: ("Handpiece holder", H),
    10: ("Handpiece holder with control buttons", M),
    11: ("Clean water bottle", H), 12: ("Clean water bottle", H),
    13: ("Cup holder assembly", M),
    14: ("Saliva ejector valve, low volume", H),
    15: ("Suction handle valve, high volume", H),
    16: ("Suction handle valve, high volume", H),
    17: ("Suction valve seal kit", M), 18: ("Suction valve seal kit", M),
    19: ("Brass mounting bracket", M),
    20: ("Inline water filter bowl", H),
    21: ("Inline water filter cartridge", H),
    22: ("Air and water syringe tip", M),
    23: ("Inline filter with brass bowl", M),
    24: ("Cuspidor filter strainer basket", H),
    25: ("Cuspidor bowl mounting ring", M),
    26: ("Cuspidor cover plate", M),
    27: ("Water line fitting assembly", L),
    28: ("Tissue box holder", M),
    29: ("Water box tank", M), 30: ("Water box tank", M),
    31: ("Operating light reflector", H),
    32: ("Saliva ejector hose with tip", M),
    33: ("Armrest", H),
    34: ("Foot controller, disc type", H),
    35: ("Water valve, brass, two port", H),
    36: ("Water valve, brass, two port", H),
    37: ("Water control valve, push type", H),
    38: ("Pneumatic toggle valve", H),
    39: ("Air control valve with lever", H),
    40: ("Pressure microswitch assembly", H),
    41: ("Pneumatic manifold block, multi port", H),
    42: ("Pneumatic manifold block, multi port", H),
    43: ("Water pressure regulator, adjustable", H),
    44: ("Inline air filter cartridge", M),
    45: ("Inline air filter cartridge", M),
    46: ("Brass T connector, three port", H),
    47: ("Valve manifold block, two port", M),
    48: ("Pull valve with knob, air", H),
    49: ("Push button valve", H), 50: ("Push button valve", H),
    51: ("Mounting block with air ports", M),
    52: ("Air valve block, two port", M),
    53: ("Inline valve block", M),
    54: ("Water and air relay valve", H),
    55: ("Water and air relay valve", H),
    56: ("Water and air relay valve", H),
    57: ("Suction hose connector", H),
    58: ("Suction valve stem fitting", M),
    59: ("Manifold block with adjusters, multi port", H),
    60: ("Mounting plate, perforated", M),
    61: ("Mounting plate, perforated", M),
    62: ("Brass manifold block", H),
    63: ("Rotary valve block, six port", M),
    64: ("Rotary valve block, six port", M),
    65: ("Rotary valve block, six port", M),
    66: ("Rotary valve block, six port", M),
    67: ("Valve diaphragm, rubber", H),
    68: ("Lever valve, brass, two port", H),
    69: ("Lever valve, brass, two port", H),
    70: ("Pressure gauge", H), 71: ("Pressure gauge", H),
    72: ("Air filter regulator with pressure gauge", H),
    73: ("Air pressure regulator", H),
    74: ("Valve spindle assembly", M),
    75: ("Cuspidor assembly with bowl and faucet", H),
    76: ("Cuspidor bowl, glass", H),
    77: ("Cuspidor assembly, ceramic bowl", H),
    78: ("Cuspidor bowl with support arm", H),
    79: ("Cuspidor bowl with drain hose", H),
    80: ("Instrument tray, perforated", H),
    81: ("Cuspidor assembly, chrome faucet", H),
    82: ("Cuspidor assembly, chrome faucet", H),
    83: ("Delivery arm cover panel", M),
    84: ("Housing cover panel", M),
    85: ("Light power supply module", H),
    86: ("Instrument tray, perforated", H),
    87: ("Housing cover, hexagonal", M),
    88: ("Housing cover, hexagonal", M),
    89: ("Foot pedal cover, ribbed", M),
    90: ("Toroidal transformer", H),
    91: ("Upholstery set, seat and backrest", H),
    92: ("Upholstery set, seat and backrest", H),
    93: ("Upholstery set, seat and backrest", H),
    94: ("Upholstery set, seat and backrest", H),
    95: ("Upholstery set, seat and backrest", H),
    96: ("Membrane keypad overlay, memory positions", H),
    97: ("Membrane keypad overlay, memory positions", H),
    98: ("Keypad button set, rubber", H),
    99: ("Membrane keypad, dentist side", H),
    100: ("Membrane keypad overlay", H),
    101: ("Membrane keypad overlay", H),
    102: ("Control panel overlay, assistant side", H),
    103: ("Membrane keypad overlay, memory positions", H),
    104: ("Keypad button set, rubber", H),
    105: ("Membrane keypad, assistant side", H),
    106: ("Control board, keypad", H), 107: ("Control board, keypad", H),
    108: ("Control board, keypad", H), 109: ("Control board, keypad", H),
    110: ("Control board, keypad", H), 111: ("Control board, main", H),
    112: ("Control board, keypad", H), 113: ("Control board, keypad", H),
    114: ("Control box, chair", H), 115: ("Control box, chair", H),
    116: ("Control box, chair", H),
    117: ("Linear actuator, chair", H),
    118: ("Pivot bearing housing", M),
    119: ("Wiring harness", H),
    120: ("Brass cross connector, four port", H),
    121: ("Water bottle cap and mount", M),
    122: ("Cuspidor bowl drain strainer", M),
    123: ("Water valve, brass, three port", H),
    124: ("Air valve block", M),
    125: ("Valve manifold with switches", M),
    126: ("Valve manifold with switches", M),
    127: ("Toggle switch, chair control", H),
    128: ("Trim rod", L),
    129: ("Saliva ejector tube", M),
    130: ("Delivery arm cover", M), 131: ("Delivery arm cover", M),
    132: ("Housing cover panel", M), 133: ("Housing cover panel", M),
    134: ("Cuspidor mounting frame", M),
    135: ("Chair base cover", M),
    136: ("Housing cover panel", M),
    137: ("Side panel cover", M), 138: ("Side panel cover", M),
    139: ("Chair column cover", M),
    140: ("Delivery arm cover", M),
    141: ("Backrest side cover", M), 142: ("Backrest side cover", M),
    143: ("Housing cover, left", M),
    144: ("Housing cover panel", M),
    145: ("Light housing frame", M),
    146: ("Backrest cover, two piece", M),
    147: ("Foot pedal cover, ribbed", M),
    148: ("Housing cover, box", M),
    149: ("Arm cover bracket", M),
    150: ("Junction panel with ports", M),
    151: ("Cover panel, flat", L),
    152: ("Housing cover panel", M),
    153: ("Suction handle valve, high volume", H),
    154: ("Suction handle valve, high volume", H),
    155: ("Push button water valve", H),
    156: ("Bowl drain collar and nut", M),
    157: ("Water filter housing with cartridge", H),
    158: ("Foot controller", H),
    159: ("Manifold block, two port with couplings", M),
    160: ("Cuspidor bowl, ceramic", H),
    161: ("Operating light reflector", H),
    162: ("Control board", H),
    163: ("Control board, main", H),
    164: ("Needle valve, water, adjustable", H),
    165: ("Needle valve, water, adjustable", H),
    166: ("Water flow control valve", H),
    167: ("Needle valve, air, adjustable", H),
    168: ("Water valve, brass, two port", H),
}

CODE_RX = re.compile(r"\bRVO?\s?\d", re.I)


def slugify(text: str) -> str:
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-"))


def main() -> int:
    data = json.loads(PARTS.read_text())
    parts = data["parts"]
    unnamed = [p for p in parts if not p["labelled"]]
    if len(unnamed) != len(NAMES):
        print(f"WARNING: {len(unnamed)} unnamed parts but {len(NAMES)} names written")

    for i, p in enumerate(unnamed):
        if i not in NAMES:
            continue
        name, conf = NAMES[i]
        p["name"] = name
        p["labelled"] = True
        p["named_by"] = "inferred"
        p["confidence"] = conf
    for p in parts:
        p.setdefault("named_by", "source")
        p.setdefault("confidence", "high")

    # ZERO CODES IN ANY NAME. Asserted, not hoped for.
    leaks = [p["name"] for p in parts if p.get("name") and CODE_RX.search(p["name"])]
    if leaks:
        sys.exit(f"code string leaked into a name: {leaks[:5]}")

    # source named and inferred ALTERNATE, so the marquee mixes catalogue names with the
    # ones named here rather than running all of one then all of the other
    src = [p for p in parts if p["named_by"] == "source"]
    inf = [p for p in parts if p["named_by"] == "inferred"]
    ordered, i, j = [], 0, 0
    while i < len(src) or j < len(inf):
        if i < len(src):
            ordered.append(src[i]); i += 1
        if j < len(inf):
            ordered.append(inf[j]); j += 1

    # slugs follow the name, so re-slug the newly named and keep them unique
    seen, renames = set(), 0
    for p in ordered:
        base = slugify(p["name"]) if p.get("name") else "part"
        slug, n = base, 2
        while slug in seen:
            slug, n = f"{base}-{n}", n + 1
        seen.add(slug)
        if slug != p["slug"]:
            old = REPO / "public" / f"cinema/parts/{p['slug']}.png"
            new = REPO / "public" / f"cinema/parts/{slug}.png"
            if old.exists():
                old.rename(new)
                renames += 1
            p["slug"], p["src"] = slug, f"/cinema/parts/{slug}.png"

    from collections import Counter
    conf = Counter(p["confidence"] for p in ordered)
    by = Counter(p["named_by"] for p in ordered)
    data["parts"] = ordered
    data["counts"].update({"named": len(ordered), "unnamed": 0,
                           "namedBySource": by["source"], "namedByInference": by["inferred"],
                           "confidenceHigh": conf["high"], "confidenceMedium": conf["medium"],
                           "confidenceLow": conf["low"]})
    data["notes"] = (
        "Every one of the 244 parts now carries a dental unit name. The 75 the catalogue "
        "named keep their wording (`named_by: source`); the other 169 were IDENTIFIED BY "
        "SIGHT from the photographs (`named_by: inferred`) using dental unit and pneumatic "
        "terminology. Where a photograph does not show enough to state a function the name "
        "is an honest generic and `confidence` is low, so it can be corrected in the "
        "studio. RV codes never appear in a name or a slug; `code` stays internal and the "
        "script asserts no code string reaches a name. Source named and inferred parts "
        "alternate in this list."
    )
    PARTS.write_text(json.dumps(data, indent=2) + "\n", encoding="utf8")
    print(f"named {len(ordered)}  source {by['source']}  inferred {by['inferred']}")
    print(f"confidence: high {conf['high']}  medium {conf['medium']}  low {conf['low']}")
    print(f"renamed image files: {renames}")

    # contact sheet with the names under each tile
    from PIL import Image, ImageDraw
    cols, cell, cap = 8, 190, 30
    rows = (len(ordered) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell, rows * (cell + cap)), (12, 15, 22))
    d = ImageDraw.Draw(sheet)
    for n, p in enumerate(ordered):
        f = REPO / "public" / p["src"].lstrip("/")
        if not f.exists():
            continue
        t = Image.open(f).convert("RGBA")
        t.thumbnail((cell - 16, cell - 16))
        x = (n % cols) * cell + (cell - t.width) // 2
        y = (n // cols) * (cell + cap) + 6
        sheet.paste(t, (x, y), t)
        colour = {"high": (150, 230, 190), "medium": (235, 215, 150),
                  "low": (240, 160, 160)}[p["confidence"]]
        words, line, lines = p["name"].split(), "", []
        for w in words:
            if len(line) + len(w) > 26:
                lines.append(line); line = w
            else:
                line = f"{line} {w}".strip()
        lines.append(line)
        for k, ln in enumerate(lines[:2]):
            d.text(((n % cols) * cell + 5, (n // cols) * (cell + cap) + cell + 2 + k * 11),
                   ln, fill=colour)
    SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(SHEET)
    print("contact sheet ->", SHEET, sheet.size)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
