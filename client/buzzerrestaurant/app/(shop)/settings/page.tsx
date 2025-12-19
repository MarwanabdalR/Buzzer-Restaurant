'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { CheckIcon } from '@heroicons/react/24/solid';
import { type Locale, defaultLocale } from '../../../i18n';
import { getStoredLocale, setStoredLocale } from '../../lib/locale';

export default function SettingsPage() {
  const router = useRouter();
  const t = useTranslations('Settings');
  // Start with default locale to avoid hydration mismatch
  const [language, setLanguage] = useState<Locale>('en');
  const [isClient, setIsClient] = useState(false);

  // Only read from localStorage after component mounts on client
  useEffect(() => {
    // Use setTimeout to defer state updates after mount
    const timer = setTimeout(() => {
      setIsClient(true);
      const stored = getStoredLocale();
      setLanguage(stored);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === language) return;
    
    setLanguage(newLocale);
    setStoredLocale(newLocale);
    
    // Dispatch a custom event to notify the IntlProvider
    window.dispatchEvent(new CustomEvent('localechange', { detail: newLocale }));
    
    // Reload the page to apply the new locale
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleChangePassword = () => {
    router.push('/settings/change-password');
  };

  const handleUpdate = () => {
    toast.success(t('updateSuccess'));
  };

  // Use default locale during SSR to avoid hydration mismatch
  const displayLanguage = isClient ? language : defaultLocale;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <MobileHeader title={t('title')} showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <Container>
          <div className="py-4 space-y-4">
            {/* Password Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{t('password')}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChangePassword}
                  className="bg-[#FFB800] text-white px-6 py-2 rounded-lg font-medium text-sm uppercase tracking-wide"
                >
                  {t('change')}
                </motion.button>
              </div>
            </motion.div>

            {/* Language Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{t('language')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('selectLanguage')}</p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={language === 'en'}
                    onChange={() => handleLanguageChange('en')}
                    className="w-5 h-5 text-[#4d0d0d] border-gray-300 focus:ring-[#4d0d0d]"
                  />
                  <span className="text-gray-900">{t('english')}</span>
                  {displayLanguage === 'en' && (
                    <CheckIcon className="w-5 h-5 text-[#4d0d0d] ml-auto" />
                  )}
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="ar"
                    checked={displayLanguage === 'ar'}
                    onChange={() => handleLanguageChange('ar')}
                    className="w-5 h-5 text-[#4d0d0d] border-gray-300 focus:ring-[#4d0d0d]"
                  />
                  <span className="text-gray-900">{t('arabic')}</span>
                  {displayLanguage === 'ar' && (
                    <CheckIcon className="w-5 h-5 text-[#4d0d0d] ml-auto" />
                  )}
                </label>
              </div>
            </motion.div>

            {/* Update Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdate}
              className="w-full bg-[#FFB800] text-white py-4 rounded-xl font-bold text-base uppercase tracking-wide shadow-lg"
            >
              {t('update')}
            </motion.button>
          </div>
        </Container>
      </main>
    </div>
  );
}

