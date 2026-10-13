import React, { useState, useEffect } from 'react';
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
  const presets = [0.1, 0.5, 1.0];

  // Local string states to allow fluid typing, backspacing, and clearing
  const [deadlineStr, setDeadlineStr] = useState(settings.deadlineMinutes.toString());
  const [customSlippageStr, setCustomSlippageStr] = useState(
    presets.includes(settings.slippage) ? '' : settings.slippage.toString()
  );

  useEffect(() => {
    if (isOpen) {
      setDeadlineStr(settings.deadlineMinutes.toString());
      setCustomSlippageStr(presets.includes(settings.slippage) ? '' : settings.slippage.toString());
    }
  }, [isOpen, settings.deadlineMinutes, settings.slippage]);

  if (!isOpen) return null;

  const handlePresetClick = (val: number) => {
    setCustomSlippageStr('');
    onUpdateSettings({ ...settings, slippage: val });
  };

  const handleCustomSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty string for clearing
    setCustomSlippageStr(raw);

    const num = parseFloat(raw);
    if (!isNaN(num) && num > 0 && num <= 50) {
      onUpdateSettings({ ...settings, slippage: num });
    }
  };

  const handleCustomSlippageBlur = () => {
    const num = parseFloat(customSlippageStr);
    if (isNaN(num) || num <= 0 || num > 50) {
      // Revert to default 0.5% preset if invalid or left empty
      setCustomSlippageStr('');
      onUpdateSettings({ ...settings, slippage: 0.5 });
    } else {
      setCustomSlippageStr(num.toString());
    }
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow completely clearing the field without snapping back
    setDeadlineStr(raw);

    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0 && num <= 180) {
      onUpdateSettings({ ...settings, deadlineMinutes: num });
    }
  };

  const handleDeadlineBlur = () => {
    const num = parseInt(deadlineStr, 10);
    if (isNaN(num) || num <= 0) {
      // Fallback to sensible default of 20 minutes if user leaves it blank
      setDeadlineStr('20');
      onUpdateSettings({ ...settings, deadlineMinutes: 20 });
    } else if (num > 180) {
      setDeadlineStr('180');
      onUpdateSettings({ ...settings, deadlineMinutes: 180 });
    } else {
      setDeadlineStr(num.toString());
    }
  };

  const handleSave = () => {
    handleDeadlineBlur();
    handleCustomSlippageBlur();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleSave}>
      <div className="modal-card modal-card-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <SlidersHorizontal size={18} />
            <h3>Transaction Settings</h3>
          </div>
          <button className="icon-btn" onClick={handleSave}>
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
                className={`preset-btn ${settings.slippage === val && !customSlippageStr ? 'active' : ''}`}
                onClick={() => handlePresetClick(val)}
                type="button"
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
                value={customSlippageStr}
                onChange={handleCustomSlippageChange}
                onBlur={handleCustomSlippageBlur}
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
              max="180"
              className="deadline-input"
              value={deadlineStr}
              onChange={handleDeadlineChange}
              onBlur={handleDeadlineBlur}
              placeholder="20"
            />
            <span className="deadline-unit">minutes</span>
          </div>
        </div>

        <button className="primary-action-btn" onClick={handleSave} type="button">
          Save Settings
        </button>
      </div>
    </div>
  );
};
