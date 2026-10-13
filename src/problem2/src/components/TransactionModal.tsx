import React from 'react';
import { Loader2, CheckCircle2, ExternalLink, ArrowRight, X } from 'lucide-react';
import { TokenIcon } from './TokenIcon';
import { SwapTransaction } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  isLoading: boolean;
  tx: SwapTransaction | null;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  isLoading,
  tx,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={isLoading ? undefined : onClose}>
      <div className="modal-card modal-card-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isLoading ? 'Processing Swap' : 'Swap Completed'}</h3>
          {!isLoading && (
            <button className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>

        {isLoading && (
          <div className="tx-loading-state">
            <div className="spinner-glow-wrapper">
              <Loader2 className="animate-spin tx-spinner" size={56} />
            </div>
            <h4 className="tx-status-title">Confirming Transaction</h4>
            <p className="tx-status-desc">
              Routing swap through optimal liquidity pools and confirming on Ethereum Mainnet...
            </p>
            <div className="tx-progress-bar">
              <div className="tx-progress-fill animate-progress" />
            </div>
          </div>
        )}

        {!isLoading && tx && (
          <div className="tx-success-state">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={54} className="success-icon" />
            </div>
            <h4 className="tx-status-title">Transaction Submitted!</h4>

            <div className="tx-summary-card">
              <div className="tx-summary-token">
                <TokenIcon symbol={tx.fromToken.currency} iconUrl={tx.fromToken.iconUrl} size={28} />
                <span className="tx-amount-text">
                  -{tx.fromAmount} {tx.fromToken.currency}
                </span>
              </div>
              <ArrowRight size={18} className="tx-arrow" />
              <div className="tx-summary-token">
                <TokenIcon symbol={tx.toToken.currency} iconUrl={tx.toToken.iconUrl} size={28} />
                <span className="tx-amount-text text-success">
                  +{tx.toAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {tx.toToken.currency}
                </span>
              </div>
            </div>

            <div className="tx-details-list">
              <div className="tx-detail-row">
                <span>Transaction Hash</span>
                <span className="tx-hash-pill" title={tx.txHash}>
                  {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                </span>
              </div>
              <div className="tx-detail-row">
                <span>Execution Rate</span>
                <span>
                  1 {tx.fromToken.currency} ≈ {tx.rate.toFixed(4)} {tx.toToken.currency}
                </span>
              </div>
            </div>

            <div className="tx-actions-col">
              <a
                href={`https://etherscan.io/tx/${tx.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="explorer-link-btn"
              >
                <span>View on Etherscan</span>
                <ExternalLink size={15} />
              </a>
              <button className="primary-action-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
