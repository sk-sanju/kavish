import React, { createContext, useContext, useState } from 'react';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number; // multiplier relative to INR (1.0)
  flag: string;
  locale: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1.0, flag: '🇮🇳', locale: 'en-IN', decimals: 0 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012, flag: '🇺🇸', locale: 'en-US', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011, flag: '🇪🇺', locale: 'de-DE', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0094, flag: '🇬🇧', locale: 'en-GB', decimals: 2 },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 0.044, flag: '🇦🇪', locale: 'en-AE', decimals: 2 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 0.016, flag: '🇨🇦', locale: 'en-CA', decimals: 2 },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rate: 0.018, flag: '🇦🇺', locale: 'en-AU', decimals: 2 },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', rate: 0.016, flag: '🇸🇬', locale: 'en-SG', decimals: 2 },
];

interface CurrencyContextType {
  currency: CurrencyConfig;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (amountInINR: number, options?: { showDecimal?: boolean }) => string;
  convertPrice: (amountInINR: number) => number;
  currencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'kavish_currency_preference';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = SUPPORTED_CURRENCIES.find((c) => c.code === saved);
      if (found) return found;
    }
    return SUPPORTED_CURRENCIES[0]; // Default INR
  });

  const setCurrencyByCode = (code: string) => {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    if (found) {
      setCurrencyState(found);
      localStorage.setItem(STORAGE_KEY, code);
    }
  };

  const convertPrice = (amountInINR: number): number => {
    return Number((amountInINR * currency.rate).toFixed(2));
  };

  const formatPrice = (amountInINR: number, options?: { showDecimal?: boolean }): string => {
    if (amountInINR === 0) {
      return `${currency.symbol}0`;
    }
    const converted = amountInINR * currency.rate;

    if (currency.code === 'INR') {
      return `${currency.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }

    const showDec = options?.showDecimal ?? (currency.decimals > 0);
    const formattedVal = converted.toLocaleString('en-US', {
      minimumFractionDigits: showDec ? currency.decimals : 0,
      maximumFractionDigits: showDec ? currency.decimals : 0,
    });

    return `${currency.symbol}${formattedVal}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrencyByCode,
        formatPrice,
        convertPrice,
        currencies: SUPPORTED_CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
