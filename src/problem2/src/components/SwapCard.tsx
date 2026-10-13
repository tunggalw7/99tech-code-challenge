import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  ArrowDownUp,
  Settings2,
  RefreshCw,
  Info,
  Sparkles,
} from 'lucide-react';
import { Token, SwapSettings } from '../types';
import { TokenIcon } from './TokenIcon';

interface SwapCardProps {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  settings: SwapSettings;
  isRefreshing: boolean;
  isSwapping: boolean;
  onChangeFromAmount: (val: string) => void;
  onFlipTokens: () => void;
  onOpenFromModal: () => void;
  onOpenToModal: () => void;
  onOpenSettings: () => void;
  onRefreshRates: () => void;
  onExecuteSwap: () => void;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  settings,
  isRefreshing,
  isSwapping,
  onChangeFromAmount,
  onFlipTokens,
  onOpenFromModal,
  onOpenToModal,
  onOpenSettings,
  onRefreshRates,
  onExecuteSwap,
}) => {
  const [showRateInfo, setShowRateInfo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const numFromAmount = parseFloat(fromAmount) || 0;
  const numToAmount = parseFloat(toAmount) || 0;

  const fromUsd = numFromAmount * fromToken.price;
  const toUsd = numToAmount * toToken.price;

  // Exchange rate
  const rate = toToken.price > 0 ? fromToken.price / toToken.price : 0;
  const minReceived = numToAmount * (1 - settings.slippage / 100);

  // Validation logic
  let isValid = true;
  let validationMessage = 'CONFIRM SWAP';
  let isPromptState = false;

  if (!fromAmount || numFromAmount <= 0) {
    isValid = false;
    isPromptState = true;
    validationMessage = 'Enter an amount';
  } else if (fromToken.currency === toToken.currency) {
    isValid = false;
    validationMessage = 'Select different tokens';
  } else if (numFromAmount > fromToken.balance) {
    isValid = false;
    validationMessage = `Insufficient ${fromToken.currency} Balance`;
  }

  const handleQuickPercent = (pct: number) => {
    const val = (fromToken.balance * pct).toFixed(6);
    onChangeFromAmount(parseFloat(val).toString());
    inputRef.current?.focus();
  };

  const handleActionClick = () => {
    if (isPromptState) {
      // Focus input when user clicks "Enter an amount"
      inputRef.current?.focus();
      return;
    }
    if (isValid && !isSwapping) {
      onExecuteSwap();
    }
  };

  return (
    <div className="swap-card">
      {/* Top Card Header */}
      <div className="swap-card-header">
        <div className="swap-header-title">
          <h2>Swap</h2>
          <span className="live-pulse-badge">
            <span className="live-dot" /> Live Rate
          </span>
        </div>

        <div className="swap-header-actions">
          <button
            className={`icon-btn ${isRefreshing ? 'spin-anim' : ''}`}
            onClick={onRefreshRates}
            title="Refresh live prices"
            disabled={isRefreshing}
            type="button"
          >
            <RefreshCw size={17} />
          </button>
          <button className="icon-btn" onClick={onOpenSettings} title="Settings" type="button">
            <Settings2 size={17} />
          </button>
        </div>
      </div>

      {/* From Input Box */}
      <div className="token-box">
        <div className="token-box-header">
          <label htmlFor="input-amount" className="box-label">You Pay</label>
          <div className="balance-row">
            <span className="balance-label">Balance:</span>
            <span className="balance-val">
              {fromToken.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {fromToken.currency}
            </span>
            <button
              className="quick-pct-btn"
              onClick={() => handleQuickPercent(0.5)}
              type="button"
            >
              50%
            </button>
            <button
              className="quick-pct-btn max-btn"
              onClick={() => handleQuickPercent(1.0)}
              type="button"
            >
              MAX
            </button>
          </div>
        </div>

        <div className="token-box-body">
          <input
            id="input-amount"
            ref={inputRef}
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            className="amount-input"
            value={fromAmount}
            onChange={(e) => {
              const val = e.target.value;
              // Allow numbers and single decimal point
              if (/^[0-9]*[.]?[0-9]*$/.test(val)) {
                onChangeFromAmount(val);
              }
            }}
          />

          <button
            type="button"
            className="token-selector-btn"
            onClick={onOpenFromModal}
          >
            <TokenIcon symbol={fromToken.currency} iconUrl={fromToken.iconUrl} size={24} />
            <span className="token-selector-symbol">{fromToken.currency}</span>
            <ChevronDown size={16} className="chevron-icon" />
          </button>
        </div>

        <div className="token-box-footer">
          <span className="usd-val">
            ~${fromUsd > 0 ? fromUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </span>
        </div>
      </div>

      {/* Floating Flip Button */}
      <div className="flip-divider">
        <button
          type="button"
          className="flip-btn"
          onClick={onFlipTokens}
          title="Swap currencies"
        >
          <ArrowDownUp size={18} />
        </button>
      </div>

      {/* To Output Box */}
      <div className="token-box">
        <div className="token-box-header">
          <label htmlFor="output-amount" className="box-label">You Receive</label>
          <div className="balance-row">
            <span className="balance-label">Balance:</span>
            <span className="balance-val">
              {toToken.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toToken.currency}
            </span>
          </div>
        </div>

        <div className="token-box-body">
          <input
            id="output-amount"
            type="text"
            readOnly
            placeholder="0.0"
            className="amount-input output-mode"
            value={toAmount}
          />

          <button
            type="button"
            className="token-selector-btn"
            onClick={onOpenToModal}
          >
            <TokenIcon symbol={toToken.currency} iconUrl={toToken.iconUrl} size={24} />
            <span className="token-selector-symbol">{toToken.currency}</span>
            <ChevronDown size={16} className="chevron-icon" />
          </button>
        </div>

        <div className="token-box-footer">
          <span className="usd-val">
            ~${toUsd > 0 ? toUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </span>
        </div>
      </div>

      {/* Rate and Slippage Info Accordion */}
      {numFromAmount > 0 && numToAmount > 0 && (
        <div className="rate-info-box">
          <div
            className="rate-info-header"
            onClick={() => setShowRateInfo(!showRateInfo)}
          >
            <div className="rate-preview">
              <Sparkles size={14} className="sparkle-icon" />
              <span>
                1 {fromToken.currency} ≈ {rate < 0.0001 ? rate.toExponential(4) : rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toToken.currency}
              </span>
            </div>
            <button type="button" className="rate-info-toggle">
              <Info size={14} />
            </button>
          </div>

          {showRateInfo && (
            <div className="rate-details-expanded">
              <div className="rate-detail-item">
                <span>Minimum received</span>
                <span>{minReceived.toFixed(6)} {toToken.currency}</span>
              </div>
              <div className="rate-detail-item">
                <span>Price Impact</span>
                <span className="text-success">&lt; 0.05%</span>
              </div>
              <div className="rate-detail-item">
                <span>Slippage Tolerance</span>
                <span>{settings.slippage}%</span>
              </div>
              <div className="rate-detail-item">
                <span>Estimated Network Fee</span>
                <span>~$0.85 (0.0005 ETH)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Submit Button */}
      <button
        type="button"
        className={`swap-submit-btn ${isValid ? 'ready' : isPromptState ? 'prompt' : 'disabled'} ${isSwapping ? 'loading' : ''}`}
        disabled={(!isValid && !isPromptState) || isSwapping}
        onClick={handleActionClick}
      >
        {isSwapping ? 'Processing Order...' : validationMessage}
      </button>
    </div>
  );
};
