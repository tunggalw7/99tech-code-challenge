# Problem 3: Messy React (Code Audit & Refactoring)

This document provides a comprehensive code audit of the original `WalletPage` component, detailing all identified bugs, anti-patterns, and performance inefficiencies, followed by the complete, production-ready refactored solution.

---

## 1. Identified Issues & Code Audit

### Critical Bugs & Runtime Errors
1. **`ReferenceError: lhsPriority is not defined`**
   - **Location**: Inside the `.filter()` callback.
   - **Issue**: The code computes `const balancePriority = getPriority(balance.blockchain)`, but then evaluates `if (lhsPriority > -99)`.
   - **Impact**: Throws an immediate uncaught `ReferenceError` at runtime, crashing the component before any items can be processed.

2. **Inverted Filter Condition**
   - **Location**: `if (balance.amount <= 0) return true;`
   - **Issue**: The filter logic returns `true` for balances with amount $\le 0$ (negative or zero balances) and discards positive balances.
   - **Impact**: In a cryptocurrency wallet, users expect to see active holdings (`amount > 0`). This logic does the exact opposite.

3. **Missing Property in Type Definition**
   - **Location**: `interface WalletBalance`
   - **Issue**: `WalletBalance` only declares `currency` and `amount`, yet `balance.blockchain` is accessed throughout the component.
   - **Impact**: Type checking fails under strict TypeScript unless bypassed with `any`.

4. **Broken Data Flow in `formattedBalances`**
   - **Location**: `const formattedBalances = sortedBalances.map(...)` and `rows = sortedBalances.map(...)`
   - **Issue**: The code computes `formattedBalances`, but then maps over `sortedBalances` to create `rows`, casting each item to `FormattedWalletBalance`.
   - **Impact**: The formatted calculation is completely wasted, and `balance.formatted` passed to `<WalletRow />` evaluates to `undefined` at runtime.

---

### Performance & Architecture Inefficiencies
5. **Inefficient `useMemo` Dependency Array**
   - **Location**: `useMemo(() => { ... }, [balances, prices])`
   - **Issue**: `prices` is declared in the dependency array, but is **never used** inside the filtering and sorting callback.
   - **Impact**: Every time live crypto prices tick or update, the component re-filters and re-sorts the entire list unnecessarily.

6. **Repeated Function Recreation (`getPriority`)**
   - **Location**: `const getPriority = (blockchain: any): number => { ... }`
   - **Issue**: Declared inside the component body without depending on props or state.
   - **Impact**: Recreated on every render. Furthermore, during `.sort()`, `getPriority` is executed repeatedly for each pair comparison ($\mathcal{O}(n \log n)$ lookups).
   - **Solution**: Move to module scope or replace with a constant dictionary lookup (`BLOCKCHAIN_PRIORITY: Record<string, number>`).

7. **Incomplete Sort Comparator**
   - **Location**: Inside `.sort((lhs, rhs) => { ... })`
   - **Issue**: The comparator handles `leftPriority > rightPriority` and `rightPriority > leftPriority`, but returns `undefined` when priorities are equal (e.g. Zilliqa and Neo, both priority 20).
   - **Impact**: Violates the `Array.prototype.sort` contract, which requires returning `0` for ties, leading to unpredictable sorting behavior across different JS engines.

---

### React Best Practices & Code Quality
8. **Anti-pattern: Using Array `index` as `key`**
   - **Location**: `<WalletRow key={index} ... />`
   - **Issue**: Using array index on a sorted/filtered list breaks React's DOM reconciliation when items are reordered or filtered.
   - **Solution**: Use a stable composite key such as `${balance.blockchain}-${balance.currency}` or unique position ID.

9. **Loss of Precision with `toFixed()` without Argument**
   - **Location**: `balance.amount.toFixed()`
   - **Issue**: `toFixed()` with no argument defaults to zero decimal places (`toFixed(0)`), truncating fractions (e.g. `0.054 ETH` becomes `"0"`).
   - **Solution**: Supply explicit precision or format with `Intl.NumberFormat`.

10. **Silently Swallowed `children` Prop**
    - **Location**: `const { children, ...rest } = props;`
    - **Issue**: `children` is destructured from props but never rendered within `<div {...rest}>{rows}</div>`.
    - **Solution**: Render `{children}` inside the wrapper element.

11. **Unsafe Price Multiplication (`NaN` Risk)**
    - **Location**: `const usdValue = prices[balance.currency] * balance.amount;`
    - **Issue**: If `prices[balance.currency]` is missing or undefined, the multiplication results in `NaN`.
    - **Solution**: Guard with a fallback `(prices[balance.currency] ?? 0) * balance.amount`.

12. **Redundant Typing and Empty Interface**
    - `interface Props extends BoxProps {}` is an empty interface.
    - `const WalletPage: React.FC<Props> = (props: Props) =>` has redundant duplicate prop typing.

---

## 2. Refactored Solution Structure

- `WalletPage.tsx`: The clean, production-ready React component with strict typing, optimized memoization, and semantic markup.
- `types.ts`: Strongly typed interfaces.
