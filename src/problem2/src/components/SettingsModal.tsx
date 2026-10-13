import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { SwapSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SwapSettings;
  onUpdateSettings: (settings: SwapSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const presets = [0.1, 0.5, 1.0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <SlidersHorizontal size={18} />
            <h3>Transaction Settings</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-section">
          <label className="settings-label">
            <span>Slippage Tolerance</span>
            <span className="info-tooltip" title="Your transaction will revert if the price changes unfavorably by more than this percentage.">?</span>
          </label>
          <div className="slippage-presets">
            {presets.map((val) => (
              <button
                key={val}
                className={`preset-btn ${settings.slippage === val ? 'active' : ''}`}
                onClick={() => onUpdateSettings({ ...settings, slippage: val })}
              >
                {val}%
              </button>
            ))}
            <div className="custom-slippage-input-wrapper">
              <input
                type="number"
                step="0.1"
                min="0.05"
                max="50"
                className="custom-slippage-input"
                placeholder="Custom"
                value={presets.includes(settings.slippage) ? '' : settings.slippage}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0 && val <= 50) {
                    onUpdateSettings({ ...settings, slippage: val });
                  }
                }}
              />
              <span className="percent-sign">%</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <label className="settings-label">
            <span>Transaction Deadline</span>
            <span className="info-tooltip" title="Transaction will revert if it remains pending for longer than this time.">?</span>
          </label>
          <div className="deadline-input-row">
            <input
              type="number"
              min="1"
              max="120"
              className="deadline-input"
              value={settings.deadlineMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val > 0) {
                  onUpdateSettings({ ...settings, deadlineMinutes: val });
                }
              }}
            />
            <span className="deadline-unit">minutes</span>
          </div>
        </div>

        <button className="primary-action-btn" onClick={onClose}>
          Save Settings
        </button>
      </div>
    </div>
  );
};
