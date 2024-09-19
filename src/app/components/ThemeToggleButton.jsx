'use client';

import { useEffect } from 'react';

export default function ThemeToggleButton() {
  useEffect(() => {
    const button = document.getElementById('toggle-theme');
    const darkModeClass = 'dark-mode';

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add(darkModeClass);
    }

    const toggleTheme = () => {
      document.body.classList.toggle(darkModeClass);
      localStorage.setItem('theme', document.body.classList.contains(darkModeClass) ? 'dark' : 'light');
    };

    if (button) {
      button.addEventListener('click', toggleTheme);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', toggleTheme);
      }
    };
  }, []);

  return (
    <button 
      id="toggle-theme" 
      className="fixed top-4 right-4 bg-cyan-600 p-2 rounded-full text-white shadow-lg hover:bg-cyan-700 transition-colors">
      {/* Usa emojis para representar el sol y la luna */}
      <span className="dark:hidden">🌞</span>
      <span className="hidden dark:block">🌜</span>
    </button>
  );
}
