export const isServer = (): boolean => typeof window === 'undefined';

export const inIframe = (): boolean => {
  const inServer = isServer();

  if (inServer) return false;
  try {
    return window.self !== window.top;
  } catch (e) {
    console.warn('inIframe', e);
    return true;
  }
};
