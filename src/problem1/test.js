const assert = require('assert');
const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./index');

const functions = [
    { name: 'Implementation A (Loop)', fn: sum_to_n_a },
    { name: 'Implementation B (Gauss Formula)', fn: sum_to_n_b },
    { name: 'Implementation C (Divide & Conquer Recursion)', fn: sum_to_n_c }
];

const testCases = [
    { input: 0, expected: 0, label: 'n = 0' },
    { input: 1, expected: 1, label: 'n = 1' },
    { input: 5, expected: 15, label: 'n = 5' },
    { input: 10, expected: 55, label: 'n = 10' },
    { input: 100, expected: 5050, label: 'n = 100' },
    { input: 1000, expected: 500500, label: 'n = 1,000' },
    { input: -1, expected: -1, label: 'n = -1 (negative)' },
    { input: -5, expected: -15, label: 'n = -5 (negative)' },
    { input: -10, expected: -55, label: 'n = -10 (negative)' }
];

console.log('🧪 Running Test Suite for Problem 1...\n');

let passedAll = true;
functions.forEach(({ name, fn }) => {
    console.log(`▶ Testing ${name}:`);
    testCases.forEach(({ input, expected, label }) => {
        const result = fn(input);
        try {
            assert.strictEqual(result, expected);
            console.log(`   ✔ ${label} -> ${result}`);
        } catch (err) {
            console.error(`   ❌ ${label} FAILED! Expected ${expected}, got ${result}`);
            passedAll = false;
        }
    });
    console.log('');
});

if (passedAll) {
    console.log('🎉 All test cases passed successfully across all 3 implementations!');
} else {
    process.exit(1);
}
