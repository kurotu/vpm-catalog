import { ui, defaultLang, type Language } from './ui';

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getRelativePath(currentLocale: Language, relativeLocaleUrl: string) {
  const localePath = currentLocale === defaultLang ? '/' : `/${currentLocale}/`;
  return relativeLocaleUrl.replace(localePath, '').replace(/\/$/, '');
}
