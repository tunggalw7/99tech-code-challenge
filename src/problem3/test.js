const assert = require('assert');

const BLOCKCHAIN_PRIORITIES = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

function getPriority(blockchain) {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
}

function processBalances(balances, prices) {
  const sorted = balances
    .filter((b) => {
      const priority = getPriority(b.blockchain);
      return priority > -99 && b.amount > 0;
    })
    .sort((lhs, rhs) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });

  return sorted.map((b) => ({
    ...b,
    formatted: b.amount.toFixed(2),
    usdValue: (prices[b.currency] ?? 0) * b.amount,
  }));
}

console.log('🧪 Running Test Suite for Problem 3 Logic...\n');

const mockBalances = [
  { currency: 'ETH', amount: 2.5, blockchain: 'Ethereum' },
  { currency: 'OSMO', amount: 100, blockchain: 'Osmosis' },
  { currency: 'ZERO', amount: 0, blockchain: 'Arbitrum' }, // Should be filtered out (amount 0)
  { currency: 'NEG', amount: -5, blockchain: 'Ethereum' }, // Should be filtered out (negative)
  { currency: 'UNKNOWN', amount: 10, blockchain: 'SomeUnknownChain' }, // Should be filtered out (unknown chain)
  { currency: 'ZIL', amount: 50, blockchain: 'Zilliqa' },
  { currency: 'ARB', amount: 25, blockchain: 'Arbitrum' },
];

const mockPrices = {
  ETH: 2000,
  OSMO: 0.5,
  ZIL: 0.02,
  ARB: 1.2,
};

const result = processBalances(mockBalances, mockPrices);

console.log('▶ Filtered and Sorted Result:');
result.forEach((r, idx) => {
  console.log(`   ${idx + 1}. [${r.blockchain}] ${r.currency}: ${r.amount} ($${r.usdValue})`);
});

// Assertions
assert.strictEqual(result.length, 4, 'Should keep only 4 valid positive balances');
assert.strictEqual(result[0].blockchain, 'Osmosis', 'Osmosis should be first (priority 100)');
assert.strictEqual(result[1].blockchain, 'Ethereum', 'Ethereum should be second (priority 50)');
assert.strictEqual(result[2].blockchain, 'Arbitrum', 'Arbitrum should be third (priority 30)');
assert.strictEqual(result[3].blockchain, 'Zilliqa', 'Zilliqa should be fourth (priority 20)');
assert.strictEqual(result[1].usdValue, 5000, '2.5 ETH * $2000 = $5000 USD');

console.log('\n🎉 All Problem 3 assertions passed successfully!');
