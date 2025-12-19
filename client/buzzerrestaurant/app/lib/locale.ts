import { locales, defaultLocale, type Locale } from '../../i18n';

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  try {
    const stored = localStorage.getItem('locale');
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch (error) {
    console.error('Error reading locale from localStorage:', error);
  }
  
  return defaultLocale;
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('locale', locale);
  } catch (error) {
    console.error('Error saving locale to localStorage:', error);
  }
}

