# Wardrobe Assignment (React Native / Expo)

A single-screen Expo / React Native app that recreates the "Saved" wardrobe experience (Collections, Outfits and Items) from a reference video.

![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.79-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)

> Status: assignment - Type: mobile / web UI (Expo) - Live demo: [Expo Snack](https://snack.expo.dev/@vineeth1007/react-native-assignment-monova)

## Overview

This project is a take-home style UI exercise: rebuild the wardrobe UI and interaction flow shown in a provided reference video using React Native, and run it in the browser through **Expo Snack (React Native Web)**.

The app is a "Saved" screen with a segmented control (Collections / Outfits / Items), filter chips, snapping card lists, an items grid/list with category filters, an animated sparkle button and a bottom tab bar. It is a front-end only exercise: all data is mocked in code and all state is local React state.

**Live demo (web, via Expo Snack):** [React Native Assignment - Monova](https://snack.expo.dev/@vineeth1007/react-native-assignment-monova)

## Features

What was replicated from the video:

- **Segmented tabs**: Collections, Outfits and Items, with a "Saved" header and a bottom tab bar.
- **Items preview**
  - Grid and list layouts with product image and category, style and color badges
  - Category filter chips and "active filter" pills that update the results immediately (client-side)
  - Loading skeleton and empty-state placeholders
- **Outfits and Collections**
  - Scrollable cards; the Work / Leisure / Design chips filter them by tag
  - Each outfit card shows Top + Bottom + Footwear + (optional) Outerwear, with title and tag chips below
  - Collection cards use a 4-tile image layout with a bookmark badge
  - Snap-to-card scrolling (`snapToInterval`)
- **Visual and interaction fidelity**
  - Spacing, type scale, card shapes and chip styles were styled to follow the reference
  - Animations and micro-interactions (see below)
  - Layout targets phone-sized screens (not tested across devices in this repository)

### Animations and interactions

- **Card entrance**: fade + translate-up on mount, staggered per card, via the `useEntrance` hook (260 ms per card, 35 ms stagger)
- **Press feedback**: springy scale-down (to 0.98) on chips and segmented tabs via the `usePressScale` hook
- **Scroll snapping**: `snapToInterval` of 300 px with a tuned deceleration rate in the Collections and Outfits lists
- **Framed images**: subtle shadow and grey frame for visual hierarchy
- **Sparkle floating action button**: slides down as the list scrolls (0 to 40 px over the first 140 px of scroll)

## Tech stack

| Area | Details |
|---|---|
| Framework | Expo SDK 53 (`expo ~53.0.22`), React Native 0.79.6, React 19.0.0 |
| Language | TypeScript ~5.8.3 (strict mode) |
| Icons | `@expo/vector-icons` ^14.1.0 (Feather, MaterialCommunityIcons) |
| Demo hosting | Expo Snack (web) |

Versions are taken from `package.json`.

## Data

There is no backend and no dataset to download. All content is defined in `App.tsx`:

- 12 mock items (`it1` to `it12`), each with a category (Top / Bottom / Footwear / Outerwear), a color (Black / Blue / Brown / White) and a style (Casual / Formal)
- 5 collections (`c1` to `c5`: Work, Leisure, Design, Work, Leisure)
- 3 outfits (`o1` "City Casual", `o2` "Weekend Stroll", `o3` "Monochrome")
- Images are remote URLs (Unsplash and Pinterest image hosts), so they need a network connection and are not committed to the repository

## How to run

### On Snack (recommended)

1. Open the Snack URL: [Snack Demo](https://snack.expo.dev/@vineeth1007/react-native-assignment-monova)
2. Select **Web** in the top toolbar to run in the browser.
3. The app loads instantly, no setup required.

### Locally (optional)

If you want to run outside Snack:

```bash
# Clone repo
git clone https://github.com/Vineeth1007/React-Native-Assignment-Monova.git
cd React-Native-Assignment-Monova

# Install dependencies
npm install

# Start Expo
npm start

# Press "w" to run on Web
```

Notes for running locally (checked by exporting a web bundle from a scratch copy of this repository):

- `package.json` is a Snack export and does not list the packages Expo needs for web. Before pressing `w`, install them with `npx expo install react-dom react-native-web @expo/metro-runtime expo-asset`. Without them the web bundle fails to build. The command also adds these packages to `package.json` and an `expo-asset` plugin entry to `app.json`.
- `app.json` references icon, splash and favicon images under `./assets/`, which are not included in this repository. The web export still completed in that test, but the icon and splash images will be missing in native builds until an `assets/` folder is added.

## Project structure

```text
React-Native-Assignment-Monova/
├── App.tsx        # The whole app: tokens, hooks, components, mock data and the App component (1,154 lines)
├── index.ts       # Entry point; registers App with registerRootComponent
├── app.json       # Expo configuration (name, icons, splash, new architecture enabled)
├── package.json   # Dependencies and the expo start scripts
├── tsconfig.json  # Extends expo/tsconfig.base with strict mode
├── .gitignore     # Standard Expo ignores
└── README.md      # This file
```

`App.tsx` and `index.ts` stay at the repository root because Expo Snack and `package.json` (`"main": "index.ts"`) expect them there.

### Component structure

```text
App.tsx
 ├─ Tokens
 │   └─ COLOR, RAD, SHADOW, S (colors, radii, shadows, 4px spacing helper), CARD_SNAP
 ├─ Utilities
 │   ├─ usePressScale (chip and segment press micro-interaction)
 │   └─ useEntrance (card entrance animation)
 ├─ Components
 │   ├─ Segmented (top tab switcher: Collections / Outfits / Items)
 │   ├─ Chip (filter and action chips, solid/dashed styles)
 │   ├─ FramedImage (image container with frame + shadow)
 │   ├─ Badge (inline label for category/style)
 │   ├─ ColorDotChip (color dot shown on item cards)
 │   ├─ ItemCard & ItemListRow (grid/list renderers)
 │   ├─ CollectionCard (4-tile layout with bookmark)
 │   ├─ OutfitCard (Top + Bottom + Footwear + optional Outerwear)
 │   ├─ SparkleFab (floating sparkle button)
 │   └─ BottomTabs (Home, Collections, Saved icons)
 ├─ Sections
 │   ├─ CollectionsSection (scrollable list of CollectionCards)
 │   ├─ OutfitsSection (scrollable list of OutfitCards)
 │   └─ ItemsSection -> ItemsGrid (grid/list view with category filters)
 ├─ Mock data (ITEMS, COLLECTIONS, OUTFITS)
 └─ App (main entry point)
```

### State management

- Local React state only (`useState`, `useMemo`); no external or global state library
- The selected segment (`Collections` / `Outfits` / `Items`) and the active tag chip (`Work`, `Leisure`, `Design`) live in `App`; the active chip filters Collections and Outfits by tag
- Item category filters are stored in a `Set`, so the chips update the Items list client-side
- `grid` / `list` view mode is local state inside `ItemsGrid`

## Limitations and known issues

- **Images**: remote Unsplash and Pinterest URLs. They are fine for a demo but need a network connection and could change or disappear.
- **Data**: mocked in code (12 items, 5 collections, 3 outfits). There is no backend: all state and filtering is client-side only.
- **Visual-only controls**: the "+ Add new" chip, the sparkle button (labelled "Magic sort"), the collection bookmark badge, the Collections and Saved bottom tabs and the outfit chevron have no behavior attached. Only the Home tab (returns to Collections), the segments and the chips are interactive.
- **Snap interval**: tuned to a fixed 300 px (`CARD_SNAP`); it may need adjusting if card sizes change.
- **Accessibility**: roles and labels are set on the segmented control, chips, bookmark badge, sparkle button and bottom tabs; chips have a 40 px minimum height and the bottom tabs and bookmark badge 44 px. There has been no formal WCAG audit.
- **Fake loading delay**: the Items section shows skeleton placeholders for a 20 ms `setTimeout` before rendering, which is effectively instant.
- **Unused dependency**: `react-native-paper` 4.9.2 is declared in `package.json` but is not imported by `App.tsx`.
- **Single file**: the whole app lives in one 1,154-line `App.tsx`, which suits a Snack assignment but would be split into modules in a larger codebase.
- **Reproducibility**: there is no lockfile, so installs are only constrained by the ranges in `package.json`.
- **Not included**: the reference video and the original assignment brief are not part of this repository.

## Deliverables summary

- **Expo Snack (web):** [Snack Demo](https://snack.expo.dev/@vineeth1007/react-native-assignment-monova)
- **GitHub repo:** [React-Native-Assignment-Monova](https://github.com/Vineeth1007/React-Native-Assignment-Monova.git)
- **README.md** (this file)

## Credits

- Built on the standard Expo Snack TypeScript project layout (`index.ts` with `registerRootComponent`).
- Product and outfit images are hot-linked from Unsplash and Pinterest image hosts and remain the property of their respective owners.
- Libraries: Expo, React Native, React and `@expo/vector-icons`.

## License

No license file - all rights reserved by the respective authors. `package.json` declares `"license": "0BSD"`, but the repository does not contain a LICENSE file.
