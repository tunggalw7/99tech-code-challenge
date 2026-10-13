import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Token } from '../types';
import { TokenIcon } from './TokenIcon';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  selectedToken: Token;
  otherToken: Token;
  onSelectToken: (token: Token) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  tokens,
  selectedToken,
  otherToken,
  onSelectToken,
}) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTokens = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter(
      (t) =>
        t.currency.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    );
  }, [tokens, search]);

  const popularSymbols = ['ETH', 'USDC', 'BUSD', 'ATOM', 'OSMO', 'SWTH'];
  const popularTokens = useMemo(() => {
    return tokens.filter((t) => popularSymbols.includes(t.currency));
  }, [tokens]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select a Token</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search name or paste symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Popular tokens chips */}
        <div className="popular-tokens-container">
          {popularTokens.map((t) => (
            <button
              key={t.currency}
              className={`popular-token-chip ${selectedToken.currency === t.currency ? 'active' : ''}`}
              onClick={() => {
                onSelectToken(t);
                onClose();
              }}
            >
              <TokenIcon symbol={t.currency} iconUrl={t.iconUrl} size={18} />
              <span>{t.currency}</span>
            </button>
          ))}
        </div>

        <div className="token-list-divider" />

        <div className="token-list">
          {filteredTokens.length === 0 ? (
            <div className="token-list-empty">
              <p>No tokens found matching "{search}"</p>
            </div>
          ) : (
            filteredTokens.map((t) => {
              const isSelected = selectedToken.currency === t.currency;
              const isOther = otherToken.currency === t.currency;

              return (
                <button
                  key={t.currency}
                  className={`token-row-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectToken(t);
                    onClose();
                  }}
                >
                  <div className="token-row-left">
                    <TokenIcon symbol={t.currency} iconUrl={t.iconUrl} size={36} />
                    <div className="token-info">
                      <div className="token-symbol-row">
                        <span className="token-symbol">{t.currency}</span>
                        {isOther && <span className="in-use-tag">In swap</span>}
                      </div>
                      <span className="token-full-name">{t.name}</span>
                    </div>
                  </div>

                  <div className="token-row-right">
                    <div className="token-price-col">
                      <span className="token-balance">{t.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      <span className="token-usd-price">
                        ${t.price < 0.01 ? t.price.toFixed(6) : t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </span>
                    </div>
                    {isSelected && <Check size={18} className="check-icon" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
