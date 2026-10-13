# Problem 1: Three ways to sum to n

## Task Description
Provide 3 unique implementations of the function `sum_to_n(n)` in JavaScript.

- **Input**: `n` - any integer.
- **Output**: Summation of numbers to `n`, i.e.:
  $$\text{sum\_to\_n}(5) = 1 + 2 + 3 + 4 + 5 = 15$$

---

## Implementations

### 1. Implementation A: Iterative Loop (`sum_to_n_a`)
Accumulates the sum iteratively term by term using a standard loop.

- **Time Complexity**: $\mathcal{O}(|n|)$ — Linear runtime proportional to $|n|$.
- **Auxiliary Space**: $\mathcal{O}(1)$ — Constant memory allocation.
- **Characteristics**: Simple and predictable. Handles negative integers by decrementing toward $n$.

---

### 2. Implementation B: Mathematical Formula (`sum_to_n_b`)
Applies the closed-form Gaussian arithmetic summation formula:
$$\text{Sum} = \frac{|n|(|n| + 1)}{2} \times \text{sign}(n)$$

- **Time Complexity**: $\mathcal{O}(1)$ — Constant time execution with elementary arithmetic.
- **Auxiliary Space**: $\mathcal{O}(1)$ — No extra memory overhead.
- **Characteristics**: Optimal efficiency. Safe for very large integers up to `Number.MAX_SAFE_INTEGER`.

---

### 3. Implementation C: Divide-and-Conquer Recursion (`sum_to_n_c`)
Traditional naive recursion $S(n) = n + S(n - 1)$ risks throwing `RangeError: Maximum call stack size exceeded` for $n \ge 10{,}000$.

To solve this elegantly without stack overflow, this implementation uses a **Divide-and-Conquer halving technique**:
- Recursively splits the range $[1, n]$ in half at each step.
- Reduces the maximum call stack depth from $\mathcal{O}(n)$ down to $\mathcal{O}(\log |n|)$.

- **Time Complexity**: $\mathcal{O}(|n|)$
- **Auxiliary Space**: $\mathcal{O}(\log |n|)$ — Logarithmic stack depth.
- **Characteristics**: Highly resilient recursion that comfortably handles inputs well past 100,000 without stack exhaustion.

---

## Edge Cases Handled
1. **$n = 0$**: Returns `0`.
2. **Negative values**: Signed summation extends symmetrically (e.g. $n = -5 \to -15$).
3. **Non-integer / invalid inputs**: Guarded via `Number.isInteger(n)`.
4. **Boundary limit**: Supports safe summation within `Number.MAX_SAFE_INTEGER`.

---

## Running the Test Suite
Run the test runner using Node.js:

```bash
node src/problem1/test.js
```
