import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app';
import { getMessages } from 'lib/locales';
import I18nProvider from 'lib/i18n';
// import 'antd/dist/antd.css';
import '../styles/globals.css'
import './_app.globals.less'

interface IntlApp extends AppProps {
  locale: string;
  lngDict: any;
  antdLang: any;
  appId: string;
  sessionToken?: string;
  // layout: LayoutParams;

  // enhance page component static prop
  // Component: NextPage & {
  //   getLayout?: (page: ReactElement) => ReactNode;
  // };
}

// type LocalAppProps = React.FC<IntlApp> & { getInitialProps: typeof App.getInitialProps };

function LocalApp({ 
  Component,
  pageProps,
  locale: _locale,
  lngDict: _lngDict,
  antdLang: _antdLang,
}: IntlApp) {
  return <div id='local-app'>
    <I18nProvider lngDict={_lngDict} locale={_locale} setLang={_antdLang}>
      <Component {...pageProps} />
    </I18nProvider>
  </div>
}

const getInitialProps: typeof App.getInitialProps = async (appContext: AppContext) => {
  const { ctx: { req } } = appContext;
  const languages = req?.headers?.['accept-language']?.split(',').map(language => language.split(';')[0]);
  console.log('languages', languages);

  const [supportedLocale, defaultLanguage, antdLanguagePackage] = getMessages(languages);
  

  const [languagePackage, antdPackage, appProps] = await Promise.all(
    [
      defaultLanguage,
      antdLanguagePackage,
      App.getInitialProps(appContext),
    ].filter(Boolean),
  );


  return {
    ...appProps,
    locale: supportedLocale,
    lngDict: languagePackage.default,
    antdLang: antdPackage.default,
    defaultLanguage,
    supportedLocale,
  };
};

LocalApp.getInitialProps = getInitialProps;

export default LocalApp;
