import React, { useState } from 'react';

interface TokenIconProps {
  symbol: string;
  iconUrl?: string;
  size?: number;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ symbol, iconUrl, size = 28 }) => {
  const [hasError, setHasError] = useState(false);

  // Generate deterministic gradient color based on symbol name
  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c1 = `hsl(${Math.abs(hash % 360)}, 70%, 55%)`;
    const c2 = `hsl(${Math.abs((hash + 60) % 360)}, 80%, 45%)`;
    return `linear-gradient(135deg, ${c1}, ${c2})`;
  };

  if (hasError || !iconUrl) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: getGradient(symbol),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: `${Math.max(10, size * 0.38)}px`,
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        {symbol.slice(0, 3)}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      onError={() => setHasError(true)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'contain',
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    />
  );
};
