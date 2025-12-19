'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'What is Buzzer App?',
    answer: 'Buzzer App is a food delivery and restaurant ordering platform that connects customers with local restaurants and suppliers. Order your favorite meals and track your orders in real-time.',
  },
  {
    question: 'How can I use this application?',
    answer: 'To use Buzzer App, simply browse through available restaurants, select products you like, add them to your cart, and proceed to checkout. You can track your orders and receive notifications about order status updates.',
  },
  {
    question: 'Which payment methods are available?',
    answer: 'Currently, we support Cash on Pickup. You can pay for your order when you collect it from the restaurant.',
  },
  {
    question: 'Something wasn&apos;t quite right?',
    answer: 'We&apos;re sorry to hear that. Please do let us know if anything wasn&apos;t quite right and we will do our best to sort it out. In the first instance, you should speak to the restaurant manager via our website section of &quot;Contact Us&quot;.',
  },
  {
    question: 'How do I track my order?',
    answer: 'You can track your order status in the Orders section of the app. You will also receive notifications when your order status changes.',
  },
  {
    question: 'Can I cancel my order?',
    answer: 'Orders can only be cancelled if they are still in PENDING status. Once an order is being prepared or completed, it cannot be cancelled.',
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations('FAQs');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header - hidden on desktop */}
      <div className="md:hidden">
        <MobileHeader title={t('title')} showBackButton onMenuClick={() => {}} />
      </div>
      
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {/* Mobile View */}
        <div className="md:hidden">
          <Container>
            <div className="py-4 space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 flex-1 pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {openIndex === index ? (
                        <XMarkIcon className="w-5 h-5 text-gray-500 shrink-0" />
                      ) : (
                        <PlusIcon className="w-5 h-5 text-gray-500 shrink-0" />
                      )}
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </Container>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block bg-white">
          {/* Hero Header */}
          <div className="relative h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
            <div className="absolute inset-0 bg-black/40" />
            <Container>
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold text-white mb-4"
                >
                  {t('frequentlyAskedQuestions')}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-300 text-lg"
                >
                  {t('findAnswers')}
                </motion.p>
              </div>
            </Container>
          </div>

          {/* FAQ Content */}
          <Container>
            <div className="py-12 max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 text-lg flex-1 pr-6">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openIndex === index ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        {openIndex === index ? (
                          <XMarkIcon className="w-6 h-6 text-gray-500" />
                        ) : (
                          <PlusIcon className="w-6 h-6 text-gray-500" />
                        )}
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-gray-600 text-base leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Contact Support Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: faqs.length * 0.05 + 0.1 }}
                className="mt-12 bg-[#FFB800]/10 border-2 border-[#FFB800] rounded-lg p-8 text-center"
              >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('stillHaveQuestions')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('contactSupport')}
                </p>
                <motion.a
                  href="/contact-us"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-[#FFB800] text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-[#E5A700] transition-colors"
                >
                  {t('contactUs')}
                </motion.a>
              </motion.div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}

