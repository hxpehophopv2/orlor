import React, { createContext, useContext, useState, useEffect } from 'react';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('site_lang') || 'th';
  });
  const [i18nData, setI18nData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchI18n = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}i18n.json`);
        const data = await response.json();
        setI18nData(data);
      } catch (e) {
        console.error('Failed to load i18n data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchI18n();
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('site_lang', lang);
  };

  const t = (key) => {
    if (!i18nData) return '';
    if (!i18nData[key]) return key;
    return i18nData[key][currentLang] || i18nData[key]['th'] || key;
  };

  const tHtml = (key) => {
    return { __html: t(key) };
  };

  return (
    <I18nContext.Provider value={{ currentLang, changeLanguage, t, tHtml, loading }}>
      {!loading && children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
