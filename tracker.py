#!/usr/bin/env python3
"""CLI tool to track university applications, stored in a local JSON file."""
import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

DATA_FILE = Path(__file__).parent / "applications.json"
STATUSES = ["not contacted", "emailed", "replied", "closed"]
DATE_FORMAT = "%Y-%m-%d"


def load_entries():
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open("r") as f:
        return json.load(f)


def save_entries(entries):
    with DATA_FILE.open("w") as f:
        json.dump(entries, f, indent=2)


def parse_deadline(value):
    try:
        datetime.strptime(value, DATE_FORMAT)
    except ValueError:
        raise argparse.ArgumentTypeError(f"deadline must be in {DATE_FORMAT} format, got '{value}'")
    return value


def cmd_add(args):
    entries = load_entries()
    entries.append({
        "university": args.university,
        "programme": args.programme,
        "deadline": args.deadline,
        "contact": args.contact,
        "status": "not contacted",
    })
    save_entries(entries)
    print(f"Added: {args.university} ({args.programme}), deadline {args.deadline}")


def cmd_list(args):
    entries = load_entries()
    if not entries:
        print("No entries yet.")
        return
    entries = sorted(entries, key=lambda e: e["deadline"])

    widths = {
        "university": max(len("University"), max(len(e["university"]) for e in entries)),
        "programme": max(len("Programme"), max(len(e["programme"]) for e in entries)),
        "deadline": max(len("Deadline"), len(DATE_FORMAT)),
        "contact": max(len("Contact"), max(len(e["contact"]) for e in entries)),
        "status": max(len("Status"), max(len(e["status"]) for e in entries)),
    }

    def row(u, p, d, c, s):
        return (f"{u:<{widths['university']}}  {p:<{widths['programme']}}  "
                f"{d:<{widths['deadline']}}  {c:<{widths['contact']}}  {s:<{widths['status']}}")

    print(row("University", "Programme", "Deadline", "Contact", "Status"))
    print("-" * (sum(widths.values()) + 8))
    for i, e in enumerate(entries):
        print(f"[{i}] " + row(e["university"], e["programme"], e["deadline"], e["contact"], e["status"]))


def cmd_status(args):
    entries = load_entries()
    entries_sorted = sorted(entries, key=lambda e: e["deadline"])
    if args.index < 0 or args.index >= len(entries_sorted):
        print(f"Error: index {args.index} out of range (run 'list' to see valid indices).", file=sys.stderr)
        sys.exit(1)
    target = entries_sorted[args.index]
    for e in entries:
        if e is target:
            e["status"] = args.new_status
            break
    save_entries(entries)
    print(f"Updated {target['university']} ({target['programme']}) to status '{args.new_status}'")


def main():
    parser = argparse.ArgumentParser(description="Track university applications.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    p_add = subparsers.add_parser("add", help="Add a new application entry")
    p_add.add_argument("university", help="University name")
    p_add.add_argument("programme", help="Programme name")
    p_add.add_argument("deadline", type=parse_deadline, help=f"Deadline ({DATE_FORMAT})")
    p_add.add_argument("contact", help="Contact person")
    p_add.set_defaults(func=cmd_add)

    p_list = subparsers.add_parser("list", help="List all entries sorted by deadline")
    p_list.set_defaults(func=cmd_list)

    p_status = subparsers.add_parser("status", help="Mark an entry's status")
    p_status.add_argument("index", type=int, help="Entry index, as shown by 'list'")
    p_status.add_argument("new_status", choices=STATUSES, help="New status")
    p_status.set_defaults(func=cmd_status)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
