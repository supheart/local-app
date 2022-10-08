export function getMessages(locales: string | string[] = ['en']): [locale: string, languageBundle: any, antdLanguage: any] {
  if (!Array.isArray(locales)) {
    locales = [locales];
  }
  locales = locales.reverse();
  let languageBundle, antdLanguage, locale = '';
  for (let i = 0; i < locales.length; i++) {
    locale = locales[i];
    switch (locale) {
      case 'zh-Hant-HK':
      case 'zh-HK':
      case 'zh-TW':
      case 'zh-Hans-CN':
      case 'zh-CN':
      case 'zh':
        languageBundle = import('../locales/zh/zh_CN');
        antdLanguage = import('antd/lib/locale/zh_CN');
        break;
      case 'en-GB':
      case 'en-US':
      case 'en':
        languageBundle = import('../locales/en/en');
        antdLanguage = import('antd/lib/locale/en_US');
        break;
      default:
        break;
    }
  }
  // console.log(112233, locales, languageBundle);
  if (!languageBundle) {
    // return ['en', import('../locales/en/en'), import('antd/lib/locale/en_US')];
    return ['zh', import('../locales/zh/zh_CN'), import('antd/lib/locale/zh_CN')];
  }

  return [locale, languageBundle, antdLanguage];
}
