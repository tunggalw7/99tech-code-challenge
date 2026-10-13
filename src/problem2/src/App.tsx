import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SwapCard } from './components/SwapCard';
import { TokenModal } from './components/TokenModal';
import { SettingsModal } from './components/SettingsModal';
import { TransactionModal } from './components/TransactionModal';
import { Token, SwapSettings, SwapTransaction } from './types';
import { fetchTokenPrices } from './services/priceService';
import { Loader2 } from 'lucide-react';
import './styles/index.css';

export const App: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const [settings, setSettings] = useState<SwapSettings>({
    slippage: 0.5,
    deadlineMinutes: 20,
  });

  // Modals state
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Transaction state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [currentTx, setCurrentTx] = useState<SwapTransaction | null>(null);

  // Initialize and load tokens
  const loadTokens = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoadingTokens(true);

    try {
      const data = await fetchTokenPrices();
      setTokens(data);

      // Default tokens setup
      if (!fromToken || !toToken) {
        const eth = data.find((t) => t.currency === 'ETH') || data[0];
        const usdc = data.find((t) => t.currency === 'USDC') || data[1] || data[0];
        setFromToken(eth);
        setToToken(usdc);
      } else {
        // Sync latest price in current selection
        const updatedFrom = data.find((t) => t.currency === fromToken.currency);
        const updatedTo = data.find((t) => t.currency === toToken.currency);
        if (updatedFrom) setFromToken((prev) => (prev ? { ...prev, price: updatedFrom.price } : updatedFrom));
        if (updatedTo) setToToken((prev) => (prev ? { ...prev, price: updatedTo.price } : updatedTo));
      }
    } catch (err) {
      console.error('Failed to load token list:', err);
    } finally {
      setIsLoadingTokens(false);
      setIsRefreshing(false);
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    loadTokens();
  }, []);

  // Recalculate output amount whenever fromAmount, fromToken or toToken changes
  const calculateOutput = useCallback(
    (inputVal: string, sourceToken: Token | null, destToken: Token | null) => {
      const num = parseFloat(inputVal);
      if (isNaN(num) || num <= 0 || !sourceToken || !destToken || destToken.price <= 0) {
        setToAmount('');
        return;
      }
      const rawOutput = (num * sourceToken.price) / destToken.price;
      // Format sensibly based on magnitude
      if (rawOutput < 0.0001) {
        setToAmount(rawOutput.toExponential(4));
      } else if (rawOutput > 1000) {
        setToAmount(rawOutput.toFixed(2));
      } else {
        setToAmount(parseFloat(rawOutput.toFixed(6)).toString());
      }
    },
    []
  );

  const handleFromAmountChange = (val: string) => {
    setFromAmount(val);
    calculateOutput(val, fromToken, toToken);
  };

  const handleFlipTokens = () => {
    if (!fromToken || !toToken) return;
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    // Recalculate with same input amount on swapped tokens
    calculateOutput(fromAmount, toToken, tempToken);
  };

  const handleSelectFromToken = (token: Token) => {
    setFromToken(token);
    calculateOutput(fromAmount, token, toToken);
  };

  const handleSelectToToken = (token: Token) => {
    setToToken(token);
    calculateOutput(fromAmount, fromToken, token);
  };

  // Execute Swap Simulation
  const handleExecuteSwap = () => {
    if (!fromToken || !toToken) return;
    const numFrom = parseFloat(fromAmount);
    const numTo = parseFloat(toAmount);
    if (isNaN(numFrom) || isNaN(numTo)) return;

    setIsSwapping(true);
    setIsTxModalOpen(true);
    setCurrentTx(null);

    // Simulate blockchain delay of 2.2 seconds
    setTimeout(() => {
      const generatedHash =
        '0x' +
        Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newTx: SwapTransaction = {
        id: Date.now().toString(),
        fromToken: { ...fromToken },
        toToken: { ...toToken },
        fromAmount: numFrom,
        toAmount: numTo,
        rate: fromToken.price / toToken.price,
        txHash: generatedHash,
        timestamp: new Date(),
      };

      // Update mock wallet balances
      setFromToken((prev) => (prev ? { ...prev, balance: Math.max(0, prev.balance - numFrom) } : prev));
      setToToken((prev) => (prev ? { ...prev, balance: prev.balance + numTo } : prev));

      // Update in overall tokens list
      setTokens((prevList) =>
        prevList.map((t) => {
          if (t.currency === fromToken.currency) {
            return { ...t, balance: Math.max(0, t.balance - numFrom) };
          }
          if (t.currency === toToken.currency) {
            return { ...t, balance: t.balance + numTo };
          }
          return t;
        })
      );

      setCurrentTx(newTx);
      setIsSwapping(false);
      setFromAmount('');
      setToAmount('');
    }, 2200);
  };

  return (
    <div className="app-container">
      {/* Background ambient decorative glowing orbs */}
      <div className="bg-gradient-glow glow-top-left" />
      <div className="bg-gradient-glow glow-bottom-right" />

      <Navbar />

      <main className="main-content">
        {isLoadingTokens || !fromToken || !toToken ? (
          <div className="loading-container">
            <Loader2 className="animate-spin text-brand" size={42} />
            <p>Loading live token prices...</p>
          </div>
        ) : (
          <div className="swap-wrapper">
            <SwapCard
              fromToken={fromToken}
              toToken={toToken}
              fromAmount={fromAmount}
              toAmount={toAmount}
              settings={settings}
              isRefreshing={isRefreshing}
              isSwapping={isSwapping}
              onChangeFromAmount={handleFromAmountChange}
              onFlipTokens={handleFlipTokens}
              onOpenFromModal={() => setIsFromModalOpen(true)}
              onOpenToModal={() => setIsToModalOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onRefreshRates={() => loadTokens(true)}
              onExecuteSwap={handleExecuteSwap}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built for 99Tech Code Challenge • Live rates powered by Switcheo API</p>
      </footer>

      {/* Modals */}
      {fromToken && toToken && (
        <>
          <TokenModal
            isOpen={isFromModalOpen}
            onClose={() => setIsFromModalOpen(false)}
            tokens={tokens}
            selectedToken={fromToken}
            otherToken={toToken}
            onSelectToken={handleSelectFromToken}
          />

          <TokenModal
            isOpen={isToModalOpen}
            onClose={() => setIsToModalOpen(false)}
            tokens={tokens}
            selectedToken={toToken}
            otherToken={fromToken}
            onSelectToken={handleSelectToToken}
          />

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onUpdateSettings={setSettings}
          />

          <TransactionModal
            isOpen={isTxModalOpen}
            isLoading={isSwapping}
            tx={currentTx}
            onClose={() => setIsTxModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default App;
