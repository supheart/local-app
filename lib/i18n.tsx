import { useEffect, useRef, useState } from 'react';
import rosetta from 'rosetta';
import { createContext } from 'react';
import { I18nContextType, I18nProviderType } from './types/i18n';
import { getMessages, getPackageLocale, LOCALE_KEY } from './locales';
import storage from './storage';

export const I18nContext = createContext<I18nContextType>(null);

export const i18n = rosetta();

export const defaultLanguage = 'zhCN';

const I18nProvider: I18nProviderType = ({ children, locale, lngDict, setLang }) => {
  const activeLocaleRef = useRef(locale || defaultLanguage);
  const [, setTick] = useState(0);
  const firstRender = useRef(true);
  // logMsg('lngDict', locale, lngDict);

  const i18nWrapper: I18nContextType = {
    activeLocale: activeLocaleRef.current,
    t: (...args) => i18n.t(...args),
    locale: (l, dict) => {
      // lo;
      i18n.locale(l);
      activeLocaleRef.current = l;
      if (dict) {
        i18n.set(l, dict);
      }
      // force rerender to update view
      setTick(tick => tick + 1);
    },
    setLanguage: async l => {
      const [locales, messagePromise, antdLangPackage] = getMessages(l);
      const [proximaLang, antdLang] = await Promise.all([messagePromise, antdLangPackage]);
      // logMsg('language-change', locales, proximaLang.default, antdLang.default);
      setLang({
        locale: locales,
        lngDict: proximaLang.default,
        antdLang: antdLang.default,
      });
    },
  };

  // for initial SSR render
  if (locale && firstRender.current === true) {
    firstRender.current = false;
    i18nWrapper.locale(locale, lngDict);
  }

  useEffect(() => {
    if (locale) {
      i18nWrapper.locale(locale, lngDict);
    }
    // only when locale/lngDict is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lngDict, locale]);

  // 因请求头有可能与本地不一致
  // 语言 本地存储为主
  useEffect(() => {
    const display = storage.getItem(LOCALE_KEY);
    if (display && display !== activeLocaleRef.current) {
      i18nWrapper.setLanguage(display);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return <I18nContext.Provider value={i18nWrapper}> {children} </I18nContext.Provider>;
};

export default I18nProvider;
