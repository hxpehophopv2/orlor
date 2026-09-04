import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

const toc2_th = [
  { href: '#intro', label: 'บทนำ' },
  { href: '#seeing', label: 'ดูโพรเซส' },
  { href: '#detaching', label: 'หนีจาก Logout' },
  { href: '#signals', label: 'Signals' },
  { href: '#systemd', label: 'ส่งให้ systemd' },
  { href: '#quiz', label: 'ทดสอบความเข้าใจ' },
  { href: '#cheatsheet', label: 'Cheat Sheet' },
];
const toc2_en = [
  { href: '#intro', label: 'Intro' },
  { href: '#seeing', label: 'Seeing Processes' },
  { href: '#detaching', label: 'Surviving Logout' },
  { href: '#signals', label: 'Signals' },
  { href: '#systemd', label: 'Deploying with systemd' },
  { href: '#quiz', label: 'Self-Test Quiz' },
  { href: '#cheatsheet', label: 'Cheat Sheet' },
];

const toc3_th = [
  { href: '#intro', label: 'ภาพรวมวิชา' },
  { href: '#repos', label: 'Repositories & Trust' },
  { href: '#service', label: 'Service Processes' },
  { href: '#reachable', label: '3 Layer Reachability' },
  { href: '#blocks', label: 'Server Blocks' },
  { href: '#limits', label: 'ขีดจำกัด Static Web' },
  { href: '#quiz', label: 'ทดสอบความเข้าใจ' },
  { href: '#cheatsheet', label: 'Cheat Sheet' },
];
const toc3_en = [
  { href: '#intro', label: 'Course Overview' },
  { href: '#repos', label: 'Repositories & Trust' },
  { href: '#service', label: 'Service Processes' },
  { href: '#reachable', label: '3-Layer Reachability' },
  { href: '#blocks', label: 'Server Blocks' },
  { href: '#limits', label: 'Static Web Limits' },
  { href: '#quiz', label: 'Self-Test Quiz' },
  { href: '#cheatsheet', label: 'Cheat Sheet' },
];

const toc4_th = [
  { href: '#intro', label: 'ภาพรวมวิชา' },
  { href: '#architecture', label: '3 Server Architecture' },
  { href: '#database', label: 'ติดตั้ง MySQL' },
  { href: '#privilege', label: 'Least Privilege' },
  { href: '#app', label: 'Node.js App' },
  { href: '#service', label: 'systemd Service' },
  { href: '#quiz', label: 'ทดสอบความเข้าใจ' },
  { href: '#cheatsheet', label: 'Cheat Sheet' },
];
const toc4_en = [
  { href: '#intro', label: 'Course Overview' },
  { href: '#architecture', label: '3-Server Architecture' },
  { href: '#database', label: 'MySQL Setup' },
  { href: '#privilege', label: 'Least Privilege' },
  { href: '#app', label: 'Node.js App' },
  { href: '#service', label: 'systemd Service' },
  { href: '#quiz', label: 'Self-Test Quiz' },
  { href: '#cheatsheet', label: 'Cheat Sheet' },
];

