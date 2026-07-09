# Portfolio Site Structure & Development Guidelines

This document details the visual identity, structure, and instructions for building and editing this portfolio website. 

> [!IMPORTANT]
> **Instructions for AI Coding Assistants:**
> 1. Read this file at the start of any conversation or task.
> 2. Whenever you make structural, stylistic, or feature changes to the site, update this file immediately to document the new state.
> 3. Keep the styling clean and strictly adhere to the digital grid design system. Avoid introducing physical collage elements (notebook bindings, paper clips, stamp scalloping, washi tape) or handwritten script fonts like `Caveat`.

---

## 1. Visual Identity & Design System

The site adheres to a sleek, modern, digital grid aesthetic:
- **Core Background**: Light cream-tan (`--bg-tan` / `#cdc8c5`).
- **Typography**: Clean display and sans-serif fonts using the variable font `Aspekta` (`--sans` / AspektaVF). Monospaced fonts for status/meta lines (`--mono`).
- **Card Panels**: Translucent white panels (`background: rgba(255, 255, 255, 0.45)`) with fine dark borders (`border: 1px solid rgba(8, 6, 13, 0.15)`) and a `28px` corner radius.
- **Background Details**: Dark, ultra-subtle coordinate grid lines (`rgba(8, 6, 13, 0.03)`) at 36px intervals.
- **Accents**: Muted dark tones (`#08060d`), with high-contrast highlight elements in coral-red (`#e05a5a`).

---

## 2. Page Layout & Sections

The single-page application is structured inside a centered blueprint page-wrapper (matching the News page style of WallWidgy) within [App.tsx](file:///d:/portfolio-new/src/App.tsx) and styled via [App.css](file:///d:/portfolio-new/src/App.css):

### 1. Page Wrapper & Technical Header
- **Page Wrapper**: A centered `1100px` container with vertical borders (`border-left`/`border-right`) on desktop that frames all sections.
- **Technical Header**: A 12-column grid-based header divided into:
  - Column 1 (span 3): Branding logo (`AYAN.DEV`).
  - Column 2 (span 6): Technical title (`PORTFOLIO MK. II // 2026`).
  - Column 3 (span 3): Active status indicator (`AVAILABLE FOR WORK`) with a pulsing coral dot.
- **Section Dividers**: Every main section is set to span the full width of the wrapper, separated by a thin horizontal border line (`border-bottom`).

### 2. Preloader Screen
- Cycles through multiple language greeting words (`Hello`, `Bonjour`, `Ciao`, etc.) with keyframe word fade-ins and a pulsing progress dot.

### 2. Hero Section
- A borderless layout with the visual banner on top, and details underneath with natural visual spacing.
- **Top Block (Visual Card)**: A wide banner image card displaying `/hero.gif` with the original `realm` interactive Lens zoom effect, and an overlapping circular avatar (`/profpic-animated.webp` with fallback) shunted to the left.
- **Middle Block (Details Row)**: Spacious left-aligned details containing a monospaced section tag (`// PORTFOLIO START`), large title ("I am Ayan"), tagline, and horizontal social buttons on the right.
- **Bottom Block (Footer)**: A monospaced footer tag (`not_ayan. / 23 y.o. student`) separated by a bottom divider hairline.

### 3. About Info Grid
- A 12-column layout displaying cards for:
  - **Box 1 (span 5)**: Location details, badges representing roles, and a cursive ampersand highlight.
  - **Box 2 (span 4)**: Educational timeline utilizing custom timeline items, badges, and vertical connecting lines.
  - **Box 3 (span 3)**: Pure decorative radial mesh gradient circle card.
  - **Box 4 (span 9)**: Project automation logs and AOSP customROM channel/chat link badges.
  - **Box 5 (span 3)**: Music widget showing current active last.fm listening status ("babydoll" by boywithuke) with a spinning vinyl record animation.

### 4. Works / Projects Section ("stuff i have worked on")
- **Active Projects Panel**: Interactive layout with paginated preview blocks:
  - **Left Panel**: Pagination controls, logo badge, and descriptions of featured projects (*Wallwidgy*, *Axion OS*, *Design Hub*).
  - **Right Panel**: A 3D stacked mock-up preview using cards that rotate/animate when hovering.
- **Creative Redirect Banner**: A minimal, compact banner designed for high-conversion:
  - **Left Info**: Clean copy ("Looking for my design & photography?") alongside a monospaced tag (`// CREATIVE WORK`) and description.
  - **Right Actions**: Clean CTA buttons redirecting visitors to `Photography ↗` (transparent layout button) and `Graphic Design ↗` (solid dark layout button).
  - Built with responsive column styling that collapses vertically on mobile/tablet screens.

### 5. Skills Section
- Two-column detail checklist:
  - **Left**: Core design philosophy statement.
  - **Right**: Categorized skills lists (Frontend/Dev, Design/Creative, Systems/Core) using bullet indicators.

### 7. GitHub Contribution Graph
- Mimics a standard Git contribution grid calendar layout using organic, pre-computed level values (0–4) and custom square colors.

### 8. Contact Section (Redesigned)
- Uses the same 12-column grid layout as the rest of the site:
  - **Collaboration Card (span 7)**: Description text and pills for Freelance, Contracts, and Full-time roles.
  - **Status Card (span 5)**: Location meta-info and a green indicator dot pulsing via an outer keyframe ring.
  - **Email Card (span 5)**: Large direct link (`ayan98542@gmail.com`) and a rounded send button with hover transitions.
  - **Socials Card (span 7)**: Links to Twitter/X, Instagram, and GitHub styled as custom block rows that slide horizontally on hover.
- **Note**: The old header tag `✦ 04 / CONTACT` has been removed.

### 9. Editorial Footer
- A clean, dark-themed footer (`#0c0a0f`) with footer columns, copyright notices, custom navigation back-to-top transition, and a dynamic local time clock.

---

## 3. Maintenance Procedures

When editing code, follow these validation steps:
1. **Compilation Check**: Run `npm run build` in the project root to check for any TypeScript, lint, or Vite configuration issues.
2. **Visual Continuity**: Verify that section backgrounds remain transparent unless targeting footer elements. Ensure text is highly legible on the `--bg-tan` background.
3. **Interactive Polish**: Check that custom hover states (like the horizontal translation of social cells or scaling buttons) transition cleanly.
