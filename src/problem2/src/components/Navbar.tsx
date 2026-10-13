import React from 'react';
import { ArrowLeftRight, Wallet, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon-wrapper">
            <ArrowLeftRight size={20} className="logo-icon" />
          </div>
          <div>
            <span className="logo-title">99Swap</span>
            <span className="logo-badge">DEX v1</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="network-pill">
            <span className="status-dot"></span>
            <span>Ethereum Mainnet</span>
          </div>

          <div className="wallet-pill">
            <Wallet size={16} />
            <span className="wallet-address">0x71c...34a9</span>
            <ShieldCheck size={14} className="verified-badge" />
          </div>
        </div>
      </div>
    </header>
  );
};