const TableOfContents = () => {
  const { tHtml, currentLang, changeLanguage } = useI18n();
  const location = useLocation();
  const isClass2 = location.pathname.includes('class2');
  const isClass3 = location.pathname.includes('class3');
  const isClass4 = location.pathname.includes('class4');

  const toc2 = currentLang === 'en' ? toc2_en : toc2_th;
  const toc3 = currentLang === 'en' ? toc3_en : toc3_th;
  const toc4 = currentLang === 'en' ? toc4_en : toc4_th;

  const renderNavLinks = () => (
    <div className="sidebar-nav-pills" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="toc-title" style={{ marginTop: 0 }}>Settings & Navigation</div>
      
      <div
        className="lang-switcher"
        style={{
          display: "flex",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "20px",
          padding: "4px",
          marginBottom: "12px",
        }}
      >
        <button
          onClick={() => changeLanguage("en")}
          style={{
            flex: 1,
            background: currentLang === "en" ? "var(--orange)" : "transparent",
            border: "none",
            borderRadius: "16px",
            color: currentLang === "en" ? "#fff" : "var(--ink-soft)",
            padding: "6px 0",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage("th")}
          style={{
            flex: 1,
            background: currentLang === "th" ? "var(--orange)" : "transparent",
            border: "none",
            borderRadius: "16px",
            color: currentLang === "th" ? "#fff" : "var(--ink-soft)",
            padding: "6px 0",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          TH
        </button>
      </div>

      <hr style={{ border: 0, height: 1, background: 'rgba(0,0,0,0.08)', margin: '4px 0 12px 0' }} />

      <Link
        to="/class1"
        className={`class-pill ${location.pathname.includes("class1") ? "active" : ""}`}
        style={{ textDecoration: "none", width: '100%', boxSizing: 'border-box' }}
        dangerouslySetInnerHTML={tHtml("t_3")}
      />
      <Link
        to="/class2"
        className={`class-pill ${location.pathname.includes("class2") ? "active" : ""}`}
        style={{ textDecoration: "none", width: '100%', boxSizing: 'border-box' }}
        dangerouslySetInnerHTML={tHtml("t_4")}
      />
      <Link
        to="/class3"
        className={`class-pill ${location.pathname.includes("class3") ? "active" : ""}`}
        style={{ textDecoration: "none", width: '100%', boxSizing: 'border-box' }}
        dangerouslySetInnerHTML={tHtml("t_5")}
      />
      <Link
        to="/class4"
        className={`class-pill ${location.pathname.includes("class4") ? "active" : ""}`}
        style={{ textDecoration: "none", width: '100%', boxSizing: 'border-box' }}
        dangerouslySetInnerHTML={tHtml("t_6")}
      />
      <Link
        to="/class5"
        className={`class-pill locked`}
        style={{ textDecoration: "none", width: '100%', boxSizing: 'border-box', opacity: 0.6 }}
        data-msg={currentLang === "en" ? "Not available yet" : "ยังไม่ถึงเวลาเรียน"}
        dangerouslySetInnerHTML={tHtml("t_7")}
      />
    </div>
  );

  let tocTitle;
  let tocList;

  if (isClass4) {
    tocTitle = currentLang === 'en' ? 'Class 4 · Backend + DBMS' : 'สารบัญคลาส 4 · Backend + DBMS';
    tocList = toc4.map(item => (
      <li key={item.href}><a href={item.href}>{item.label}</a></li>
    ));
  } else if (isClass3) {
    tocTitle = currentLang === 'en' ? 'Class 3 · Deploy Static Web' : 'สารบัญคลาส 3 · Deploy Static Web';
    tocList = toc3.map(item => (
      <li key={item.href}><a href={item.href}>{item.label}</a></li>
    ));
  } else if (isClass2) {
    tocTitle = currentLang === 'en' ? 'Class 2 · Managing Processes' : 'สารบัญคลาส 2 · Managing Processes';
    tocList = toc2.map(item => (
      <li key={item.href}><a href={item.href}>{item.label}</a></li>
    ));
  } else {
    tocTitle = <span dangerouslySetInnerHTML={tHtml('t_8')} />;
    tocList = (
      <>
        <li><a href="#intro" dangerouslySetInnerHTML={tHtml('t_9')} /></li>
        <li><a href="#anatomy" dangerouslySetInnerHTML={tHtml('t_10')} /></li>
        <li><a href="#history" dangerouslySetInnerHTML={tHtml('t_11')} /></li>
        <li><a href="#editing" dangerouslySetInnerHTML={tHtml('t_12')} /></li>
        <li><a href="#bashrc" dangerouslySetInnerHTML={tHtml('t_13')} /></li>
        <li><a href="#identity" dangerouslySetInnerHTML={tHtml('t_14')} /></li>
        <li><a href="#ownership" dangerouslySetInnerHTML={tHtml('t_15')} /></li>
        <li><a href="#users" dangerouslySetInnerHTML={tHtml('t_16')} /></li>
        <li><a href="#packages" dangerouslySetInnerHTML={tHtml('t_17')} /></li>
        <li><a href="#services" dangerouslySetInnerHTML={tHtml('t_18')} /></li>
        <li><a href="#quiz" dangerouslySetInnerHTML={tHtml('t_19')} /></li>
        <li><a href="#cheatsheet" dangerouslySetInnerHTML={tHtml('t_20')} /></li>
      </>
    );
  }

  return (
    <aside className="sidebar" id="sidebar">
      {renderNavLinks()}
      <div className="toc-title">{tocTitle}</div>
      <ul className="toc" id="tocList">
        {tocList}
      </ul>
    </aside>
  );
};

export default TableOfContents;
