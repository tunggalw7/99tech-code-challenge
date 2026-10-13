# Problem 2: Fancy Form (Token Swap Interface)

A production-grade, responsive cryptocurrency token swap interface built with **React**, **TypeScript**, and modern **CSS (Glassmorphism & Micro-animations)**.

---

## Features

### 1. Live Exchange Rates & Pricing
- Fetches real-time token prices from the official Switcheo endpoint (`https://interview.switcheo.com/prices.json`).
- Automatically deduplicates token entries, retaining the most recent timestamp.
- Calculates dynamic exchange rates ($Amount_{to} = Amount_{from} \times \frac{Price_{from}}{Price_{to}}$).
- Manual "Refresh Rates" button with spin animation to update live prices on-demand.
- Displays USD equivalencies under both input and output fields.

### 2. Rich Token Selector Modal
- Fetches SVG token icons directly from Switcheo's official repository (`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens`).
- Graceful fallbacks: If an SVG icon is missing or fails to load, a dynamically styled gradient monogram icon is rendered.
- Real-time search filter by token symbol (e.g. `ETH`, `USDC`) or full name.
- Quick-selection chips for popular assets (ETH, USDC, BUSD, ATOM, OSMO, SWTH).
- Displays user wallet balances and live USD token prices in the list.

### 3. Comprehensive Form Validation & UX
- Real-time numeric format validation (prevents invalid characters and double decimals).
- **Balance checking**: Prevents sending amounts exceeding the user's available token balance, displaying clear inline messages (`Insufficient ETH Balance`).
- Quick percentage shortcuts (`50%`, `MAX`) for one-click amount filling.
- Prevents selecting identical tokens on both sides.
- Flip/reverse button with smooth 180° rotation animation to quickly swap directions.

### 4. Web3 Settings & Transaction Simulation
- **Slippage Tolerance**: Configurable presets (`0.1%`, `0.5%`, `1.0%`) and custom input with range guards.
- **Transaction Deadline**: Configurable deadline in minutes.
- **Detailed Swap Breakdown**: Displays minimum received amount, estimated network fee, and price impact (< 0.05%).
- **Interactive Execution**: Simulates blockchain confirmation with an animated progress loader, followed by a transaction receipt containing mock transaction hash and an Etherscan link.
- Updates wallet balances upon successful swap completion.

---

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Icons**: Lucide React + Switcheo Token SVGs
- **Styling**: Vanilla CSS (Tailored HSL design system, Glassmorphism, CSS variables)

---

## Getting Started

### 1. Install Dependencies
```bash
cd src/problem2
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```
Generates optimized static assets in `dist/`.
