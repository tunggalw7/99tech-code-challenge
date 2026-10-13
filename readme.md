# 99Tech Code Challenge #1 (Frontend Track)

**Candidate:** Tunggal Wigati  
**Role Applied:** Frontend Developer (ReactJS / TypeScript)  
**Repository:** [github.com/tunggalw7/99tech-code-challenge](https://github.com/tunggalw7/99tech-code-challenge)  
**Live Demo (Problem 2):** [https://problem2-amber.vercel.app/](https://problem2-amber.vercel.app/)

---

## Overview

This repository contains complete, production-grade solutions for the **Frontend Track** of the 99Tech Code Challenge, covering **Problem 1**, **Problem 2**, and **Problem 3**.

| Challenge | Topic | Tech Stack | Status | Live Demo |
| :--- | :--- | :--- | :--- | :--- |
| [**Problem 1**](./src/problem1/README.md) | Three ways to sum to n | JavaScript (ES6+), Node.js | Completed & Tested | — |
| [**Problem 2**](./src/problem2/README.md) | Fancy Form (Token Swap) | React 18, TypeScript, Vite, CSS | Completed & Tested | [🚀 Open App](https://problem2-amber.vercel.app/) |
| [**Problem 3**](./src/problem3/README.md) | Messy React (Audit & Refactor) | React, TypeScript, Architecture | Completed & Tested | — |

---

## 1. Problem 1: Three ways to sum to n

Provides three distinct implementations of the summation function $\text{sum\_to\_n}(n)$:

1. **Implementation A (`sum_to_n_a`)**: Iterative loop ($\mathcal{O}(n)$ time, $\mathcal{O}(1)$ space).
2. **Implementation B (`sum_to_n_b`)**: Mathematical Gaussian formula ($\mathcal{O}(1)$ time, $\mathcal{O}(1)$ space).
3. **Implementation C (`sum_to_n_c`)**: Divide-and-Conquer halving recursion ($\mathcal{O}(n)$ time, $\mathcal{O}(\log n)$ stack space to prevent call stack overflow on large inputs).

### Running Tests:
```bash
node src/problem1/test.js
```

---

## 2. Problem 2: Fancy Form (Token Swap Interface)

A sleek, responsive crypto token swap application featuring:
- **Live Demo**: [https://problem2-amber.vercel.app/](https://problem2-amber.vercel.app/)
- **Live Prices & Icons**: Real-time price ingestion from Switcheo's live feed with deduplication, paired with official SVG token icons.
- **Interactive UX**: Token selector modal with search & popular token chips, quick percentage buttons (50%, MAX), and smooth reverse/flip animation.
- **Robust Validation**: Real-time balance checking, input formatting, and error messaging (`Insufficient ETH Balance`).
- **Web3 Transaction Flow**: Slippage and deadline settings, minimum received calculations, and simulated blockchain confirmation with receipt modal.

### Running Locally:
```bash
cd src/problem2
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 3. Problem 3: Messy React

A comprehensive code audit and refactoring of the `WalletPage` component:
- **Detailed Audit**: Documented 12 distinct issues including runtime crashes (`ReferenceError: lhsPriority`), inverted filter conditions, missing types on `WalletBalance`, wasted `useMemo` dependencies on `prices`, and broken `formattedBalances` data flow.
- **Clean Architecture**: Rebuilt as a strongly-typed, performant React TypeScript component with module-scoped lookup tables and stable composite keys.

### Running Verification Tests:
```bash
node src/problem3/test.js
```
