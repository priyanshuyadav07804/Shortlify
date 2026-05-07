'use client';
import { useState, useEffect } from 'react';
import { ArrowUpIcon } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <a
      href="#top"
      className={`fixed bottom-8 right-8 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon  className="h-5 w-5" />
    </a>
  );
}
