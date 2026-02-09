'use client';

import { useEffect, useState } from 'react';

interface UseScrollToTopOptions {
  threshold?: number;
}

export function useScrollToTop(options: UseScrollToTopOptions = {}) {
  const { threshold = 300 } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down past threshold
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return {
    isVisible,
    scrollToTop,
  };
}
