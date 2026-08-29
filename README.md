# PhD Tracker

A simple command-line tool to track university applications. Data is stored
in a local JSON file (`applications.json`, created automatically next to
`tracker.py`) — no database required.

Each entry tracks:

- University name
- Programme
- Deadline (`YYYY-MM-DD`)
- Contact person
- Status: `not contacted` / `emailed` / `replied` / `closed`

## Usage

Add an entry (new entries start as `not contacted`):

```
python3 tracker.py add "MIT" "PhD CS" 2026-12-01 "Jane Doe"
```

List all entries as a table (university, programme, deadline, status),
sorted by deadline. Entries due within 14 days are highlighted (and marked
with `<- due soon!`), unless their status is `closed`:

```
python3 tracker.py list
```

Mark an entry's status, using the index shown by `list`:

```
python3 tracker.py status 0 emailed
```

Valid statuses: `not contacted`, `emailed`, `replied`, `closed`.
