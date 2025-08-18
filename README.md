# CSE3CWA — Assignment 1 (Frontend App)

**Student:** Travis Hoult  
**Student ID:** 20221016  

---

## 📌 Overview

This is a front-end application built with **Next.js 14 (App Router)** using **TypeScript**.  
It fulfills the requirements of Assignment 1 for the CSE3CWA subject at La Trobe University.

The app features:
- A responsive user interface
- Tab creation and management
- Theme toggling (dark/light mode)
- HTML output generation using only inline styles

---

## 🚀 How to Run the App

### Requirements:
- Node.js 18+
- npm or yarn

### Setup:

```bash
git clone https://github.com/travis-hoult/cse3cwa-a1.git
cd cse3cwa-a1
npm install
npm run dev
```

The app will run on:  
📍 `http://localhost:3000`

---

## 🧩 Features Implemented

### 1. 🎨 Theme Support
- Light mode and dark mode
- Toggle component to switch between themes
- CSS variables used to manage theme states

### 2. 🧽 Navigation UI
- Header and footer
- Top navigation tabs:
  - Tabs
  - Pre-lab Questions
  - Escape Room
  - Coding Races
  - About
- Hamburger menu for mobile view (with CSS transform)

### 3. 🧱 Tab Builder
- Add/remove up to 15 tabs
- Edit tab titles and content
- Store tabs in `localStorage`
- Each tab shows its own content panel
- Output generator produces:
  - Clean HTML with only inline styles
  - Tabs that function in a standalone `.html` file

### 4. 🖥 GitHub Version Control
- ✅ `main` branch + 3 feature branches:
  - `feature/theme-toggle`
  - `feature/tabs-builder`
  - `feature/navigation-bar`
- ✅ Several commits per feature
- ✅ `.gitignore` excludes `node_modules`
- ✅ This `README.md` documents the project

---

## 🛠 Technologies Used

- [Next.js 14 (App Router)](https://nextjs.org/)
- TypeScript
- CSS-in-JS (inline styles)
- React (Hooks API)
- Browser localStorage

---

## 📁 Folder Structure

```
/app          → App Router pages (e.g., /, /about, /races)
/components   → Header, Footer, Menu, ThemeToggle
/lib          → Utility functions (e.g., localStorage logic)
/public       → Static assets (e.g., favicon)
/styles       → Global CSS
```

---

## 📦 How to Build Output

To generate HTML from tabs:

1. Visit the **Tabs** page.
2. Create and fill out your tabs.
3. Click **Generate Output**.
4. Copy and paste the HTML into a `.html` file to run it standalone.

---

## 📚 Notes

- No external CSS frameworks or class-based styles used.
- Output is compliant with the requirement: **"inline styles only"**.
- All UI is responsive and accessible.

---

