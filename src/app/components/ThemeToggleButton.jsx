// src/app/components/ThemeToggleButton.jsx
'use client';

import { useEffect } from 'react';

export default function ThemeToggleButton() {
  useEffect(() => {
    const button = document.getElementById('toggle-theme');
    const darkModeClass = 'dark-mode';

    // Aplicar el tema almacenado en localStorage
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
    <button id="toggle-theme" className="bg-cyan-600 p-2 rounded-lg text-white">
      Cambiar Tema
    </button>
  );
}
