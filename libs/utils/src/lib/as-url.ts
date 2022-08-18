import normalizeUrl from 'normalize-url';

export const asUrl = (url: string): string =>
  normalizeUrl(url, { forceHttps: true });
