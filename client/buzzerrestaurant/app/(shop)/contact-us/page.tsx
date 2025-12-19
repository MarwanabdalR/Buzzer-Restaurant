'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import toast from 'react-hot-toast';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type Subject = 'general' | 'order' | 'complaint' | 'feedback' | 'technical';

const subjects: { value: Subject; label: string }[] = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'order', label: 'Order Issue' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'technical', label: 'Technical Support' },
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    subject: '' as Subject | '',
    name: '',
    email: '',
    comments: '',
  });
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSubjectDropdown(false);
      }
    };

    if (showSubjectDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSubjectDropdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectSelect = (subject: Subject) => {
    setFormData({ ...formData, subject });
    setShowSubjectDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.name || !formData.email || !formData.comments) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement contact form API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ subject: '' as Subject | '', name: '', email: '', comments: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSubjectLabel = subjects.find(s => s.value === formData.subject)?.label || 'Select Subject';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Contact Us" showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto relative">
        {/* Top Section with Gradient */}
        <div className="bg-gradient-to-br from-[#4d0d0d] to-[#3d0a0a] min-h-[50vh] px-4 py-8">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-white text-2xl font-bold mb-8">Get in Touch With Us!</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:border-white focus:outline-none pb-2 pr-10 text-left flex items-center justify-between"
                  >
                    <span className={formData.subject ? 'text-white' : 'text-white/50'}>
                      {formData.subject ? selectedSubjectLabel : 'Subject'}
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showSubjectDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 overflow-hidden"
                      >
                        {subjects.map((subject) => (
                          <button
                            key={subject.value}
                            type="button"
                            onClick={() => handleSubjectSelect(subject.value)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-900 text-sm"
                          >
                            {subject.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Name */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:border-white focus:outline-none pb-2"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:border-white focus:outline-none pb-2"
                />

                {/* Comments */}
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Comments"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:border-white focus:outline-none pb-2 resize-none"
                />

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-[#FFB800] text-black font-bold py-4 rounded-xl text-base uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  {isSubmitting ? 'SENDING...' : 'SUBMIT'}
                </motion.button>
              </form>
            </motion.div>
          </Container>
        </div>

        {/* Bottom White Section with Curve */}
        <div className="bg-white flex-1 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-tl-[3rem]" />
        </div>
      </main>
    </div>
  );
}

