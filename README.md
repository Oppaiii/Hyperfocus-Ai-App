# Hyperfocus-Ai-App

A private desktop app concept for curated influence, goal focus, and a future AI coach.

The app is intended to help a user select a small number of trusted voices, connect them to personal goals or values, and reduce distraction over time.

## Phase 1

This first pass contains only the app foundation:

- Electron app shell
- Dark, modern main navigation
- Placeholder screens for Focus Feed, Mentors / Sources, Goals / Values, Saved Insights, AI Coach, and Settings
- Local-only manual entry, editing, and deletion for mentors / sources and goals / values
- Local-only Focus Feed alignment snapshot built from saved mentors and goals
- Guided Home empty state for a fresh local profile
- Local-only Today's focus field on Home
- Local-only Recent activity section for latest additions
- Local-only manual saved-insight capture and deletion from the Focus Feed
- Local-only AI Coach screen skeleton for future coaching logic
- Local-only AI Coach manual check-in note
- Local-only action to save coach reflections as Saved Insights
- Local-only AI Coach prompt builder and prompt preview
- Local-only Settings reset control for clearing app data

No AI logic or external content source integrations are implemented yet.

Saved mentors, goals, and insights are stored in the app's local browser storage for now. The Focus Feed snapshot is generated from that local data only, and Settings can clear the local app state after confirmation. There is no syncing, search, analytics, AI processing, or external API connection.

## Run locally

```bash
npm install
npm start
```

## Verify

```bash
npm test
```