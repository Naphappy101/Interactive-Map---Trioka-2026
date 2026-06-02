from pathlib import Path


# ---------------------------------------------
# Basic project settings
# ---------------------------------------------
# This script is meant to be run from the root of your React project.
# It expects:
#   src/data/locations.js
#   public/portraits/
#
# It does not edit your files.
# It only reads data and writes a report.

MAP_WIDTH = 1578
MAP_HEIGHT = 996

PROJECT_ROOT = Path(__file__).resolve().parents[1]
LOCATIONS_FILE = PROJECT_ROOT / "src" / "data" / "locations.js"
PUBLIC_FOLDER = PROJECT_ROOT / "public"

REPORTS_FOLDER = PROJECT_ROOT / "tools" / "reports"
REPORT_FILE = REPORTS_FOLDER / "trioka_map_report.txt"


# ---------------------------------------------
# Small parser helpers
# ---------------------------------------------
# locations.js is JavaScript, not JSON.
# So we are doing a simple controlled parser for your city objects.
# This expects data shaped like:
#
# export const cities = [
#   {
#     id: "beacon",
#     name: "Beacon",
#     type: "Capital City",
#     isPort: true,
#     x: 821,
#     y: 339,
#     portraits: "/portraits/Beacon.jpg",
#     description: "Some text.",
#   },
# ];


def read_text_file(file_path):
    """Read a text file safely."""
    if not file_path.exists():
        raise FileNotFoundError(f"Could not find file: {file_path}")

    return file_path.read_text(encoding="utf-8")


def find_cities_array_text(js_text):
    """Find the inside of the cities array from locations.js."""
    marker = "cities"
    marker_index = js_text.find(marker)

    if marker_index == -1:
        raise ValueError("Could not find 'cities' in locations.js.")

    array_start = js_text.find("[", marker_index)

    if array_start == -1:
        raise ValueError("Could not find the opening '[' for the cities array.")

    bracket_depth = 0

    for index in range(array_start, len(js_text)):
        character = js_text[index]

        if character == "[":
            bracket_depth += 1

        elif character == "]":
            bracket_depth -= 1

            if bracket_depth == 0:
                return js_text[array_start + 1:index]

    raise ValueError("Could not find the closing ']' for the cities array.")


def split_city_objects(array_text):
    """Split the cities array into individual object text blocks."""
    objects = []
    brace_depth = 0
    object_start = None

    for index, character in enumerate(array_text):
        if character == "{":
            if brace_depth == 0:
                object_start = index

            brace_depth += 1

        elif character == "}":
            brace_depth -= 1

            if brace_depth == 0 and object_start is not None:
                objects.append(array_text[object_start:index + 1])
                object_start = None

    return objects


def parse_js_value(text, start_index):
    """Parse a simple JavaScript value starting at start_index."""
    index = start_index

    while index < len(text) and text[index].isspace():
        index += 1

    if index >= len(text):
        return None, index

    first_char = text[index]

    # Parse quoted strings.
    if first_char in ['"', "'", "`"]:
        quote = first_char
        index += 1
        value_chars = []

        while index < len(text):
            current = text[index]

            if current == "\\" and index + 1 < len(text):
                value_chars.append(text[index + 1])
                index += 2
                continue

            if current == quote:
                index += 1
                return "".join(value_chars), index

            value_chars.append(current)
            index += 1

        return "".join(value_chars), index

    # Parse normal values: numbers, true, false.
    value_start = index

    while index < len(text) and text[index] not in [",", "\n", "}"]:
        index += 1

    raw_value = text[value_start:index].strip()

    if raw_value == "true":
        return True, index

    if raw_value == "false":
        return False, index

    try:
        return int(raw_value), index
    except ValueError:
        return raw_value, index


def parse_city_object(object_text):
    """Parse one city object into a Python dictionary."""
    city = {}

    possible_keys = [
        "id",
        "name",
        "type",
        "isPort",
        "x",
        "y",
        "portraits",
        "description",
    ]

    for key in possible_keys:
        key_pattern = f"{key}:"
        key_index = object_text.find(key_pattern)

        if key_index == -1:
            continue

        value_start = key_index + len(key_pattern)
        value, _ = parse_js_value(object_text, value_start)

        city[key] = value

    return city


def load_cities():
    """Load all city objects from locations.js."""
    js_text = read_text_file(LOCATIONS_FILE)
    array_text = find_cities_array_text(js_text)
    object_texts = split_city_objects(array_text)

    cities = []

    for object_text in object_texts:
        city = parse_city_object(object_text)

        if city:
            cities.append(city)

    return cities


# ---------------------------------------------
# Report checks
# ---------------------------------------------


def get_duplicate_ids(cities):
    """Find duplicate city IDs."""
    seen = set()
    duplicates = []

    for city in cities:
        city_id = city.get("id")

        if city_id in seen:
            duplicates.append(city_id)
        else:
            seen.add(city_id)

    return duplicates


def get_coordinates_outside_map(cities):
    """Find cities with coordinates outside the map boundaries."""
    bad_coordinates = []

    for city in cities:
        x = city.get("x")
        y = city.get("y")

        if not isinstance(x, int) or not isinstance(y, int):
            bad_coordinates.append((city.get("name", "Unknown"), x, y, "Missing or invalid x/y"))
            continue

        if x < 0 or x > MAP_WIDTH or y < 0 or y > MAP_HEIGHT:
            bad_coordinates.append((city.get("name", "Unknown"), x, y, "Outside map bounds"))

    return bad_coordinates


