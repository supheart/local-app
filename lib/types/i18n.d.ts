import { Rosetta } from 'rosetta';

export type I18nContextType<T = any> = {
  activeLocale: LocalLng;
  t: Rosetta<T>['t'];
  locale: (l: LocalLng, dict?: LngDict) => void;
  setLanguage: (LocalLng) => void;
};

export type I18nProviderType = (params: {
  children: React.ReactNode;
  locale: LocalLng;
  lngDict: LngDict;
  setLang: (params: any) => void;
}) => JSX.Element;