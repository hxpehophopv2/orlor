import React from 'react';
import { useLocation } from 'react-router-dom';
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
  const { tHtml, currentLang } = useI18n();
  const location = useLocation();
  const isClass2 = location.pathname.includes('class2');
  const isClass3 = location.pathname.includes('class3');
  const isClass4 = location.pathname.includes('class4');

  const toc2 = currentLang === 'en' ? toc2_en : toc2_th;
  const toc3 = currentLang === 'en' ? toc3_en : toc3_th;
  const toc4 = currentLang === 'en' ? toc4_en : toc4_th;

  if (isClass4) {
    return (
      <aside className="sidebar" id="sidebar">
        <div className="toc-title">
          {currentLang === 'en' ? 'Class 4 · Backend + DBMS' : 'สารบัญคลาส 4 · Backend + DBMS'}
        </div>
        <ul className="toc" id="tocList">
          {toc4.map(item => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
        </ul>
      </aside>
    );
  }

  if (isClass3) {
    return (
      <aside className="sidebar" id="sidebar">
        <div className="toc-title">
          {currentLang === 'en' ? 'Class 3 · Deploy Static Web' : 'สารบัญคลาส 3 · Deploy Static Web'}
        </div>
        <ul className="toc" id="tocList">
          {toc3.map(item => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
        </ul>
      </aside>
    );
  }

  if (isClass2) {
    return (
      <aside className="sidebar" id="sidebar">
        <div className="toc-title">
          {currentLang === 'en' ? 'Class 2 · Managing Processes' : 'สารบัญคลาส 2 · Managing Processes'}
        </div>
        <ul className="toc" id="tocList">
          {toc2.map(item => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
        </ul>
      </aside>
    );
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="toc-title" dangerouslySetInnerHTML={tHtml('t_8')} />
      <ul className="toc" id="tocList">
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
      </ul>
    </aside>
  );
};

export default TableOfContents;
