'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * Returns true if the media query matches
 * 
 * @param query - CSS media query string (e.g., '(max-width: 640px)')
 * @returns boolean - Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Preset hook for mobile detection
 * @returns boolean - Whether the viewport is mobile (< 640px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}
