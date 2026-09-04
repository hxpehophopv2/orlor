import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import TableOfContents from './components/TableOfContents';
import Class1 from './pages/Class1';
import Class2 from './pages/Class2';
import Class3 from './pages/Class3';
import Class4 from './pages/Class4';
import { useI18n } from './context/I18nContext';
import gsap from 'gsap';
import LoadingScreen from './components/LoadingScreen';
import './index.css';
import './progress.css';

function App() {
  const { currentLang, loading } = useI18n();
  const location = useLocation();
  const [showToTop, setShowToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showBootScreen, setShowBootScreen] = useState(true);
  const progressTimeoutRef = useRef(null);

  // Initialize tooltips and IntersectionObserver when language or loading changes
  useEffect(() => {
    if (loading) return;

    // 1. Re-initialize Lucide icons
    if (window.lucide) {
      setTimeout(() => window.lucide.createIcons(), 10);
    }

    // 2. Initialize IntersectionObserver for Table of Contents
    const sections = document.querySelectorAll('.lesson');
    const navLinks = document.querySelectorAll('.toc a');

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    // 3. Mobile sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menuBtn');
    
    const showSidebar = () => {
      if (sidebar) sidebar.classList.add('show');
      if (overlay) overlay.classList.add('show');
    };
    const hideSidebar = () => {
      if (sidebar) sidebar.classList.remove('show');
      if (overlay) overlay.classList.remove('show');
    };
    
    if (menuBtn) menuBtn.addEventListener('click', showSidebar);
    if (overlay) overlay.addEventListener('click', hideSidebar);
    navLinks.forEach(l => l.addEventListener('click', hideSidebar));

    // 4. Locked class pills in Header
    const lockedPills = document.querySelectorAll('.class-pills .class-pill.locked');
    const pillHandlers = [];
    lockedPills.forEach(p => {
      p.dataset.orig = p.textContent;
      const handler = function(e){
        e.preventDefault();
        clearTimeout(p._t);
        p.textContent = p.getAttribute('data-msg') || "Locked";
        p._t = setTimeout(function(){ p.textContent = p.dataset.orig; }, 1800);
      };
      p.addEventListener('click', handler);
      pillHandlers.push({ p, handler });
    });

    return () => {
      observer.disconnect();
      if (menuBtn) menuBtn.removeEventListener('click', showSidebar);
      if (overlay) overlay.removeEventListener('click', hideSidebar);
      navLinks.forEach(l => l.removeEventListener('click', hideSidebar));
      pillHandlers.forEach(({p, handler}) => p.removeEventListener('click', handler));
    };

  }, [currentLang, loading, location.pathname]);

  // Scroll logic for ToTop and Progress
  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 300);
      
      // Calculate progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = Math.round((winScroll / height) * 100);
      
      setScrollProgress(scrolled);
      setShowProgress(true);

      if (progressTimeoutRef.current) clearTimeout(progressTimeoutRef.current);
      progressTimeoutRef.current = setTimeout(() => {
        setShowProgress(false);
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (progressTimeoutRef.current) clearTimeout(progressTimeoutRef.current);
    };
  }, []);

  if (loading) return null;

  return (
    <>
      {showBootScreen && <LoadingScreen onComplete={() => setShowBootScreen(false)} />}
      <Header />
      <div className="overlay" id="overlay"></div>
      <div className="layout">
        <TableOfContents />
        <Routes>
          <Route path="/" element={<Navigate to="/class1" replace />} />
          <Route path="/class1" element={<Class1 />} />
          <Route path="/class2" element={<Class2 />} />
          <Route path="/class3" element={<Class3 />} />
          <Route path="/class4" element={<Class4 />} />
          <Route path="*" element={<div style={{padding:'20px'}}>Class not found or coming soon.</div>} />
        </Routes>
      </div>

      {/* Progress Indicator */}
      <div 
        className={`scroll-progress ${showProgress ? 'visible' : ''}`}
      >
        {scrollProgress}%
      </div>

      <button 
        id="toTop" 
        className={showToTop ? 'show' : ''}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="กลับขึ้นด้านบน"
      >
        <i data-lucide="arrow-up" className="icon-sm"></i>
      </button>
    </>
  );
}

export default App;
