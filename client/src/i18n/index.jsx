import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import en from './en.json';
import bn from './bn.json';
import de from './de.json';

const dictionaries = { en, bn, de };
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'de', label: 'Deutsch' },
];

const I18nContext = createContext({ t: (k) => en[k] || k, lang: 'en', setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('lang');
      return dictionaries[saved] ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = useCallback((code) => {
    if (!dictionaries[code]) return;
    setLangState(code);
    document.documentElement.lang = code;
    try {
      localStorage.setItem('lang', code);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: (key) => dictionaries[lang]?.[key] ?? en[key] ?? key }),
    [lang, setLang]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useT = () => useContext(I18nContext);
