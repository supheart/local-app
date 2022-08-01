import { useContext } from 'react';
import { I18nContext } from '../i18n';
import { I18nContextType } from '../types/i18n';

export const useI18n = (): I18nContextType => useContext<I18nContextType>(I18nContext);
export default useI18n;