import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiMenu, HiX } from 'react-icons/hi';
import API from '../api/api';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('access_token');

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token found');

      const res = await API.post('/user/logout/', { refresh: refreshToken });

      if (res.status === 200) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('lang');
        nav('/');
      } else {
        alert('Logout Failed');
      }
    } catch (err) {
      console.error(err);
      alert('Logout Failed');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">AI Chat</Link>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/" className="px-3 py-1 hover:text-sky-600">{t('home') || 'Home'}</Link>

        <Link to="/chat" className="px-3 py-1 bg-sky-600 text-white rounded">
          {t('chat_placeholder')}
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/profile" className="px-3 py-1">{t('profile')}</Link>
            <button onClick={logout} className="px-3 py-1">{t('logout')}</button>
          </>
        )}

        <button
          onClick={toggleLanguage}
          className="px-2 py-1 border rounded"
        >
          {i18n.language.toUpperCase()}
        </button>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(prev => !prev)}>
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow rounded p-4 flex flex-col gap-2 md:hidden z-50">
          <Link to="/" className="px-3 py-1 hover:text-sky-600">{t('home') || 'Home'}</Link>
          <Link to="/chat" className="px-3 py-1 bg-sky-600 text-white rounded">
            {t('chat_placeholder')}
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/profile" className="px-3 py-1">{t('profile')}</Link>
              <button onClick={logout} className="px-3 py-1">{t('logout')}</button>
            </>
          )}

          <button
            onClick={toggleLanguage}
            className="px-3 py-1 border rounded"
          >
            {i18n.language.toUpperCase()}
          </button>
        </div>
      )}
    </nav>
  );
}
