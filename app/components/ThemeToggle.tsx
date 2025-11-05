'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'cdil-light' | 'cdil-dark'>('cdil-light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'cdil-light' | 'cdil-dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'cdil-dark' : 'cdil-light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'cdil-light' ? 'cdil-dark' : 'cdil-light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <label className="swap swap-rotate btn btn-circle btn-primary shadow-lg">
        <input
          type="checkbox"
          checked={theme === 'cdil-dark'}
          onChange={toggleTheme}
          aria-label="Toggle theme"
        />

        {/* Sun icon for light mode */}
        <FontAwesomeIcon
          icon={faSun}
          className="swap-off h-5 w-5"
        />

        {/* Moon icon for dark mode */}
        <FontAwesomeIcon
          icon={faMoon}
          className="swap-on h-5 w-5"
        />
      </label>
    </div>
  );
}
