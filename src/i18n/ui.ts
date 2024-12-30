import { en } from "./resources/en";
import { ja } from "./resources/ja";

export const languages = {
  en: en["display-name"],
  ja: ja["display-name"],
};

export type Language = keyof typeof languages;

export const defaultLang: Language = 'en';

export const ui = {
  en,
  ja,
} as const;