def get_under_construction_cities(cities):
    """Find cities still using UnderConstruction portraits."""
    results = []

    for city in cities:
        portrait = str(city.get("portraits", ""))

        if "UnderConstruction" in portrait:
            results.append(city)

    return results


def get_missing_portrait_files(cities):
    """Check if each portrait file actually exists in public/."""
    missing = []

    for city in cities:
        portrait = city.get("portraits")

        if not portrait:
            missing.append((city.get("name", "Unknown"), "No portrait path listed"))
            continue

        # Web paths start with /portraits/FileName.jpg
        # Convert that into public/portraits/FileName.jpg
        portrait_path = PUBLIC_FOLDER / portrait.lstrip("/")

        if not portrait_path.exists():
            missing.append((city.get("name", "Unknown"), portrait))

    return missing


def get_possible_missing_port_tags(cities):
    """Find cities that sound like ports but do not have isPort: true."""
    port_words = [
        "port",
        "harbor",
        "harbour",
        "dock",
        "docks",
        "bay",
        "cove",
        "landing",
        "coast",
        "sea",
        "seafaring",
        "frozen solid",
        "ships",
    ]

    possible_missing = []

    for city in cities:
        if city.get("isPort") is True:
            continue

        combined_text = " ".join(
            [
                str(city.get("id", "")),
                str(city.get("name", "")),
                str(city.get("description", "")),
            ]
        ).lower()

        for word in port_words:
            if word in combined_text:
                possible_missing.append(city)
                break

    return possible_missing


def get_city_counts(cities):
    """Count city categories."""
    total = len(cities)

    capital_count = 0
    port_count = 0
    capital_port_count = 0
    major_count = 0

    for city in cities:
        is_capital = city.get("type") == "Capital City"
        is_port = city.get("isPort") is True

        if is_capital:
            capital_count += 1

        if is_port:
            port_count += 1

        if is_capital and is_port:
            capital_port_count += 1

        if city.get("type") == "Major City":
            major_count += 1

    return {
        "total": total,
        "capital_count": capital_count,
        "port_count": port_count,
        "capital_port_count": capital_port_count,
        "major_count": major_count,
    }


# ---------------------------------------------
# Report writing
# ---------------------------------------------


def add_section(lines, title):
    """Add a section header to the report."""
    lines.append("")
    lines.append("=" * 60)
    lines.append(title)
    lines.append("=" * 60)


def build_report(cities):
    """Build the full text report."""
    counts = get_city_counts(cities)
    duplicate_ids = get_duplicate_ids(cities)
    bad_coordinates = get_coordinates_outside_map(cities)
    under_construction = get_under_construction_cities(cities)
    missing_portraits = get_missing_portrait_files(cities)
    possible_missing_ports = get_possible_missing_port_tags(cities)

    lines = []

    lines.append("TRIOKA INTERACTIVE MAP REPORT")
    lines.append("")
    lines.append(f"Locations file: {LOCATIONS_FILE}")
    lines.append(f"Portrait folder: {PUBLIC_FOLDER / 'portraits'}")

    add_section(lines, "SUMMARY")
    lines.append(f"Total cities: {counts['total']}")
    lines.append(f"Capital cities: {counts['capital_count']}")
    lines.append(f"Major cities: {counts['major_count']}")
    lines.append(f"Port cities: {counts['port_count']}")
    lines.append(f"Capital port cities: {counts['capital_port_count']}")

    add_section(lines, "CITIES STILL USING UNDER CONSTRUCTION")
    if under_construction:
        for city in under_construction:
            lines.append(f"- {city.get('name', 'Unknown')} ({city.get('id', 'no-id')})")
    else:
        lines.append("None found.")

    add_section(lines, "MISSING PORTRAIT FILES")
    if missing_portraits:
        for city_name, portrait in missing_portraits:
            lines.append(f"- {city_name}: {portrait}")
    else:
        lines.append("None found.")

    add_section(lines, "POSSIBLE MISSING isPort: true TAGS")
    if possible_missing_ports:
        for city in possible_missing_ports:
            lines.append(f"- {city.get('name', 'Unknown')} ({city.get('id', 'no-id')})")
    else:
        lines.append("None found.")

    add_section(lines, "DUPLICATE CITY IDS")
    if duplicate_ids:
        for city_id in duplicate_ids:
            lines.append(f"- {city_id}")
    else:
        lines.append("None found.")

    add_section(lines, "COORDINATES OUTSIDE MAP BOUNDS")
    if bad_coordinates:
        for city_name, x, y, reason in bad_coordinates:
            lines.append(f"- {city_name}: x={x}, y={y} — {reason}")
    else:
        lines.append("None found.")

    add_section(lines, "ALL CITIES")
    for city in cities:
        name = city.get("name", "Unknown")
        city_id = city.get("id", "no-id")
        city_type = city.get("type", "Unknown Type")
        x = city.get("x", "?")
        y = city.get("y", "?")
        is_port = city.get("isPort") is True
        portrait = city.get("portraits", "No portrait")

        port_text = "Port" if is_port else "Not Port"

        lines.append(f"- {name} | {city_type} | {port_text} | id={city_id} | x={x}, y={y} | {portrait}")

    return "\n".join(lines)


def main():
    """Run the report script."""
    print("Reading Trioka map data...")
    cities = load_cities()

    print(f"Found {len(cities)} cities.")
    print("Building report...")

    REPORTS_FOLDER.mkdir(parents=True, exist_ok=True)
    report_text = build_report(cities)

    REPORT_FILE.write_text(report_text, encoding="utf-8")

    print("")
    print("Report created successfully.")
    print(f"Report file: {REPORT_FILE}")


if __name__ == "__main__":
    main()