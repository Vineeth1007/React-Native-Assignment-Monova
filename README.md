# Wardrobe Assignment

Recreation of the wardrobe UI/interaction flow from the provided reference video, built with **Expo Snack (React Native Web)**.  

🔗 **Live Demo (Web via Expo Snack):**  
[React Native Assignment – Monova](https://snack.expo.dev/@vineeth1007/react-native-assignment-monova)

---

## 🚀 How to run

### On Snack (recommended)
1. Open the Snack URL: [Snack Demo](https://snack.expo.dev/@vineeth1007/react-native-assignment-monova)  
2. Select **Web** in the top toolbar to run in browser.  
3. The app will load instantly — no setup required.  

### Locally (optional)
If you want to run outside Snack:

```bash
# Clone repo
git clone https://github.com/<your-username>/wardrobe-assignment.git
cd wardrobe-assignment

# Install dependencies
npm install

# Start Expo
npm start

# Press "w" to run on Web
```

---

## 📹 What was replicated from the video

- **Items Preview**
  - Grid & list layouts with product image, category, color, style badges
  - Filter chips and “active-filter” pills that update results in real time
  - Empty & loading placeholders

- **Outfits & Collections**
  - Scrollable cards
  - Each card shows **Top + Bottom + Footwear + (optional Outerwear)**
  - Title and tag chips displayed below
  - Smooth scroll with snap-to-card alignment

- **Visual & Interaction Fidelity**
  - Layout spacing, typography scale, card shapes, and chip styles matched to reference
  - Smooth animations and micro-interactions
  - Responsive for typical mobile resolutions
  - Accessibility: logical tab order, hit areas ≥44px

---

## 📂 Component structure & state management

```
app.tsx
 ├─ Tokens
 │   └─ COLOR, RAD, SHADOW, S (spacing, radii, shadows, typography)
 ├─ Utilities
 │   ├─ usePressScale (chip press micro-interaction)
 │   └─ useEntrance (card entrance animation)
 ├─ Components
 │   ├─ Segmented (top tab switcher: Collections / Outfits / Items)
 │   ├─ Chip (filter & action chips, solid/dashed styles)
 │   ├─ FramedImage (image container with frame + shadow)
 │   ├─ Badge (inline label for category/color/style)
 │   ├─ ItemCard & ItemListRow (grid/list renderers)
 │   ├─ CollectionCard (4-tile layout with bookmark)
 │   ├─ OutfitCard (Top + Bottom + Footwear + optional Outerwear)
 │   └─ BottomTabs (Home, Grid, Saved icons)
 ├─ Sections
 │   ├─ CollectionsSection (scrollable list of CollectionCards)
 │   ├─ OutfitsSection (scrollable list of OutfitCards)
 │   └─ ItemsSection (grid/list view with filters)
 └─ App (main entry point)
```

**State management**
- Local React state (`useState`, `useMemo`) only
- Filters stored in `Set` → chips update items client-side
- `grid` / `list` mode stored in local state
- `activeChip` drives which tag (Work, Leisure, Design) filters Collections/Outfits
- No external/global state management needed

---

## ⚖️ Assumptions & limitations

- **Images**: using remote URLs (Unsplash, Pinimg) → stable enough for demo, but not offline.  
- **Data**: mocked in code:
  - ~10–12 items (with category, color, style)
  - Multiple outfits and collections  
- **Backend**: none — per spec, all state and filtering is client-side only.  
- **Carousel snap**: tuned to ~300px card height; minor adjustments may be needed if designs change.  
- **Accessibility**: tested with roles, labels, hit areas — but not full WCAG audit.  
- **Fake loading delay**: Items section simulates load with an 800ms timeout.

---

## ✨ Animations & interactions implemented

- **Card entrance**: fade + translate on scroll using `useEntrance` hook  
- **Press feedback**: springy scale-down on chips and segmented tabs (`usePressScale`)  
- **Scroll snapping**: `snapToInterval` with tuned deceleration for buttery feel in Collections/Outfits  
- **Framed images**: subtle shadow + grey frame for visual hierarchy  
- **Floating Action Button (✨)**: animated up/down with scroll  

---

## 📌 Deliverables Summary

- **Expo Snack (web):** [Snack Demo](https://snack.expo.dev/@vineeth1007/react-native-assignment-monova)  
- **GitHub Repo:** [wardrobe-assignment](https://github.com/<your-username>/wardrobe-assignment)  
- **README.md** (this file)  

---
