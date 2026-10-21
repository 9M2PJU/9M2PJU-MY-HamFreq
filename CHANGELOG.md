# Changelog

All notable changes to this project will be documented in this file.

## [v2.2.1] - 2026-10-21

### 🐛 Fixes
- Rebuilt stale Tailwind stylesheet (missing `grid-cols-5`, `md:hidden`, offsets broke the mobile nav and hamburger layout); bumped cache-busting to `?v=2.2.1` so clients fetch fresh CSS.

## [v2.2.0] - 2026-10-21

### ✨ New
- Rewrote all 206 CSV comments in plain language (site, RX, shift, CTCSS, network); fixed 13 state markers to simplex calling and PMR power to legal 0.5 W.
- Mobile UX: hamburger drawer, bottom quick-action bar, DMR/PMR446 chips, state + sort filters, expandable comments, safe-area support.
- PWA: maskable-ready manifest with shortcuts, network-first SW with offline fallback and update toast.
- Donations: DuitNow QR + BuyMeCoffee + PayPal + Wise in modal, `#donate` section on every page, README and FUNDING.yml.

## [v2.0.0] - 2026-01-20

### 🚀 Rebranding & UI Overhaul
- **Project Renamed**: Officially renamed to **Malaysian Amateur Radio Frequency Database**.
- **Futuristic Theme**: Implemented a "Cyberpunk" aesthetic with deep space backgrounds and neon accents.
- **Brand Identity**: Updated logo and favicon to a round Malaysia flag.

### ✨ New Features
- **Location Sort**: Added "Near Me" functionality to sort frequencies by distance.
- **Online Counter**: Fixed and improved the "Online Now" user counter.
- **Mobile Optimized**: Enhanced responsiveness for better mobile viewing.

### 🐛 Fixes
- Fixed "Online Now" widget visibility issues.
- Improved Visitor Counter styling to match the new theme.
