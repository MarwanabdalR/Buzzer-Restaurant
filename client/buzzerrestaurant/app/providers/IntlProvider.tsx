'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getStoredLocale } from '../lib/locale';
import { Locale, defaultLocale } from '../../i18n';
// Pre-load default messages to ensure context is always available
import defaultMessages from '../../messages/en.json';

interface IntlProviderProps {
  children: ReactNode;
}

export const IntlProvider: React.FC<IntlProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, any>>(defaultMessages);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedLocale = getStoredLocale();
        if (storedLocale !== defaultLocale) {
          setLocale(storedLocale);
          const loadedMessages = await import(`../../messages/${storedLocale}.json`);
          setMessages(loadedMessages.default);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        // Keep default messages
      }
    };

    loadMessages();
  }, []);

  // Listen for locale changes
  useEffect(() => {
    const handleLocaleChange = (event: CustomEvent<Locale>) => {
      const newLocale = event.detail;
      setLocale(newLocale);
      import(`../../messages/${newLocale}.json`)
        .then((module) => {
          setMessages(module.default);
        })
        .catch(() => {
          import(`../../messages/en.json`)
            .then((module) => setMessages(module.default))
            .catch(() => setMessages({}));
        });
    };

    const handleStorageChange = () => {
      const newLocale = getStoredLocale();
      if (newLocale !== locale) {
        setLocale(newLocale);
        import(`../../messages/${newLocale}.json`)
          .then((module) => {
            setMessages(module.default);
          })
          .catch(() => {
            import(`../../messages/en.json`)
              .then((module) => setMessages(module.default))
              .catch(() => setMessages({}));
          });
      }
    };

    window.addEventListener('localechange', handleLocaleChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('localechange', handleLocaleChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [locale]);

  // Always render the provider, even with empty messages during loading
  // This ensures the context is available for useTranslations
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

