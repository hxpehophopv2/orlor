import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import {
  Database,
  Server,
  Globe,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Terminal as TerminalIcon,
  Package,
  Key,
  FileText,
  Zap,
  RefreshCw,
  Play,
  ChevronRight,
  ArrowRight,
  ArrowDown,
  Settings,
  Eye,
  EyeOff,
  Link,
  Layers,
  Code,
  Info,
  Network,
  Cpu,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import Terminal from '../components/Terminal';
import Quiz4 from '../components/Quiz4';

/* ═══════════════════════════════════════════════
   INTERACTIVE 1: Three-Server Architecture Diagram
   ═══════════════════════════════════════════════ */
const ThreeServerDiagram = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';

  const [activeLayer, setActiveLayer] = useState(null);
  const [failedLayer, setFailedLayer] = useState(null);

  const layers = [
    {
      id: 'browser',
      icon: <Globe style={{ width: 20, height: 20 }} />,
      port: ':80',
      nameEn: 'Web Server (nginx)',
      nameTh: 'Web Server (nginx)',
      descEn: 'Serves your HTML/CSS/JS files to the browser. Listens on 0.0.0.0:80 — the whole world.',
      descTh: 'ส่งไฟล์ HTML/CSS/JS ให้ browser. Listens บน 0.0.0.0:80 — ทุกคนเข้าถึงได้',
      color: '#e95420',
      bg: 'rgba(233,84,32,0.12)',
      border: 'rgba(233,84,32,0.35)',
      listen: '0.0.0.0:80',
    },
    {
      id: 'api',
      icon: <Server style={{ width: 20, height: 20 }} />,
      port: ':3xxx',
      nameEn: 'Backend API (Node.js)',
      nameTh: 'Backend API (Node.js)',
      descEn: 'Accepts student data, talks to MySQL. Listens on 0.0.0.0:3xxx — your own port number.',
      descTh: 'รับข้อมูลนักศึกษา คุยกับ MySQL. Listens บน 0.0.0.0:3xxx — หมายเลขพอร์ตของคุณเอง',
      color: '#8FD3F4',
      bg: 'rgba(143,211,244,0.10)',
      border: 'rgba(143,211,244,0.3)',
      listen: '0.0.0.0:3xxx',
    },
    {
      id: 'mysql',
      icon: <Database style={{ width: 20, height: 20 }} />,
      port: ':3306',
      nameEn: 'MySQL Database',
      nameTh: 'MySQL Database',
      descEn: 'Stores data permanently. Listens on 127.0.0.1:3306 — this machine ONLY. Cannot be reached from outside.',
      descTh: 'เก็บข้อมูลถาวร. Listens บน 127.0.0.1:3306 — เครื่องนี้เท่านั้น คนข้างนอกเข้าไม่ได้',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.10)',
      border: 'rgba(16,185,129,0.3)',
      listen: '127.0.0.1:3306',
    },
  ];

  const failures = [
    { id: 'none', labelEn: 'All Running', labelTh: 'ทุกอย่างทำงาน', icon: <CheckCircle style={{ width: 14, height: 14 }} /> },
    { id: 'browser', labelEn: 'nginx Down', labelTh: 'nginx ดับ', icon: <XCircle style={{ width: 14, height: 14 }} /> },
    { id: 'api', labelEn: 'API Down', labelTh: 'API ดับ', icon: <XCircle style={{ width: 14, height: 14 }} /> },
    { id: 'mysql', labelEn: 'MySQL Down', labelTh: 'MySQL ดับ', icon: <XCircle style={{ width: 14, height: 14 }} /> },
  ];

  const getLayerStatus = (id) => {
    if (!failedLayer || failedLayer === 'none') return 'ok';
    if (id === failedLayer) return 'down';
    // downstream effects
    if (id === 'api' && failedLayer === 'mysql') return 'broken';
    if (id === 'browser' && (failedLayer === 'mysql' || failedLayer === 'api')) return 'partial';
    return 'ok';
  };

  const statusColor = { ok: '#10b981', down: '#ef4444', broken: '#f59e0b', partial: '#f59e0b' };

  return (
    <div className="tsd-wrap">
      <div className="tsd-topbar">
        <div className="tsd-title">
          <Layers style={{ color: 'var(--orange)', width: 18, height: 18 }} />
          <span>{lang === 'en' ? '3-Server Architecture Simulator' : 'จำลอง Architecture 3 Server'}</span>
        </div>
        <div className="tsd-failure-btns">
          {failures.map(f => (
            <button
              key={f.id}
              className={`tsd-fail-btn ${(failedLayer || 'none') === f.id ? 'active' : ''}`}
              onClick={() => { setFailedLayer(f.id); setActiveLayer(null); }}
            >
              {f.icon}
              {lang === 'en' ? f.labelEn : f.labelTh}
            </button>
          ))}
        </div>
      </div>

      <div className="tsd-body">
        <div className="tsd-flow">
          <div className="tsd-browser-icon">
            <Globe style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.5)' }} />
            <span className="tsd-browser-label">{lang === 'en' ? 'Browser' : 'Browser'}</span>
          </div>
          <div className="tsd-arrow-group">
            <div className="tsd-arrow">→</div>
          </div>

          {layers.map((layer, idx) => {
            const status = getLayerStatus(layer.id);
            const sColor = statusColor[status];
            return (
              <React.Fragment key={layer.id}>
                <div
                  className={`tsd-layer ${activeLayer === layer.id ? 'highlighted' : ''}`}
                  style={{
                    borderColor: activeLayer === layer.id ? layer.color : status !== 'ok' ? sColor : 'rgba(255,255,255,0.12)',
                    background: activeLayer === layer.id ? layer.bg : status === 'down' ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                >
                  <div className="tsdl-header">
                    <div style={{ color: status === 'down' ? '#ef4444' : layer.color }}>{layer.icon}</div>
                    <div className="tsdl-name">{lang === 'en' ? layer.nameEn : layer.nameTh}</div>
                    <div className="tsdl-port" style={{ color: layer.color }}>{layer.port}</div>
                    {status !== 'ok' && (
                      <div style={{ color: sColor, fontSize: '0.7rem', fontWeight: 700, marginLeft: 'auto' }}>
                        {status === 'down' ? '✗ DOWN' : status === 'broken' ? '⚠ BROKEN' : '⚠ PARTIAL'}
                      </div>
                    )}
                  </div>
                  <div className="tsdl-listen" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Ubuntu Mono',monospace", fontSize: '0.72rem' }}>
                    {lang === 'en' ? 'listen: ' : 'listen: '}{layer.listen}
                  </div>
                </div>
                {idx < layers.length - 1 && (
                  <div className="tsd-down-arrow" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1.2rem' }}>↓</div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {activeLayer && (() => {
          const l = layers.find(x => x.id === activeLayer);
          return (
            <div className="tsd-detail" style={{ borderColor: l.border, background: l.bg }}>
              <div style={{ color: l.color, fontWeight: 700, marginBottom: 6, fontSize: '0.88rem' }}>
                {lang === 'en' ? l.nameEn : l.nameTh}
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                {lang === 'en' ? l.descEn : l.descTh}
              </p>
            </div>
          );
        })()}

        {failedLayer && failedLayer !== 'none' && (() => {
          const msgs = {
            browser: {
              en: 'nginx is down → visitors cannot load ANY page. The API and MySQL are still running perfectly — but nobody can reach them. First question: which of the 3 failed?',
              th: 'nginx ดับ → visitor ไม่สามารถโหลดหน้าใดได้เลย API และ MySQL ยังทำงานปกติ — แต่ไม่มีใครเข้าถึงได้ คำถามแรก: server ไหนที่เสีย?',
            },
            api: {
              en: 'Node.js API is down → the form cannot submit, new students cannot register. nginx still serves the static page (Class 3). MySQL still holds all data. systemctl status + journalctl -u school-api.',
              th: 'API ดับ → กรอกฟอร์มไม่ได้ นักศึกษาใหม่ไม่สามารถลงทะเบียน nginx ยังเปิดหน้า static ได้ (Class 3) MySQL ยังเก็บข้อมูลอยู่ ตรวจ: systemctl status + journalctl -u school-api',
            },
            mysql: {
              en: 'MySQL is down → the API starts but every database call fails with a 500 error. The static page still loads. But anything involving data (GET /students, POST /students) breaks. Restart mysql first.',
              th: 'MySQL ดับ → API start แต่ทุก query ที่เกี่ยวกับ database ล้มเหลว (500 error) หน้า static ยังโหลดได้ แต่ทุกอย่างที่เกี่ยวข้องกับข้อมูลพัง restart mysql ก่อน',
            },
          };
          return (
            <div className="tsd-failure-detail">
              <AlertTriangle style={{ width: 16, height: 16, color: '#f59e0b', flexShrink: 0 }} />
              <span>{lang === 'en' ? msgs[failedLayer].en : msgs[failedLayer].th}</span>
            </div>
          );
        })()}
      </div>

      <div className="tsd-rule">
        <Info style={{ width: 14, height: 14, color: '#8FD3F4', flexShrink: 0 }} />
        <span>{lang === 'en'
          ? 'All three can be running while two cannot talk to each other. First question in any failure: which of the three?'
          : 'ทั้ง 3 อาจรันอยู่ แต่สองตัวคุยกันไม่ได้ คำถามแรกในทุกความล้มเหลว: ตัวไหนในสาม?'}</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   INTERACTIVE 2: Least Privilege Sandbox
   ═══════════════════════════════════════════════ */
const LeastPrivilegeSandbox = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';

  const [activeUser, setActiveUser] = useState('root');
  const [attemptedAction, setAttemptedAction] = useState(null);
  const [result, setResult] = useState(null);

  const users = [
    {
      id: 'root',
      labelEn: 'root (sudo mysql)',
      labelTh: 'root (sudo mysql)',
      color: '#ef4444',
      descEn: 'OS root → MySQL admin. Can do EVERYTHING in MySQL.',
      descTh: 'root ของ OS → admin ของ MySQL ทำได้ทุกอย่างใน MySQL',
    },
    {
      id: 'school',
      labelEn: 'school@localhost',
      labelTh: 'school@localhost',
      color: '#10b981',
      descEn: 'Application user. Can only touch the school database.',
      descTh: 'User ของ Application สัมผัสได้เฉพาะ database school เท่านั้น',
    },
    {
      id: 'sysadmin',
      labelEn: 'sysadmin (no sudo)',
      labelTh: 'sysadmin (no sudo)',
      color: '#6b7280',
      descEn: 'Linux user, not a MySQL user at all.',
      descTh: 'Linux user ไม่ใช่ MySQL user เลย',
    },
  ];

  const actions = [
    {
      id: 'select_school',
      cmdEn: 'SELECT * FROM school.students',
      cmdTh: 'SELECT * FROM school.students',
      access: { root: true, school: true, sysadmin: false },
      resultEn: { root: '3 rows returned ✓', school: '3 rows returned ✓', sysadmin: 'ERROR 1045: Access denied' },
      resultTh: { root: 'คืน 3 แถว ✓', school: 'คืน 3 แถว ✓', sysadmin: 'ERROR 1045: Access denied' },
    },
    {
      id: 'create_db',
      cmdEn: 'CREATE DATABASE hacked',
      cmdTh: 'CREATE DATABASE hacked',
      access: { root: true, school: false, sysadmin: false },
      resultEn: { root: 'Database created ✓', school: 'ERROR 1044: Access denied for school@localhost to database hacked', sysadmin: 'ERROR 1045: Access denied' },
      resultTh: { root: 'สร้าง Database สำเร็จ ✓', school: 'ERROR 1044: Access denied — school@localhost เข้า hacked ไม่ได้', sysadmin: 'ERROR 1045: Access denied' },
    },
    {
      id: 'drop_mysql',
      cmdEn: 'DROP DATABASE mysql',
      cmdTh: 'DROP DATABASE mysql',
      access: { root: true, school: false, sysadmin: false },
      resultEn: { root: `⚠ Dropped! Server's own accounts database deleted. Total destruction.`, school: 'ERROR 1044: Access denied — cannot touch mysql database', sysadmin: 'ERROR 1045: Access denied' },
      resultTh: { root: '⚠ ลบแล้ว! Database บัญชีของ Server ถูกลบ ความเสียหายทั้งหมด', school: 'ERROR 1044: Access denied — แตะ mysql database ไม่ได้', sysadmin: 'ERROR 1045: Access denied' },
    },
    {
      id: 'show_grants',
      cmdEn: 'SHOW DATABASES',
      cmdTh: 'SHOW DATABASES',
      access: { root: true, school: true, sysadmin: false },
      resultEn: {
        root: 'information_schema\nmysql\nperformance_schema\nschool\nsys',
        school: 'information_schema\nperformance_schema\nschool',
        sysadmin: 'ERROR 1045: Access denied',
      },
      resultTh: {
        root: 'information_schema\nmysql\nperformance_schema\nschool\nsys',
        school: 'information_schema\nperformance_schema\nschool',
        sysadmin: 'ERROR 1045: Access denied',
      },
    },
  ];

  const runAction = (action) => {
    setAttemptedAction(action.id);
    setResult({
      allowed: action.access[activeUser],
      text: lang === 'en' ? action.resultEn[activeUser] : action.resultTh[activeUser],
      isDestruction: action.id === 'drop_mysql',
    });
  };

  const currentUser = users.find(u => u.id === activeUser);

  return (
    <div className="lps-wrap">
      <div className="lps-topbar">
        <div className="lps-title">
          <Shield style={{ color: 'var(--orange)', width: 18, height: 18 }} />
          <span>{lang === 'en' ? 'Least Privilege Sandbox' : 'ทดสอบ Least Privilege'}</span>
        </div>
      </div>

      <div className="lps-body">
        <div className="lps-left">
          <div className="lps-section-label">{lang === 'en' ? 'Connect as:' : 'เชื่อมต่อในฐานะ:'}</div>
          {users.map(u => (
            <button
              key={u.id}
              className={`lps-user-btn ${activeUser === u.id ? 'active' : ''}`}
              style={activeUser === u.id ? { borderColor: u.color, background: `${u.color}22` } : {}}
              onClick={() => { setActiveUser(u.id); setResult(null); setAttemptedAction(null); }}
            >
              <Key style={{ width: 14, height: 14, color: activeUser === u.id ? u.color : 'rgba(255,255,255,0.4)' }} />
              <span>{lang === 'en' ? u.labelEn : u.labelTh}</span>
            </button>
          ))}
          {currentUser && (
            <div className="lps-user-desc" style={{ borderColor: `${currentUser.color}44`, background: `${currentUser.color}11`, color: 'rgba(255,255,255,0.75)' }}>
              {lang === 'en' ? currentUser.descEn : currentUser.descTh}
            </div>
          )}
        </div>

        <div className="lps-right">
          <div className="lps-section-label">{lang === 'en' ? 'Try a SQL command:' : 'ลองรันคำสั่ง SQL:'}</div>
          <div className="lps-actions">
            {actions.map(action => (
              <button
                key={action.id}
                className={`lps-action-btn ${attemptedAction === action.id ? 'selected' : ''} ${action.id === 'drop_mysql' ? 'danger' : ''}`}
                onClick={() => runAction(action)}
              >
                <Code style={{ width: 13, height: 13 }} />
                {lang === 'en' ? action.cmdEn : action.cmdTh}
              </button>
            ))}
          </div>

          {result && (
            <div className={`lps-result ${result.isDestruction && result.allowed ? 'destruction' : result.allowed ? 'allowed' : 'denied'}`}>
              <div className="lps-result-header">
                {result.allowed
                  ? <CheckCircle style={{ width: 16, height: 16 }} />
                  : <XCircle style={{ width: 16, height: 16 }} />}
                <strong>{result.allowed ? (lang === 'en' ? 'Executed' : 'สำเร็จ') : (lang === 'en' ? 'Access Denied' : 'ถูกปฏิเสธ')}</strong>
              </div>
              <pre className="lps-result-text">{result.text}</pre>
              {result.isDestruction && result.allowed && (
                <div className="lps-blast-radius">
                  <AlertTriangle style={{ width: 14, height: 14 }} />
                  {lang === 'en'
                    ? 'This is why the application user must NEVER be root. A break-in as root hands over every database on the server.'
                    : 'นี่คือเหตุผลที่ application user ห้ามเป็น root — การบุกรุกในฐานะ root ทำให้ทุก database ในเครื่องตกเป็นของคนร้าย'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   INTERACTIVE 3: URL Percent-Encoding Lab
   ═══════════════════════════════════════════════ */
const PercentEncodingLab = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';

  const [password, setPassword] = useState('p@ss:w/rd');
  const [encoded, setEncoded] = useState('');
  const [showUrl, setShowUrl] = useState(false);

  const encode = (raw) => {
    return raw.replace(/[^A-Za-z0-9\-_.~]/g, c => {
      const hex = c.charCodeAt(0).toString(16).toUpperCase();
      return '%' + (hex.length === 1 ? '0' + hex : hex);
    });
  };

  const handleEncode = () => {
    setEncoded(encode(password));
    setShowUrl(true);
  };

  const presets = ['p@ss:w/rd', 'abc%xyz123', 'hello@world/test', 'safe123password'];

  const specialChars = [
    { char: '/', effectEn: 'Ends the address. DB name becomes wrong.', effectTh: 'ตัดจบ address — database name ผิด', encoded: '%2F', danger: true },
    { char: '%', effectEn: 'Starts an escape. Silently decodes wrong. You get Access denied with no URL error.', effectTh: 'เริ่ม escape — decode ผิดเงียบๆ ได้ Access denied โดยไม่มี URL error', encoded: '%25', danger: true },
    { char: '@', effectEn: 'Ends the password (usually safe in this library, but risky with others).', effectTh: 'ตัดจบ password (อาจปลอดภัยใน library นี้ แต่เสี่ยงกับ library อื่น)', encoded: '%40', danger: false },
    { char: ':', effectEn: 'Ends the username (usually safe in this library, splits at first : in password).', effectTh: 'ตัดจบ username (อาจปลอดภัยใน library นี้)', encoded: '%3A', danger: false },
  ];

  const rawUrl = `mysql://school:${password}@127.0.0.1:3306/school`;
  const encodedUrl = `mysql://school:${encode(password)}@127.0.0.1:3306/school`;

  return (
    <div className="pel-wrap">
      <div className="pel-topbar">
        <div className="pel-title">
          <Link style={{ color: 'var(--orange)', width: 18, height: 18 }} />
          <span>{lang === 'en' ? 'URL Percent-Encoding Lab' : 'ทดลอง Percent-Encoding'}</span>
        </div>
      </div>

      <div className="pel-body">
        <div className="pel-left">
          <div className="pel-section-label">{lang === 'en' ? 'Special chars in a URL password:' : 'ตัวอักษรพิเศษใน URL password:'}</div>
          <div className="pel-chars">
            {specialChars.map(sc => (
              <div key={sc.char} className={`pel-char-row ${sc.danger ? 'danger' : 'warn'}`}>
                <div className="pel-char-badge" style={{ color: sc.danger ? '#ef4444' : '#f59e0b' }}>
                  <code>{sc.char}</code>
                  <span>→</span>
                  <code style={{ color: '#10b981' }}>{sc.encoded}</code>
                </div>
                <div className="pel-char-effect">{lang === 'en' ? sc.effectEn : sc.effectTh}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pel-right">
          <div className="pel-section-label">{lang === 'en' ? 'Try encoding a password:' : 'ลอง encode password:'}</div>
          <div className="pel-presets">
            {presets.map(p => (
              <button key={p} className="pel-preset-btn" onClick={() => { setPassword(p); setEncoded(''); setShowUrl(false); }}>
                {p}
              </button>
            ))}
          </div>
          <input
            className="pel-input"
            value={password}
            onChange={e => { setPassword(e.target.value); setEncoded(''); setShowUrl(false); }}
            placeholder={lang === 'en' ? 'Type a password...' : 'พิมพ์ password...'}
          />
          <button className="pel-encode-btn" onClick={handleEncode}>
            <Play style={{ width: 14, height: 14 }} />
            {lang === 'en' ? 'Percent-Encode it' : 'Encode ด้วย %'}
          </button>

          {encoded && (
            <div className="pel-result">
              <div className="pel-result-row">
                <span className="pel-label">{lang === 'en' ? 'Raw:' : 'ดิบ:'}</span>
                <code className="pel-raw">{password}</code>
              </div>
              <div className="pel-result-row">
                <span className="pel-label">{lang === 'en' ? 'Encoded:' : 'Encoded:'}</span>
                <code className="pel-encoded">{encoded}</code>
              </div>
            </div>
          )}

          {showUrl && (
            <div className="pel-url-compare">
              <div className="pel-url-label">{lang === 'en' ? 'In DATABASE_URL:' : 'ใน DATABASE_URL:'}</div>
              <div className="pel-url-bad">
                <span className="pel-url-badge bad">{lang === 'en' ? 'Before' : 'ก่อน'}</span>
                <code className="pel-url-code">{rawUrl}</code>
              </div>
              <div className="pel-url-good">
                <span className="pel-url-badge good">{lang === 'en' ? 'After' : 'หลัง'}</span>
                <code className="pel-url-code">{encodedUrl}</code>
              </div>
              <div className="pel-warning">
                <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0, color: '#f59e0b' }} />
                <span>{lang === 'en'
                  ? 'Encode ONCE. If you encode an already-encoded password, %40 becomes %2540 — a wrong password, no error message that says so.'
                  : 'Encode แค่ครั้งเดียว! ถ้า encode ซ้ำ %40 จะกลายเป็น %2540 — password ผิด แต่ไม่มี error บอก ได้แค่ Access denied'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN CLASS 4 PAGE
   ═══════════════════════════════════════════════ */
const Class4 = React.memo(() => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const mainRef = useRef(null);
  const [quizContainer, setQuizContainer] = useState(null);

  useEffect(() => {
    if (!mainRef.current) return;
    setQuizContainer(mainRef.current.querySelector('#quizContainer4'));

    const terms = mainRef.current.querySelectorAll('.term');
    mainRef.current.querySelectorAll('.term-pop-injected').forEach(el => el.remove());
    const handlers = [];

    terms.forEach(term => {
      const def = term.getAttribute('data-def');
      if (!def) return;
      const popup = document.createElement('div');
      popup.className = 'term-pop term-pop-injected';
      popup.innerHTML = def;
      term.appendChild(popup);

      const enter = () => {
        term.classList.add('open');
        gsap.killTweensOf(popup);
        gsap.fromTo(popup, { opacity: 0, scale: 0.9, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' });
      };
      const leave = () => {
        gsap.killTweensOf(popup);
        gsap.to(popup, { opacity: 0, scale: 0.95, y: 10, duration: 0.2, ease: 'power2.in', onComplete: () => term.classList.remove('open') });
      };
      term.addEventListener('mouseenter', enter);
      term.addEventListener('mouseleave', leave);
      handlers.push(() => {
        term.removeEventListener('mouseenter', enter);
        term.removeEventListener('mouseleave', leave);
      });
    });

    return () => handlers.forEach(h => h());
  }, [lang]);

  return (
    <main ref={mainRef}>
      {quizContainer && createPortal(<Quiz4 />, quizContainer)}

      {/* ── HERO ── */}
      <div className="hero">
        <span className="eyebrow-badge">Class 4 · Deploy Backend and DBMS</span>
        <h1>
          {lang === 'en'
            ? 'A Database Is a Server — Not a File Your App Opens'
            : 'Database คือ Server — ไม่ใช่ไฟล์ที่ app เปิด'}
        </h1>
        <p className="lede">
          {lang === 'en'
            ? 'Today you add memory. Class 3 gave you a web page. This class gives it the ability to remember. And what gets remembered outlives the program that accepted it.'
            : 'วันนี้คุณเพิ่ม "ความทรงจำ" ให้กับระบบ Class 3 ให้เว็บเพจ Class นี้ให้ความสามารถในการจดจำ และสิ่งที่ถูกจดจำจะอยู่ยาวนานกว่าโปรแกรมที่รับมัน'}
        </p>
        <div className="hero-chips">
          <a className="hero-chip" href="#architecture"><Layers style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Architecture' : 'Architecture'}</a>
          <a className="hero-chip" href="#database"><Database style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'MySQL Setup' : 'ติดตั้ง MySQL'}</a>
          <a className="hero-chip" href="#privilege"><Shield style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Least Privilege' : 'Least Privilege'}</a>
          <a className="hero-chip" href="#app"><Server style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Node.js App' : 'Node.js App'}</a>
          <a className="hero-chip" href="#service"><Settings style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'systemd Service' : 'systemd Service'}</a>
          <a className="hero-chip" href="#quiz"><CheckCircle style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Self-Test' : 'ทดสอบตัวเอง'}</a>
        </div>
      </div>

      {/* ── SECTION 0: COURSE MAP ── */}
      <section className="lesson" id="intro">
        <div className="section-kicker"><span className="num">00</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Where Are We?' : 'เราอยู่ตรงไหนในวิชานี้?'}</h2>
        <p>
          {lang === 'en'
            ? 'Class 3 gave you a web server that hands out files. Today you add the program that accepts input, and the database that stores it permanently. Nothing today is a new idea — it is Class 1\'s packages and Class 2\'s services, pointed at something real.'
            : 'Class 3 ให้เว็บเซิร์ฟเวอร์ที่ส่งไฟล์ วันนี้คุณเพิ่มโปรแกรมที่รับ input และ database ที่เก็บข้อมูลถาวร ไม่มีอะไรที่เป็นแนวคิดใหม่ — มันคือ Package ของ Class 1 และ Service ของ Class 2 แต่ใช้กับสิ่งที่จริงจัง'}
        </p>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
          {[
            { num: 1, label: lang === 'en' ? 'Packages & Services' : 'Packages & Services', done: true },
            { num: 2, label: lang === 'en' ? 'Processes & Signals' : 'Processes & Signals', done: true },
            { num: 3, label: lang === 'en' ? 'Static Web (nginx)' : 'Static Web (nginx)', done: true },
            { num: 4, label: lang === 'en' ? 'Backend + DB' : 'Backend + DB', current: true },
            { num: 5, label: lang === 'en' ? 'Integrate + HTTPS' : 'Integrate + HTTPS', future: true },
          ].map(c => (
            <div key={c.num} className={`compare-card ${c.current ? 'current-week' : ''}`}>
              <h4 style={{ fontSize: '0.8rem' }}>
                {c.done ? <CheckCircle2 style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> : null}
                {c.current ? <Zap style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: 'var(--orange)' }} /> : null}
                Class {c.num}
              </h4>
              <p style={{ fontSize: '0.75rem' }}>{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 1: ARCHITECTURE ── */}
      <section className="lesson" id="architecture">
        <div className="section-kicker"><span className="num">01</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'Three Servers on One Machine' : '3 Server บนเครื่องเดียว'}
        </h2>
        <p>
          {lang === 'en'
            ? 'You are running three separate programs, each with its own port, its own users, and its own idea of who you are. Being sysadmin on Linux makes you nobody in particular to MySQL.'
            : 'คุณรัน 3 โปรแกรมแยกกัน แต่ละตัวมี port ของตัวเอง users ของตัวเอง และความเข้าใจเรื่อง "ตัวตน" ของตัวเอง การเป็น sysadmin บน Linux ไม่ได้หมายความว่าคุณเป็นใครก็ได้ใน MySQL'}
        </p>

        <h3 className="sub-title">{lang === 'en' ? 'Interactive: Click any layer to learn more' : 'Interactive: กดที่ layer ใดก็ได้เพื่อเรียนรู้'}</h3>
        <ThreeServerDiagram />

        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          <strong>
            {lang === 'en'
              ? 'All three can be running perfectly while two of them cannot talk to each other.'
              : 'ทั้ง 3 อาจรันอยู่อย่างสมบูรณ์แบบ แต่สองตัวก็ยังอาจคุยกันไม่ได้'}
          </strong>
          {lang === 'en'
            ? ' The first question in any failure is always: which of the three?'
            : ' คำถามแรกในทุกความล้มเหลวคือ: ตัวไหนในสาม?'}
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'The Address Column — Who Can Reach What' : 'คอลัมน์ Address — ใครเข้าถึงอะไรได้'}</h3>
        <p>
          {lang === 'en'
            ? 'Run `ss -tln` and you see two kinds of addresses. This one column decides everything about who can connect.'
            : 'รัน `ss -tln` และคุณจะเห็นสองชนิดของ address คอลัมน์เดียวนี้กำหนดทุกอย่างว่าใครเชื่อมต่อได้'}
        </p>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">ss -tln</span></span>
          <span className="ln t-out">State  Recv-Q Send-Q  Local Address:Port</span>
          <span className="ln t-out"><span style={{color:'#e95420'}}>LISTEN</span> 0   511      <span className="term" data-def="0.0.0.0 = ทุก network interface — ทุกคนที่เชื่อมต่อถึงเครื่องนี้เข้าถึงพอร์ตนี้ได้">0.0.0.0</span>:80     ← nginx, the world</span>
          <span className="ln t-out"><span style={{color:'#e95420'}}>LISTEN</span> 0   100      <span className="term" data-def="0.0.0.0 = ทุก interface — ทุกคนเข้าถึงได้ต้อง open firewall ด้วย">0.0.0.0</span>:3042   ← your API port</span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>LISTEN</span> 0   151      <span className="term" data-def="127.0.0.1 = loopback = เฉพาะเครื่องนี้ packet ไม่แตะ network card เลย firewall ไม่เกี่ยว">127.0.0.1</span>:3306   ← MySQL, this machine ONLY</span>
          <span className="ln t-comment"> ↑ 0.0.0.0 = world can try.  127.0.0.1 = this machine only, no firewall needed</span>
        </Terminal>

        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="compare-card">
            <h4><Globe style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#e95420' }} />0.0.0.0</h4>
            <p>{lang === 'en' ? 'Every network address this machine has — including the one the internet reaches. Needs a firewall rule to let traffic in.' : 'ทุก network address ที่เครื่องนี้มี — รวมถึง address ที่อินเทอร์เน็ตเข้าถึงได้ ต้องมี {<span className="term" data-def="กฎของ Firewall ที่กำหนดว่าอนุญาตหรือปฏิเสธ traffic แบบใด (เช่น เปิดพอร์ต 80)">firewall rule</span>}'}</p>
          </div>
          <div className="compare-card" style={{ borderColor: 'rgba(16,185,129,0.35)' }}>
            <h4><Lock style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#10b981' }} />127.0.0.1</h4>
            <p>{lang === 'en' ? 'Loopback only — this machine and nothing else. Packets NEVER touch a network card. No firewall rule needed. MySQL is here by default for security.' : '{<span className="term" data-def="127.0.0.1 หรือ localhost เครือข่ายจำลองที่ใช้สื่อสารกันเองภายในเครื่อง">Loopback</span>} เท่านั้น — เครื่องนี้และไม่มีอะไรอื่น Packet ไม่แตะ {<span className="term" data-def="อุปกรณ์ที่ใช้เชื่อมต่อคอมพิวเตอร์เข้ากับเครือข่ายภายนอก">network card</span>} เลย ไม่ต้องมี firewall rule MySQL อยู่ที่นี่ by default เพื่อความปลอดภัย'}</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: DATABASE SETUP ── */}
      <section className="lesson" id="database">
        <div className="section-kicker"><span className="num">02</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'MySQL — Installing a Separate Server' : 'MySQL — ติดตั้ง Server แยกต่างหาก'}
        </h2>
        <p>
          {lang === 'en'
            ? 'A database is not a file your program opens. It is a separate program, with its own process, its own port, and its own users. Your app is just one of its clients.'
            : 'Database ไม่ใช่ไฟล์ที่โปรแกรมคุณเปิด แต่มันคือโปรแกรมแยกต่างหาก มี process เป็นของตัวเอง port เป็นของตัวเอง และ users เป็นของตัวเอง App ของคุณเป็นเพียงหนึ่งใน client ของมัน'}
        </p>

        <div className="callout">
          <strong>{lang === 'en' ? 'Predict before you install:' : 'ทำนายก่อนติดตั้ง:'}</strong>
          {lang === 'en'
            ? ' Class 3\'s nginx was installed, auto-enabled, but stayed INACTIVE. Will MySQL do the same? Run the check and find out.'
            : ' nginx ของ Class 3 ถูกติดตั้ง auto-enabled แต่ยังคง INACTIVE อยู่ MySQL จะเหมือนกันไหม? รันตรวจสอบแล้วหาคำตอบ'}
        </div>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo apt install mysql-server</span></span>
          <span className="ln t-out">Reading package lists... Done</span>
          <span className="ln t-out">The following NEW packages will be installed: mysql-server</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">systemctl is-enabled mysql; systemctl is-active mysql</span></span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>enabled</span>   ← auto-enables itself</span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>active</span>    ← AND auto-starts! Different from nginx.org</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo mysql -e "SELECT VERSION();"</span></span>
          <span className="ln t-out">+---------------------------+</span>
          <span className="ln t-out">| VERSION()                 |</span>
          <span className="ln t-out">+---------------------------+</span>
          <span className="ln t-out">| <span style={{color:'#10b981'}}>8.0.46</span>-0ubuntu0.24.04.3 |  ← must be 8.x</span>
          <span className="ln t-out">+---------------------------+</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">mysql -e "SELECT 1;"</span></span>
          <span className="ln t-out" style={{color:'#f87171'}}>ERROR 1045 (28000): Access denied for user 'sysadmin'@'localhost'</span>
          <span className="ln t-comment"> ↑ sudo mysql = root auth. mysql (no sudo) = sysadmin is not a MySQL user</span>
        </Terminal>

        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="compare-card">
            <h4><CheckCircle style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#10b981' }} />sudo mysql</h4>
            <p>{lang === 'en' ? 'Works with no password. You\'re root on Linux, MySQL trusts that. This is the unix_socket auth plugin — OS identity IS the credential.' : 'ทำงานได้โดยไม่ต้องใช้ password เพราะคุณเป็น root บน Linux MySQL เชื่อถือนั้น นี่คือ {<span className="term" data-def="ปลั๊กอินตรวจสอบสิทธิ์ของ MySQL ที่ใช้ตัวตนระดับ OS แทนรหัสผ่าน">unix_socket auth plugin</span>} — ตัวตนของ OS คือ credential'}</p>
          </div>
          <div className="compare-card" style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
            <h4><XCircle style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#ef4444' }} />mysql (no sudo)</h4>
            <p>{lang === 'en' ? 'ERROR 1045 — "sysadmin" is not a MySQL user. This is WHY your app needs its own MySQL user with a real password.' : 'ERROR 1045 — "sysadmin" ไม่ใช่ MySQL user นั่นคือเหตุผลที่ app ของคุณต้องมี MySQL user ของตัวเองพร้อม password จริงๆ'}</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: LEAST PRIVILEGE ── */}
      <section className="lesson" id="privilege">
        <div className="section-kicker"><span className="num">03</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'One User, One Database — Least Privilege' : 'หนึ่ง User หนึ่ง Database — Least Privilege'}
        </h2>
        <p>
          {lang === 'en'
            ? 'This is not politeness. An application that can only touch its own data cannot destroy anything else when it is wrong — or when somebody else is driving it.'
            : 'นี่ไม่ใช่แค่ความสุภาพ Application ที่สัมผัสได้เฉพาะข้อมูลของตัวเองไม่สามารถทำลายสิ่งอื่นได้ แม้จะมีข้อผิดพลาด — หรือเมื่อมีคนอื่นควบคุมมัน'}
        </p>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln t-comment">-- Three scripts, read them BEFORE you run them</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">ls /srv/school/db/</span></span>
          <span className="ln t-out">schema.sql  seed.sql  <span style={{color:'var(--orange)'}}>setup.sql</span></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo mysql {'<'} /srv/school/db/setup.sql</span></span>
          <span className="ln t-out">user      host       generated password</span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>school    localhost  Xk9mP3qL7wNv5rBz4hYa</span>  ← shown ONCE</span>
          <span className="ln t-comment"> ↑ RANDOM PASSWORD — 20 chars. Copy it NOW. Server can't show it again.</span>
        </Terminal>

        <div className="callout">
          <strong>{lang === 'en' ? 'What setup.sql does in 3 lines:' : 'setup.sql ทำอะไรใน 3 บรรทัด:'}</strong>
          <div className="tbl-wrap" style={{ marginTop: 10 }}>
            <table>
              <tbody>
                <tr><th>SQL</th><th>{lang === 'en' ? 'Effect' : 'ผล'}</th></tr>
                <tr><td><code>CREATE DATABASE school CHARACTER SET utf8mb4</code></td><td>{lang === 'en' ? 'Make a database that can store Thai + emoji (utf8mb4 ≠ utf8!)' : 'สร้าง database ที่เก็บภาษาไทย + emoji ได้ (utf8mb4 ≠ utf8!)'}</td></tr>
                <tr><td><code>CREATE USER 'school'@'localhost' IDENTIFIED BY RANDOM PASSWORD</code></td><td>{lang === 'en' ? 'Make a user, let server choose the password. school@localhost ≠ school@otherhost' : 'สร้าง user ให้ server เลือก password. school@localhost ≠ school@otherhost'}</td></tr>
                <tr><td><code>GRANT ALL PRIVILEGES ON school.* TO 'school'@'localhost'</code></td><td>{lang === 'en' ? 'Full access to school database ONLY. Cannot touch mysql, sys, or other DBs.' : 'สิทธิ์เต็มในเฉพาะ database school แตะ mysql, sys หรือ DB อื่นไม่ได้'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Interactive: See what each user can actually do' : 'Interactive: ดูว่า user แต่ละคนทำอะไรได้จริงๆ'}</h3>
        <LeastPrivilegeSandbox />

        <h3 className="sub-title">{lang === 'en' ? 'Storing the Credential Safely' : 'เก็บ Credential อย่างปลอดภัย'}</h3>
        <p>
          {lang === 'en'
            ? 'The generated password goes into exactly one file. Mode 600 BEFORE you write the password — not after.'
            : 'Password ที่ generate ออกมาไปอยู่ในไฟล์เดียวเท่านั้น ตั้ง mode 600 ก่อนเขียน password — ไม่ใช่หลัง'}
        </p>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">install -m 600 /dev/null /srv/school/db/school.env</span></span>
          <span className="ln t-comment"> ↑ Creates empty file at mode 600 ATOMICALLY. No window where password is exposed.</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">nano /srv/school/db/school.env</span></span>
          <span className="ln t-out"><span style={{color:'#f59e0b'}}>SCHOOL_USER=school</span></span>
          <span className="ln t-out"><span style={{color:'#f59e0b'}}>SCHOOL_DATABASE=school</span></span>
          <span className="ln t-out"><span style={{color:'#f59e0b'}}>SCHOOL_PASSWORD='Xk9mP3qL7wNv5rBz4hYa'</span>  ← single quotes = safe for special chars</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">ls -l /srv/school/db/school.env</span></span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>-rw-------</span> 1 sysadmin sysadmin 81 Aug 26 14:05 school.env</span>
          <span className="ln t-comment"> ↑ 600 = owner read/write only. Nobody else on this machine can read it.</span>
        </Terminal>

        <h3 className="sub-title">{lang === 'en' ? 'Load the Schema and Seed Data' : 'โหลด Schema และข้อมูลเริ่มต้น'}</h3>
        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          {lang === 'en'
            ? 'Two files because they are two different jobs. schema.sql = the SHAPE (table structure). seed.sql = the CONTENTS (initial rows). seed.sql starts with a DELETE — safe now, dangerous on a live database.'
            : 'สองไฟล์เพราะคนละหน้าที่ schema.sql = รูปแบบ (โครงสร้างตาราง). seed.sql = เนื้อหา (แถวเริ่มต้น). seed.sql เริ่มด้วย DELETE — ปลอดภัยตอนนี้ อันตรายบน database จริง'}
        </div>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">set -a; . /srv/school/db/school.env; set +a</span></span>
          <span className="ln t-comment"> ↑ Load env vars into THIS shell. set -a exports everything. set +a stops that.</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">MYSQL_PWD="$SCHOOL_PASSWORD" mysql -u "$SCHOOL_USER" "$SCHOOL_DATABASE" -e "source /srv/school/db/schema.sql"</span></span>
          <span className="ln t-comment"> ↑ MYSQL_PWD= is a PREFIX ASSIGNMENT — password goes to this command ONLY, not your shell</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">MYSQL_PWD="$SCHOOL_PASSWORD" mysql -u "$SCHOOL_USER" "$SCHOOL_DATABASE" -e "source /srv/school/db/seed.sql"</span></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">MYSQL_PWD="$SCHOOL_PASSWORD" mysql -u "$SCHOOL_USER" "$SCHOOL_DATABASE" -e "SELECT * FROM students;"</span></span>
          <span className="ln t-out">+-------------+-----------+-----------+-------+</span>
          <span className="ln t-out">| studentId   | firstName | lastName  | major |</span>
          <span className="ln t-out">+-------------+-----------+-----------+-------+</span>
          <span className="ln t-out">| 68130500035 | Teeruch   | Songtalay | IT    |</span>
          <span className="ln t-out">+-------------+-----------+-----------+-------+</span>
        </Terminal>
      </section>

      {/* ── SECTION 4: APPLICATION SETUP ── */}
      <section className="lesson" id="app">
        <div className="section-kicker"><span className="num">04</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'The Application — Dependencies, Config, and Schema Check' : 'Application — Dependencies, Config, และการตรวจสอบ Schema'}
        </h2>
        <p>
          {lang === 'en'
            ? 'Deploying a program is not just copying files. It arrives with a list of things it needs and a description of the tables it expects, and it will not run until both are dealt with.'
            : 'การ deploy โปรแกรมไม่ใช่แค่การ copy ไฟล์ มันมาพร้อมกับรายการสิ่งที่ต้องการและคำอธิบายตารางที่คาดหวัง และจะไม่รันจนกว่าทั้งสองอย่างจะถูกจัดการ'}
        </p>

        <h3 className="sub-title">{lang === 'en' ? 'npm ci vs npm install — A Critical Difference' : 'npm ci vs npm install — ความแตกต่างที่สำคัญมาก'}</h3>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="compare-card" style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
            <h4><Package style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#ef4444' }} />{<span className="term" data-def="ติดตั้ง packages ตาม package.json (อาจได้เวอร์ชันใหม่กว่าที่เคยใช้ตอนทดสอบ)">npm install</span>}</h4>
            <p>{lang === 'en' ? 'Installs and may QUIETLY UPDATE packages. You might get newer versions nobody tested. Your deployment drifts from what was tested.' : 'ติดตั้งและอาจ UPDATE package เงียบๆ อาจได้รับ version ใหม่ที่ไม่มีใครทดสอบ deployment ของคุณเบี่ยงเบนจากสิ่งที่ถูกทดสอบ'}</p>
          </div>
          <div className="compare-card" style={{ borderColor: 'rgba(16,185,129,0.35)' }}>
            <h4><CheckCircle style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#10b981' }} />npm ci</h4>
            <p>{lang === 'en' ? 'Installs EXACTLY as recorded in package-lock.json. Refuses to guess. Requires package-lock.json to exist. This is the deployment command.' : 'ติดตั้งตาม {<span className="term" data-def="ไฟล์ที่ล็อกเวอร์ชันที่แน่นอนของทุก package ที่ติดตั้ง (รับประกันว่าติดตั้งใหม่จะได้ของเหมือนเดิม)">package-lock.json</span>} เป๊ะๆ ปฏิเสธการเดา ต้องมีไฟล์นี้อยู่ นี่คือคำสั่งสำหรับ deployment'}</p>
          </div>
        </div>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">cd /srv/school/backend && npm ci</span></span>
          <span className="ln t-out">added 105 packages in 6s  ← exact versions from package-lock.json</span>
          <span className="ln t-comment"> ↑ ~105 packages total. Most you never asked for — they're deps of your deps.</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">rm package-lock.json && npm ci</span></span>
          <span className="ln t-out" style={{color:'#f87171'}}>npm error code EUSAGE</span>
          <span className="ln t-out" style={{color:'#f87171'}}>npm error The `npm ci` command can only install with an existing package-lock.json</span>
          <span className="ln t-comment"> ↑ This is why package-lock.json is committed alongside the code</span>
        </Terminal>

        <h3 className="sub-title">{lang === 'en' ? 'The .env File — One Nasty Trap' : 'ไฟล์ .env — กับดักที่แสบที่สุด'}</h3>
        <p>
          {lang === 'en'
            ? 'Two programs read this file and they do NOT agree about variable expansion. This is one of the nastiest bugs in deployment — it works every way you test it, and fails the one way the app is actually run.'
            : 'สองโปรแกรมอ่านไฟล์นี้และ ไม่เห็นด้วยกัน เรื่อง variable expansion นี่คือ bug ที่แสบที่สุดใน deployment — ทำงานได้ทุกวิธีที่คุณทดสอบ และล้มเหลวในวิธีเดียวที่ app รันจริงๆ'}
        </p>
        <div className="tbl-wrap">
          <table>
            <tbody>
              <tr><th>{lang === 'en' ? 'Who reads .env' : 'ใครอ่าน .env'}</th><th>{lang === 'en' ? 'Expands ${VAR}?' : 'Expand ${VAR} ไหม?'}</th></tr>
              <tr>
                <td>Prisma CLI (<code>npx prisma ...</code>)</td>
                <td style={{ color: '#10b981' }}>{lang === 'en' ? 'YES — expands ${SCHOOL_PASSWORD}' : 'ใช่ — expand ${SCHOOL_PASSWORD} ได้'}</td>
              </tr>
              <tr>
                <td>systemd (<code>EnvironmentFile=</code>)</td>
                <td style={{ color: '#ef4444' }}>{lang === 'en' ? 'NO — passes literal "${SCHOOL_PASSWORD}" to the app' : 'ไม่ — ส่งตัวอักษร "${SCHOOL_PASSWORD}" ให้ app ตรงๆ'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          <strong>{lang === 'en' ? 'Put the actual password value in .env, not a variable reference.' : 'ใส่ค่า password จริงๆ ใน .env ไม่ใช่การ reference variable'}</strong>
          {lang === 'en'
            ? ' DATABASE_URL="mysql://school:${SCHOOL_PASSWORD}@..." → This works with Prisma CLI but FAILS when systemd runs the app.'
            : ' DATABASE_URL="mysql://school:${SCHOOL_PASSWORD}@..." → ใช้ได้กับ Prisma CLI แต่ FAIL เมื่อ systemd รัน app'}
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'URL Percent-Encoding — The Character That Breaks 1 in 5' : 'URL Percent-Encoding — ตัวอักษรที่ทำลาย 1 ใน 5'}</h3>
        <p>
          {lang === 'en'
            ? 'Your password sits inside a URL. URLs have grammar — some characters end the host, end the password, or start escape sequences. A generated password has a 1-in-5 chance of containing a `/` that silently breaks it.'
            : 'Password ของคุณอยู่ข้างใน URL และ URL มีไวยากรณ์ — ตัวอักษรบางตัวจบ host จบ password หรือเริ่ม escape sequence password แบบสุ่มมีโอกาส 1 ใน 5 ที่จะมี `/` ที่ทำลายมันเงียบๆ'}
        </p>
        <PercentEncodingLab />
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginTop: 16 }}>
          <div className="compare-card" style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
            <h4><XCircle style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#ef4444' }} />{lang === 'en' ? 'Wrong — always' : 'ผิด — ทุกครั้ง'}</h4>
            <pre style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: 6, margin: 0 }}>DATABASE_URL="mysql://school:p@ss:w/rd@127.0.0.1:3306/school"</pre>
          </div>
          <div className="compare-card" style={{ borderColor: 'rgba(16,185,129,0.35)' }}>
            <h4><CheckCircle style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#10b981' }} />{lang === 'en' ? 'Correct — always' : 'ถูก — ทุกครั้ง'}</h4>
            <pre style={{ fontSize: '0.72rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: 6, margin: 0 }}>DATABASE_URL="mysql://school:p%40ss%3Aw%2Frd@127.0.0.1:3306/school"</pre>
          </div>
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Prisma: Check Schema Alignment (Not Migrate Dev!)' : 'Prisma: ตรวจ Schema ว่าตรงกัน (ไม่ใช่ migrate dev!)'}</h3>
        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          <strong>{lang === 'en' ? 'DO NOT run `npx prisma migrate dev` in deployment.' : 'อย่ารัน `npx prisma migrate dev` ใน deployment'}</strong>
          {lang === 'en'
            ? ' That\'s a DEVELOPER\'s command — it tries to create a shadow database, which your least-privilege user cannot do (correctly). Use migrate diff instead.'
            : ' นั่นคือคำสั่งของ DEVELOPER — มันพยายามสร้าง shadow database ซึ่ง user ที่มีสิทธิ์น้อยของคุณทำไม่ได้ (ถูกต้องแล้ว) ใช้ migrate diff แทน'}
        </div>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">npx prisma migrate dev --name init</span></span>
          <span className="ln t-out" style={{color:'#f87171'}}>Error: Prisma Migrate could not create the shadow database.</span>
          <span className="ln t-out" style={{color:'#f87171'}}>User was denied access on the database `prisma_migrate_shadow_db_...`</span>
          <span className="ln t-comment"> ↑ This is your least-privilege grant working correctly. Do NOT fix it with more grants.</span>
          <span className="ln"></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">npx prisma migrate diff \</span></span>
          <span className="ln"><span className="t-user">  </span> <span className="t-cmd">  --from-schema-datasource prisma/schema.prisma \</span></span>
          <span className="ln"><span className="t-user">  </span> <span className="t-cmd">  --to-schema-datamodel prisma/schema.prisma \</span></span>
          <span className="ln"><span className="t-user">  </span> <span className="t-cmd">  --exit-code</span></span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>No difference detected.</span>  ← schema.sql matches schema.prisma</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">echo $?</span></span>
          <span className="ln t-out">0  ← exit code 0 = no drift. exit code 2 = there IS drift to fix.</span>
          <span className="ln"></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">npx prisma generate</span></span>
          <span className="ln t-out">✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 63ms</span>
          <span className="ln t-comment"> ↑ Generates the database client code your app imports. Must run after npm ci.</span>
        </Terminal>
      </section>

      {/* ── SECTION 5: SYSTEMD SERVICE ── */}
      <section className="lesson" id="service">
        <div className="section-kicker"><span className="num">05</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'Run It as a Service — Same as Class 2' : 'รันเป็น Service — เหมือน Class 2'}
        </h2>
        <p>
          {lang === 'en'
            ? 'This is Class 2\'s heartbeat service again, except the thing you hand to systemd is a real application with a database. The mechanism does not grow with the program — you write this unit the same way.'
            : 'นี่คือ heartbeat service ของ Class 2 อีกครั้ง ยกเว้นว่าสิ่งที่คุณส่งให้ systemd คือ application จริงที่มี database อยู่ กลไกไม่ได้ขยายตามโปรแกรม — คุณเขียน unit นี้แบบเดิม'}
        </p>

        <div className="tbl-wrap">
          <table>
            <tbody>
              <tr><th>{lang === 'en' ? 'Directive' : 'คำสั่ง'}</th><th>{lang === 'en' ? 'Section' : 'Section'}</th><th>{lang === 'en' ? 'What it does' : 'ทำอะไร'}</th></tr>
              <tr><td><code>After=mysql.service</code></td><td>[Unit]</td><td>{lang === 'en' ? 'Start this ONLY after MySQL has started. Does not wait for MySQL to be ready — that\'s Restart=always\'s job.' : 'Start หลังจาก MySQL เท่านั้น ไม่ได้รอให้ MySQL พร้อม — นั่นคืองานของ Restart=always'}</td></tr>
              <tr><td><code>WorkingDirectory=</code></td><td>[Service]</td><td>{lang === 'en' ? 'The directory to run from. That\'s why ExecStart= can use just a filename — systemd changes to this dir first.' : 'Directory ที่จะรัน นั่นคือเหตุผลที่ ExecStart= ใช้แค่ชื่อไฟล์ — systemd เปลี่ยนไปยัง dir นี้ก่อน'}</td></tr>
              <tr><td><code>EnvironmentFile=</code></td><td>[Service]</td><td>{lang === 'en' ? 'systemd reads this file and passes KEY=value pairs to the app as environment variables. No ${} expansion.' : 'systemd อ่านไฟล์นี้และส่ง KEY=value ให้ app เป็น environment variables ไม่ expand ${}'}</td></tr>
              <tr><td><code>User=sysadmin</code></td><td>[Service]</td><td>{lang === 'en' ? 'Run as sysadmin, NOT root. Without this line, service runs as root — never do this for a web app.' : 'รันในฐานะ sysadmin ไม่ใช่ root ถ้าไม่มีบรรทัดนี้ service รันเป็น root — อย่าทำแบบนี้กับ web app'}</td></tr>
            </tbody>
          </table>
        </div>

        <Terminal title="/etc/systemd/system/school-api.service">
          <span className="ln t-comment">[Unit]</span>
          <span className="ln t-out">Description=School Student Register API</span>
          <span className="ln t-out">After=network-online.target <span style={{color:'#f59e0b'}}>mysql.service</span></span>
          <span className="ln t-comment"></span>
          <span className="ln t-comment">[Service]</span>
          <span className="ln t-out"><span style={{color:'#f59e0b'}}>User=sysadmin</span>  ← NOT root</span>
          <span className="ln t-out"><span style={{color:'#f59e0b'}}>WorkingDirectory=/srv/school/backend</span></span>
          <span className="ln t-out"><span style={{color:'#f59e0b'}}>EnvironmentFile=/srv/school/backend/.env</span>  ← systemd reads, no ${} expansion</span>
          <span className="ln t-out">ExecStart=/usr/bin/node server.js</span>
          <span className="ln t-out">Restart=always</span>
          <span className="ln t-out">RestartSec=5  ← wait 5s before retrying (no death loop)</span>
          <span className="ln t-out">NoNewPrivileges=true</span>
          <span className="ln t-out">PrivateTmp=true</span>
          <span className="ln t-out">ProtectSystem=full</span>
          <span className="ln t-out">ProtectHome=read-only</span>
          <span className="ln t-comment"></span>
          <span className="ln t-comment">[Install]</span>
          <span className="ln t-out">WantedBy=multi-user.target</span>
        </Terminal>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo systemctl daemon-reload</span></span>
          <span className="ln t-comment"> ↑ ALWAYS do this after editing a unit file. Without it, systemd answers from the OLD version.</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo systemctl enable --now school-api</span></span>
          <span className="ln t-out">Created symlink .../multi-user.target.wants/school-api.service → .../school-api.service.</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">systemctl is-enabled school-api; systemctl is-active school-api</span></span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>enabled</span></span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>active</span></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">journalctl -u school-api -n 5</span></span>
          <span className="ln t-out">school api listening on 0.0.0.0:<span style={{color:'var(--orange)'}}>3042</span>  ← check YOUR port number</span>
        </Terminal>

        <h3 className="sub-title">{lang === 'en' ? 'Testing the API with curl' : 'ทดสอบ API ด้วย curl'}</h3>
        <p>
          {lang === 'en'
            ? 'curl is the honest view of what the server does. A browser might hide things. curl shows exactly what the HTTP response is.'
            : 'curl คือมุมมองที่ซื่อสัตย์ของสิ่งที่ server ทำ browser อาจซ่อนบางอย่าง curl แสดงว่า HTTP response คืออะไรจริงๆ'}
        </p>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">curl -s http://127.0.0.1:3042/api/health</span></span>
          <span className="ln t-out">{"{"}"ok":true,"student":"68130500035","time":"2026-08-26T07:31:54.959Z"{"}"}</span>
          <span className="ln"></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">curl -s http://127.0.0.1:3042/api/students</span></span>
          <span className="ln t-out">[{"{"}"studentId":"68130500035","firstName":"Teeruch",...{"}"}]</span>
          <span className="ln"></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">curl -s -X POST -H 'Content-Type: application/json' \</span></span>
          <span className="ln"><span className="t-user">  </span> <span className="t-cmd">  -d '{"{"}"studentId":"68130500035","firstName":"Teeruch","lastName":"Songtalay","major":"IT"{"}"}' \</span></span>
          <span className="ln"><span className="t-user">  </span> <span className="t-cmd">  http://127.0.0.1:3042/api/students</span></span>
          <span className="ln t-out">{"{"}"studentId":"68130500035",...{"}"}  ← 201 Created</span>
          <span className="ln"></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo systemctl restart school-api</span></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">curl -s http://127.0.0.1:3042/api/students</span></span>
          <span className="ln t-out">[{"{"}"studentId":"68130500035",...{"}"}]  ← still there! Data lives in MySQL, not in Node.js</span>
          <span className="ln t-comment"> ↑ This is the whole point: a database outlives the process that wrote to it.</span>
        </Terminal>

        <div className="callout">
          <strong>{lang === 'en' ? 'HTTP status codes — whose problem is it?' : 'HTTP status codes — ปัญหาของใคร?'}</strong>
          <div className="tbl-wrap" style={{ marginTop: 10 }}>
            <table>
              <tbody>
                <tr><th>{lang === 'en' ? 'Code Range' : 'ช่วง Code'}</th><th>{lang === 'en' ? 'Meaning' : 'ความหมาย'}</th><th>{lang === 'en' ? 'Example' : 'ตัวอย่าง'}</th></tr>
                <tr><td style={{ color: '#10b981' }}>2xx</td><td>{lang === 'en' ? 'It worked' : 'สำเร็จ'}</td><td>200 OK, 201 Created</td></tr>
                <tr><td style={{ color: '#f59e0b' }}>4xx</td><td>{lang === 'en' ? 'YOUR request was wrong' : 'Request ของคุณผิด'}</td><td>400 Bad Request, 404 Not Found, 409 Conflict</td></tr>
                <tr><td style={{ color: '#ef4444' }}>5xx</td><td>{lang === 'en' ? 'The SERVER broke' : 'Server มีปัญหา'}</td><td>500 Internal Server Error</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Open the Firewall — Your Port Number' : 'เปิด Firewall — หมายเลขพอร์ตของคุณ'}</h3>
        <p>
          {lang === 'en'
            ? 'Your API is listening, but nobody outside can reach it yet. Same situation as Class 3 Part 3. Your port = 3 + last 3 digits of your VM name. lvm68042 → port 3042.'
            : 'API ของคุณกำลัง listen แต่คนข้างนอกยังเข้าไม่ได้ เหมือนกับ Class 3 Part 3 port ของคุณ = 3 + 3 หลักสุดท้ายของชื่อ VM lvm68042 → port 3042'}
        </p>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo ufw allow 3042/tcp</span></span>
          <span className="ln t-out">Rule added</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo ufw status verbose</span></span>
          <span className="ln t-out">3042/tcp     ALLOW IN    Anywhere</span>
          <span className="ln t-comment"> ↑ You now have 2 open ports: 22 (SSH) + 80 (nginx) + 3042 (your API)</span>
          <span className="ln t-comment">   In Class 5 you'll close 3042 and route everything through nginx on port 80.</span>
        </Terminal>
      </section>

      {/* ── SECTION 6: QUIZ ── */}
      <section className="lesson" id="quiz">
        <div className="section-kicker"><span className="num">06</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Self-Test Quiz' : 'ทดสอบความเข้าใจ'}</h2>
        <div id="quizContainer4"></div>
      </section>

      {/* ── SECTION 7: CHEATSHEET ── */}
      <section className="lesson" id="cheatsheet">
        <div className="section-kicker"><span className="num">07</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Class 4 Cheat Sheet' : 'Cheat Sheet Class 4'}</h2>
        <div className="cheat-grid">
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'MySQL Setup' : 'ติดตั้ง MySQL'}</h4>
            <ul>
              <li><code>sudo apt install mysql-server</code></li>
              <li><code>systemctl is-enabled mysql</code> → <span style={{color:'#10b981'}}>enabled</span></li>
              <li><code>systemctl is-active mysql</code> → <span style={{color:'#10b981'}}>active</span> (auto-starts!)</li>
              <li><code>sudo mysql -e "SELECT VERSION();"</code> → must be 8.x</li>
              <li><code>ss -tln</code> → MySQL on <span style={{color:'#10b981'}}>127.0.0.1</span>:3306</li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Database & User' : 'Database & User'}</h4>
            <ul>
              <li><code>sudo mysql {'<'} setup.sql</code> → creates DB + user</li>
              <li><code>install -m 600 /dev/null school.env</code></li>
              <li><code>SCHOOL_PASSWORD='...'</code> → single quotes!</li>
              <li><code>SHOW GRANTS FOR 'school'@'localhost';</code></li>
              <li><code>SHOW DATABASES;</code> → only see school DB</li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Node.js App' : 'Node.js App'}</h4>
            <ul>
              <li><code>npm ci</code> → not npm install</li>
              <li><code>chmod 600 .env</code> → before editing</li>
              <li><code>DATABASE_URL</code> → percent-encode password!</li>
              <li><code>npx prisma migrate diff --exit-code</code></li>
              <li><code>npx prisma generate</code></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'systemd Service' : 'systemd Service'}</h4>
            <ul>
              <li><code>User=sysadmin</code> → never root</li>
              <li><code>WorkingDirectory=</code> → absolute path</li>
              <li><code>EnvironmentFile=</code> → no ${'{'}{'}'} expansion!</li>
              <li><code>After=mysql.service</code></li>
              <li><code>sudo systemctl daemon-reload</code> → always!</li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Testing & Debug' : 'ทดสอบ & Debug'}</h4>
            <ul>
              <li><code>curl -s http://127.0.0.1:PORT/api/health</code></li>
              <li><code>curl -X POST -H 'Content-Type: application/json' -d '...'</code></li>
              <li><code>journalctl -u school-api -n 20</code></li>
              <li><code>systemctl status school-api</code></li>
              <li><code>sudo ufw allow PORT/tcp</code></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Encoding a Password' : 'Encode Password'}</h4>
            <ul>
              <li><code>/</code> → <code>%2F</code> (breaks DB name)</li>
              <li><code>@</code> → <code>%40</code></li>
              <li><code>:</code> → <code>%3A</code></li>
              <li><code>%</code> → <code>%25</code> (silent wrong decode!)</li>
              <li><code>python3 -c 'import urllib.parse; print(urllib.parse.quote("...", safe=""))'</code></li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
});

export default Class4;
