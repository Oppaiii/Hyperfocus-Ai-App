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
- Local-only manual saved-insight capture from the Focus Feed

No AI logic or external content source integrations are implemented yet.

Saved mentors, goals, and insights are stored in the app's local browser storage for now. The Focus Feed snapshot is generated from that local data only. There is no syncing, search, analytics, AI processing, or external API connection.

## Run locally

```bash
npm install
npm start
```