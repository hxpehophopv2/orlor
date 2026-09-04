import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

const Header = () => {
  const { currentLang, changeLanguage, tHtml } = useI18n();
  const location = useLocation();

  return (
    <div className="topbar">
      <button
        className="menu-btn"
        id="menuBtn"
        aria-label="เปิดเมนู"
        dangerouslySetInnerHTML={tHtml('t_1')}
      />
      <div className="brand" dangerouslySetInnerHTML={tHtml('t_2')} />
      
      <div className="class-pills" id="classPills" style={{ marginLeft: 0 }}>
        <Link 
          to="/class1" 
          className={`class-pill ${location.pathname.includes('class1') ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          dangerouslySetInnerHTML={tHtml('t_3')} 
        />
        <Link
          to="/class2"
          className={`class-pill ${location.pathname.includes('class2') ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          dangerouslySetInnerHTML={tHtml('t_4')}
        />
        <Link
          to="/class3"
          className={`class-pill ${location.pathname.includes('class3') ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          dangerouslySetInnerHTML={tHtml('t_5')}
        />
        <Link
          to="/class4"
          className={`class-pill ${location.pathname.includes('class4') ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          dangerouslySetInnerHTML={tHtml('t_6')}
        />
        <Link
          to="/class5"
          className={`class-pill ${location.pathname.includes('class5') ? 'active' : 'locked'}`}
          style={{ textDecoration: 'none' }}
          data-msg={currentLang === 'en' ? "Not available yet" : "ยังไม่ถึงเวลาเรียน"}
          dangerouslySetInnerHTML={tHtml('t_7')}
        />
      </div>

      <div
        className="lang-switcher"
        style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}
      >
        <button
          onClick={() => changeLanguage('en')}
          className={`class-pill ${currentLang === 'en' ? 'active' : 'locked'}`}
          style={{
            background: currentLang === 'en' ? 'var(--orange)' : 'none',
            border: currentLang === 'en' ? '1px solid var(--orange)' : '1px solid rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
          }}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('th')}
          className={`class-pill ${currentLang === 'th' ? 'active' : 'locked'}`}
          style={{
            background: currentLang === 'th' ? 'var(--orange)' : 'none',
            border: currentLang === 'th' ? '1px solid var(--orange)' : '1px solid rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
          }}
        >
          TH
        </button>
      </div>
    </div>
  );
};

export default Header;
