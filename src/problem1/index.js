/**
 * Problem 1: Three ways to sum to n
 * 
 * Task: Provide 3 unique implementations of sum_to_n(n) in JavaScript.
 * Input: n - any integer.
 * Output: summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.
 */

/**
 * Implementation A: Iterative Approach (Loop)
 * 
 * Computes the summation sequentially term by term.
 * Handles both positive and negative integers:
 * - If n > 0: 1 + 2 + ... + n
 * - If n < 0: (-1) + (-2) + ... + n
 * - If n === 0: 0
 * 
 * Time Complexity: O(|n|) - Linear execution proportional to |n|.
 * Space Complexity: O(1) - Constant auxiliary space.
 * 
 * @param {number} n
 * @returns {number}
 */
var sum_to_n_a = function(n) {
    if (!Number.isInteger(n)) return 0;
    if (n === 0) return 0;

    var sum = 0;
    var step = n > 0 ? 1 : -1;
    for (var i = step; step > 0 ? i <= n : i >= n; i += step) {
        sum += i;
    }
    return sum;
};

/**
 * Implementation B: Mathematical Formula (Gauss Summation)
 * 
 * Utilizes the closed-form arithmetic progression formula:
 * S = |n| * (|n| + 1) / 2
 * Signed accordingly depending on whether n is positive or negative.
 * 
 * Time Complexity: O(1) - Constant time arithmetic operations.
 * Space Complexity: O(1) - Constant auxiliary space.
 * 
 * @param {number} n
 * @returns {number}
 */
var sum_to_n_b = function(n) {
    if (!Number.isInteger(n)) return 0;
    if (n === 0) return 0;

    var absN = Math.abs(n);
    var sum = (absN * (absN + 1)) / 2;
    return n > 0 ? sum : -sum;
};

/**
 * Implementation C: Recursive Approach (Divide and Conquer / Halving)
 * 
 * While naive recursion S(n) = n + S(n-1) risks a CallStack Overflow 
 * for n > 10,000, this divide-and-conquer recursion halves the range at each step:
 * For an interval [start, end]:
 *   mid = floor((start + end) / 2)
 *   sum = sumRange(start, mid) + sumRange(mid + 1, end)
 * 
 * This reduces call stack depth from O(n) to O(log n), making it resilient
 * and demonstrating an advanced recursive pattern.
 * 
 * Time Complexity: O(|n|)
 * Space Complexity: O(log |n|) - Logarithmic maximum call stack depth.
 * 
 * @param {number} n
 * @returns {number}
 */
var sum_to_n_c = function(n) {
    if (!Number.isInteger(n)) return 0;
    if (n === 0) return 0;

    function sumRange(start, end) {
        if (start === end) return start;
        var mid = Math.floor((start + end) / 2);
        return sumRange(start, mid) + sumRange(mid + 1, end);
    }

    var absN = Math.abs(n);
    var sum = sumRange(1, absN);
    return n > 0 ? sum : -sum;
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sum_to_n_a: sum_to_n_a,
        sum_to_n_b: sum_to_n_b,
        sum_to_n_c: sum_to_n_c
    };
}
