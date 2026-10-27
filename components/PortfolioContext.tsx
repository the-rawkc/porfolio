'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialPortfolioData } from '@/lib/default-content';
import { hexToRgba, PortfolioData } from '@/lib/portfolio-data';

const STORAGE_KEY = 'rawkc_portfolio_data';

interface PortfolioContextType {
  data: PortfolioData;
  setData: (data: PortfolioData | ((prev: PortfolioData) => PortfolioData)) => void;
  saveData: (overrideData?: PortfolioData) => Promise<{ success: boolean; message?: string }>;
  resetToDefault: () => void;
  isLoaded: boolean;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: initialPortfolioData,
  setData: () => {},
  saveData: async () => ({ success: true }),
  resetToDefault: () => {},
  isLoaded: false,
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<PortfolioData>(initialPortfolioData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Apply theme accent color to CSS root variables dynamically
  const applyTheme = (color: string) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--accent-dim', hexToRgba(color, 0.12));
    root.style.setProperty('--accent-dim2', hexToRgba(color, 0.06));
  };

  useEffect(() => {
    // 1. Check LocalStorage first for instant customized view
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setDataState(parsed);
        if (parsed.theme?.accentColor) {
          applyTheme(parsed.theme.accentColor);
        }
      }
    } catch (e) {
      console.warn('Could not read cached portfolio data:', e);
    }

    // 2. Fetch server store
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          // If no local edits yet, set from server
          if (!localStorage.getItem(STORAGE_KEY)) {
            setDataState(res.data);
            if (res.data.theme?.accentColor) {
              applyTheme(res.data.theme.accentColor);
            }
          }
        }
      })
      .catch(err => {
        console.warn('Could not fetch /api/portfolio:', err);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const setData = (updater: PortfolioData | ((prev: PortfolioData) => PortfolioData)) => {
    setDataState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next.theme?.accentColor) {
        applyTheme(next.theme.accentColor);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return next;
    });
  };

  const saveData = async (overrideData?: PortfolioData) => {
    const toSave = overrideData || data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn(e);
    }
    if (toSave.theme?.accentColor) {
      applyTheme(toSave.theme.accentColor);
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave),
      });
      const result = await res.json();
      return { success: result.success ?? true, message: 'Changes saved successfully!' };
    } catch (err) {
      return { success: true, message: 'Saved to local browser storage.' };
    }
  };

  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setDataState(initialPortfolioData);
    applyTheme(initialPortfolioData.theme.accentColor);
  };

  return (
    <PortfolioContext.Provider value={{ data, setData, saveData, resetToDefault, isLoaded }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
