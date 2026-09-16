# 🌍 Global Markets Clock

A lightweight, frontend-only application for visualizing global financial market hours relative to **Tehran time**.  
This project helps users instantly understand which major markets are open, closed, or overlapping at any given moment.

---

## ✨ Overview

**Global Markets Clock** is a simple but precise market-time visualization tool.  
It reads market session data from a local data file and calculates market states entirely on the client side.

The core goal of this project is to give traders and analysts a **clear, visual understanding of global market activity based on Iran (Tehran) time**, without relying on any backend services.

---

## 🧠 What This App Does

- Shows the **real-time status** of major global financial markets relative to Tehran time
- Calculates **market overlaps** (high-liquidity periods)
- Allows users to explore market states across a **24-hour timeline**
- Visualizes market sessions using both **analog** and **card-based UI**

---

## 🏠 Home Page Features

### 🕰 Analog Market Clock

- A real-time analog clock visualizing global market sessions
- Colored arcs represent active trading sessions
- Updates automatically based on current Tehran time
- Below the clock, status boxes show which markets are currently open

---

### 📊 Live Market Status Boxes

- Visual cards displaying:
  - Market name
  - Open / Closed state
  - Current status based on Tehran time
- Updates in real time

---

### 📈 24-Hour Market Timeline

- A horizontal 24-hour timeline representing a full day in **Tehran time**
- Users can select **any hour** on the timeline
- Instantly see:
  - Which markets are open at that specific hour
  - Which markets are closed
- Works independently from the current real time (exploratory mode)

---

### 🔄 Market Overlap Calculation

- Automatically detects overlapping market sessions
- Helps identify high-liquidity trading windows
- Updates dynamically as time changes or timeline hour is selected

---

## 🧩 Data Handling

- Market sessions are defined in a **static data file**
- No API calls
- No backend
- All calculations are done on the client using JavaScript/TypeScript
- Time normalization is based on **Tehran (IRST) timezone**

---

## 🛠 Technical Highlights

- **Frontend-only architecture**
- **Next.js 16 (App Router)**
- **Tailwind CSS v4** (CSS-first configuration)
- **Zustand** for global time and UI state
- **Lucide React** for clean, consistent icons
- **Progressive Web App (PWA)** with offline support and installation capability
- **Real-time market notifications** with 15-minute lead time
- **Holiday-aware market calculations** for all major exchanges
- **Enhanced timezone intelligence** with DST-aware UTC offset calculations
- Fully responsive layout (desktop, tablet, mobile)
- **100% TypeScript strict compliance**
- **Comprehensive testing** with 100% coverage

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Icons**: Lucide React

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- Lucide Icons

### Tooling

- ESLint
- Vitest (Comprehensive testing)
- PostCSS
- Node.js

## 🌟 Key Features

### Enhanced Market Intelligence
- **Holiday-aware calculations**: Markets correctly close on Christmas, Thanksgiving, Eid, Chinese New Year, and all major exchange holidays
- **Cross-market timezone intelligence**: Precise DST-aware UTC offset calculations (supports fractional offsets like Tehran UTC+3:30)
- **Browser timezone detection**: Human-readable city names from browser settings

### Real-Time Notification System
- **15-minute lead time alerts**: Automatic notifications for market openings and closings
- **Smart deduplication**: Prevents duplicate notifications using LocalStorage
- **Cross-market independence**: No false alerts between different market calendars

### Advanced User Experience
- **PWA capabilities**: Install to homescreen, offline support, background sync
- **Full accessibility**: WCAG 2.1 AA compliant with RTL/LTR support
- **Multi-language support**: Persian and English interfaces with proper text direction
- **Interactive components**: Smooth animations, responsive design

### Production-Grade Architecture
- **100% TypeScript strict mode**: Zero runtime type errors
- **100% test coverage**: Comprehensive unit and integration tests
- **Optimized performance**: Turbopack builds, bundle size reduction
- **Enterprise security**: Enhanced headers, XSS prevention

---

## 🚀 Getting Started

## bash

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start

### 🐳 Docker

# Build the image
docker build -t market-clock .

# Run the container
docker run -p 3000:3000 market-clock

# Open browser
http://localhost:3000
