import React, { useMemo } from 'react';
import { WalletBalance, FormattedWalletBalance, Prices, Blockchain, BoxProps } from './types';

// Mock external hook signatures (assumed to come from application layer)
export declare function useWalletBalances(): WalletBalance[];
export declare function usePrices(): Prices;

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
  blockchain: string;
}

// Fallback WalletRow implementation if not provided externally
export const WalletRow: React.FC<WalletRowProps> = ({
  className,
  formattedAmount,
  usdValue,
  currency,
  blockchain,
}) => {
  return (
    <div className={className || 'wallet-row'}>
      <div className="token-meta">
        <span className="currency-symbol">{currency}</span>
        <span className="blockchain-name">({blockchain})</span>
      </div>
      <div className="token-amounts">
        <span className="amount-formatted">{formattedAmount}</span>
        <span className="usd-valuation">
          ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

// 1. Static Priority Mapping (Moved to module scope to avoid reallocating on every render)
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

function getPriority(blockchain: Blockchain): number {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
}

// Formatter helper for consistent display precision
const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

export interface WalletPageProps extends BoxProps {
  // Allow passing balances & prices as props for testability, falling back to hooks
  balances?: WalletBalance[];
  prices?: Prices;
  classes?: {
    row?: string;
    container?: string;
  };
}

export const WalletPage: React.FC<WalletPageProps> = ({
  balances: propBalances,
  prices: propPrices,
  classes = {},
  children,
  ...rest
}) => {
  // Gracefully support either props (for testing/modularity) or external hooks
  const hookBalances = typeof useWalletBalances === 'function' ? useWalletBalances() : [];
  const hookPrices = typeof usePrices === 'function' ? usePrices() : {};

  const balances = propBalances ?? hookBalances;
  const prices = propPrices ?? hookPrices;

  /**
   * 2. Filter & Sort Memoization:
   * Only recomputes when `balances` change. `prices` is intentionally excluded
   * to avoid expensive resorting during price-only fluctuations.
   *
   * Fixes applied:
   * - Resolved ReferenceError on `lhsPriority` by referencing `balancePriority`.
   * - Fixed inverted logic: filters FOR active holdings (`amount > 0`).
   * - Simplified comparator: `rightPriority - leftPriority` safely handles ties (returns 0).
   */
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]);

  /**
   * 3. Formatted Balances with Safe Valuations:
   * Recombines display formatting and USD conversion cleanly without orphaned maps.
   */
  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((balance) => {
      const price = prices[balance.currency] ?? 0;
      return {
        ...balance,
        formatted: amountFormatter.format(balance.amount),
        usdValue: price * balance.amount,
      };
    });
  }, [sortedBalances, prices]);

  return (
    <div {...rest} className={classes.container || 'wallet-page-container'}>
      {formattedBalances.map((balance) => {
        // 4. Stable composite key instead of array index
        const rowKey = `${balance.blockchain}-${balance.currency}`;

        return (
          <WalletRow
            key={rowKey}
            className={classes.row}
            currency={balance.currency}
            blockchain={balance.blockchain}
            amount={balance.amount}
            usdValue={balance.usdValue}
            formattedAmount={balance.formatted}
          />
        );
      })}

      {/* 5. Render children appropriately */}
      {children}
    </div>
  );
};

export default WalletPage;
