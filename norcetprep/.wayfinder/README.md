# Wayfinder tracker (local markdown)

Canonical planning artifacts for the **Monetize NORCET Prep** effort. No external
issue tracker is configured for this repo, so issues live here as markdown files.

## Layout

- [map.md](map.md) — the map (label `wayfinder:map`): destination, decisions index,
  fog of war. Load this first, every session.
- `tickets/tNN-slug.md` — child issues of the map. Frontmatter is the tracker state.
- `assets/` — research findings and prototypes, linked from tickets (never pasted in).
- `frontier.mjs` — run `node norcetprep/.wayfinder/frontier.mjs` to see what's takeable.

## Ticket frontmatter

```yaml
id: T07                        # identity — referenced by blocked-by
title: Platform & entitlement architecture   # the NAME; refer to tickets by name, never bare id
labels: [wayfinder:grilling]   # one of: research | prototype | grilling | task
status: open                   # open | closed
assignee: none                 # claim before any work; none = unclaimed
blocked-by: []                 # ticket ids; unblocked when every listed ticket is closed
```

## Wayfinding operations

- **Claim** — set `assignee` (e.g. `amit`, `research-agent`) *before* any work, so
  concurrent sessions skip the ticket. Open + unassigned = unclaimed.
- **Resolve** — append a `## Resolution` section holding the answer, set
  `status: closed`, then add a one-line entry to the map's *Decisions so far*
  linking the ticket by name.
- **Blocking** — `blocked-by` lists ticket ids. **Frontier** = open ∧ unblocked ∧
  unclaimed; `frontier.mjs` computes and prints the lanes.
- **Concurrency** — a session edits only its claimed ticket and its own asset
  files. Only the session driving the map edits `map.md`.
- **One ticket per session** — research tickets exempt (they run as parallel AFK
  agents).
- This repo is **public** (GitHub Pages): no credentials, keys, or personal data
  in any tracker file.
