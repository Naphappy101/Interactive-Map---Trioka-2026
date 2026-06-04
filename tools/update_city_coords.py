from pathlib import Path
import re

from trioka_map_report import REPORTS_FOLDER

"""
Simple city coordinate exporter.

This script is meant to live inside the tools folder.

Example location:
Interactive Map - Trioka 2026/tools/update_city_coords.py

It reads:
Interactive Map - Trioka 2026/src/data/locations.js

It writes:
Interactive Map - Trioka 2026/tools/city_coords.txt

Run it with:
python tools/update_city_coords.py
"""

# Finds the tools folder.
TOOLS_FOLDER = Path(__file__).resolve().parent

# Goes one folder up from tools to the main project folder.
PROJECT_FOLDER = TOOLS_FOLDER.parent

# File paths.
LOCATIONS_FILE = PROJECT_FOLDER / "src" / "data" / "locations.js"
OUTPUT_FILE = TOOLS_FOLDER / "city_coords.txt"


def read_locations_file():
    """
    Reads the full locations.js file as plain text.
    """
    if not LOCATIONS_FILE.exists():
        raise FileNotFoundError(
            f"Could not find locations.js at this path:\n{LOCATIONS_FILE}"
        )

    return LOCATIONS_FILE.read_text(encoding="utf-8")


def find_city_blocks(file_text):
    """
    Finds each city object inside the locations.js file.

    This is a simple parser built for normal city objects.
    It looks for object blocks that contain a name, x, and y value.
    """
    return re.findall(r"\{[\s\S]*?\}", file_text)


def get_string_value(block, key):
    """
    Gets a string value from a city block.

    Example:
    name: "Riverscrown"
    """
    pattern = rf'{key}\s*:\s*["\']([^"\']+)["\']'
    match = re.search(pattern, block)

    if not match:
        return None

    return match.group(1)


def get_number_value(block, key):
    """
    Gets a number value from a city block.

    Example:
    x: 492
    y: 225
    """
    pattern = rf"{key}\s*:\s*(-?\d+)"
    match = re.search(pattern, block)

    if not match:
        return None

    return int(match.group(1))


def collect_cities(file_text):
    """
    Pulls city name, x coordinate, and y coordinate from each city object.
    """
    city_blocks = find_city_blocks(file_text)
    city_list = []

    for block in city_blocks:
        name = get_string_value(block, "name")
        x = get_number_value(block, "x")
        y = get_number_value(block, "y")

        # Skip anything that is not a real city entry.
        if name is None or x is None or y is None:
            continue

        city_list.append(
            {
                "name": name,
                "x": x,
                "y": y,
            }
        )

    return city_list


def write_city_coords(city_list):
    """
    Writes a simple readable text document with all city coordinates.
    """
    lines = []
    lines.append("City Coordinates")
    lines.append("================")
    lines.append("")

    for city in city_list:
        lines.append(f'{city["name"]}: x={city["x"]}, y={city["y"]}')

    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")


def main():
    """
    Main script steps.
    """
    print(f"Reading from: {LOCATIONS_FILE}")
    print(f"Writing to:   {OUTPUT_FILE}")

    file_text = read_locations_file()
    city_list = collect_cities(file_text)
    write_city_coords(city_list)

    print("")
    print(f"Updated {OUTPUT_FILE}")
    print(f"Found {len(city_list)} cities.")


if __name__ == "__main__":
    main()