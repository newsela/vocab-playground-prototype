# CLAUDE.md — Vocab Playground Prototype

## Overview

Interactive vocabulary game suite prototype for internal testing at Newsela. Four games targeting different vocabulary learning approaches, built with React + TypeScript + Vite.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for dev/build
- **Tailwind CSS 4** for styling
- **Framer Motion 12** for animations (NOT for drag-and-drop — see below)

## Games

| Game | Component | Mechanic |
|------|-----------|----------|
| Context Clue Sleuth | `ContextClueSleuth.tsx` | Click 2 context clues in a sentence, then pick the vocab word |
| Hot or Not | `HotOrNot.tsx` | Timed correct/incorrect word usage judgment |
| Intensity Meter | `IntensityMeter.tsx` | Drag-and-drop synonym ranking on a thermometer |
| Synonym Swap | `SynonymSwap.tsx` | Hover to preview replacements, click the imposter |
| Passkeys | `Passkeys.tsx` | Find vocabulary words in article text |

## Key Architecture

- `src/games/` — Game components
- `src/data/wordSets.ts` — All vocabulary content (hardcoded)
- `src/state/useGameState.ts` — Global score, streak, and game progress state
- `src/utils/scoring.ts` — Scoring logic per game
- `src/components/` — Shared UI (Navbar, GameDashboard, FeedbackOverlay, etc.)

## Important Implementation Notes

### Drag-and-Drop: Use Native HTML5 DnD, NOT Framer Motion Reorder

Framer Motion's `Reorder` component does not work reliably in v12 for drag-and-drop reordering. The Intensity Meter game uses **native HTML5 drag-and-drop** (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) instead.

If adding new drag-and-drop interactions:
- Use native HTML5 DnD API
- Use Framer Motion only for animations (transitions, spring physics, AnimatePresence)
- Do NOT use `Reorder.Group` / `Reorder.Item` from framer-motion

### Timers: Keep Kid-Friendly

This prototype is tested with K-12 students. Timer durations should account for reading time:
- **Hot or Not**: 10 seconds per round (students need to read a full sentence + decide)
- If adding new timed games, err on the side of more time — you can always reduce later

### Intensity Meter Data Model

The `wordSets` data stores intensity words in **low-to-high order** (`data.words[0]` = weakest).
The UI stores slots in **display order** (`slots[0]` = top of thermometer = strongest).
Convert between them with `.reverse()` when scoring.

### Scoring

- All scoring functions are in `src/utils/scoring.ts`
- Hot or Not: time-based (faster = more points, linear scale)
- Intensity Meter: pairwise comparison (partial credit for correct relative orderings)
- Context Clue Sleuth: 500 base + 100 clue bonus
- Synonym Swap: 400 flat

### Feedback Overlay

`FeedbackOverlay.tsx` is a shared component that auto-dismisses after 1.5 seconds. It shows animated check/X marks and point values. Individual games show their own persistent explanatory text separately.

## Running Locally

```bash
npm install
npm run dev
# Opens at http://localhost:5173/
```

## Content

Vocabulary content is hardcoded in `wordSets.ts` with two article themes:
1. "The Secret Language of Trees" (Resilience)
2. "The Rise of the Robot Chef" (Automation)

To add new content, follow the existing `WordSet` type structure in that file.
