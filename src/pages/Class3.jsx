import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import {
  Globe,
  Package,
  Server,
  Shield,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Terminal as TerminalIcon,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  FileCode,
  FolderOpen,
  Eye,
  MousePointerClick,
  Layers,
  Zap,
  Play,
  Settings,
  Info,
  Network,
  Filter,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import Terminal from '../components/Terminal';
import Quiz3 from '../components/Quiz3';

/* ═══════════════════════════════════════════════
   INTERACTIVE 1: nginx Repository Trust Visualizer
   ═══════════════════════════════════════════════ */
const RepoTrustVisualizer = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';

  const [step, setStep] = useState(0);
  const [showDiff, setShowDiff] = useState(false);

  const steps = [
    {
      cmd: 'apt-cache policy nginx',
      title: { th: 'ขั้นที่ 1: ดูว่า apt มี nginx อะไรให้บ้าง', en: 'Step 1: Check what nginx apt currently offers' },
      output: `nginx:\n  Installed: (none)\n  Candidate: 1.24.0-2ubuntu7.15\n  Version table:\n    1.24.0-2ubuntu7.15 500\n      500 http://th.archive.ubuntu.com/ubuntu noble-updates/main`,
      explain: {
        th: 'Ubuntu มี nginx เวอร์ชัน 1.24.0 ให้ — มาจาก archive.ubuntu.com นี่คือสิ่งที่จะได้ถ้าติดตั้งตอนนี้',
        en: 'Ubuntu offers nginx version 1.24.0 from archive.ubuntu.com — this is what you get if you install now'
      }
    },
    {
      cmd: 'curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo gpg --dearmor -o /usr/share/keyrings/nginx-archive-keyring.gpg',
      title: { th: 'ขั้นที่ 2: ดาวน์โหลด Signing Key ของ nginx.org', en: 'Step 2: Download nginx.org Signing Key' },
      output: `$ ls -l /usr/share/keyrings/nginx-archive-keyring.gpg\n-rw-r--r-- 1 root root 8538 Aug 19 14:05 /usr/share/keyrings/nginx-archive-keyring.gpg`,
      explain: {
        th: 'Key นี้คือ "ตราประทับ" ของ nginx.org — apt จะตรวจสอบทุก package ว่าถูก sign ด้วย key นี้ก่อน ถ้าไม่ตรงก็จะปฏิเสธทันที',
        en: 'This key is the "digital stamp" of nginx.org — apt verifies every package is signed by this key before installation. Unverified packages are refused.'
      }
    },
    {
      cmd: 'echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" | sudo tee /etc/apt/sources.list.d/nginx.list',
      title: { th: 'ขั้นที่ 3: เพิ่ม Repository ของ nginx.org', en: 'Step 3: Add nginx.org Repository' },
      output: `deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu noble nginx`,
      explain: {
        th: 'signed-by= ผูก key หนึ่งตัวกับ repository นี้เท่านั้น — ถ้าไม่ใส่ key จะ trust ทุก repo ในเครื่อง ซึ่งอันตรายมาก',
        en: 'signed-by= binds ONE key to THIS ONE repository only. Without it, the key would be trusted for EVERY repo on the machine — a major security risk.'
      }
    },
    {
      cmd: 'sudo apt update && apt-cache policy nginx',
      title: { th: 'ขั้นที่ 4: อัปเดตแล้วดูว่า Candidate เปลี่ยนไหม', en: 'Step 4: Update and check if Candidate changed' },
      output: `nginx:\n  Installed: (none)\n  Candidate: 1.30.4-1~noble\n  Version table:\n    1.30.4-1~noble 500\n      500 http://nginx.org/packages/ubuntu noble/nginx\n    1.24.0-2ubuntu7.15 500\n      500 http://th.archive.ubuntu.com/ubuntu noble-updates/main`,
      explain: {
        th: 'ตอนนี้มีสอง source แต่ apt เลือก 1.30.4 จาก nginx.org เพราะเวอร์ชันสูงกว่า! ~noble = suffix ของ nginx.org ใช้บอกว่าเป็น build ของใคร',
        en: 'Now two sources exist. apt picks 1.30.4 from nginx.org because it is a higher version! The ~noble suffix tells you whose build this is.'
      }
    },
    {
      cmd: 'sudo apt install nginx',
      title: { th: 'ขั้นที่ 5: ติดตั้ง nginx จาก nginx.org', en: 'Step 5: Install nginx from nginx.org' },
      output: `$ dpkg-query -W -f='\${Status} \${Version}\\n' nginx\ninstall ok installed 1.30.4-1~noble\n\n$ nginx -v\nnginx version: nginx/1.30.4`,
      explain: {
        th: 'ติดตั้งสำเร็จ! ได้ nginx 1.30.4 จาก nginx.org ซึ่งจะใช้ /etc/nginx/conf.d/ เป็น layout หลัก (ต่างจาก Ubuntu ที่ใช้ sites-enabled/)',
        en: 'Successfully installed nginx 1.30.4 from nginx.org! This uses /etc/nginx/conf.d/ as the config layout — different from Ubuntu which uses sites-enabled/.'
      }
    },
  ];

  return (
    <div className="repo-trust-wrap">
      <div className="repo-trust-topbar">
        <div className="rt-title">
          <Package style={{ color: 'var(--orange)', width: 18, height: 18 }} />
          <span>{lang === 'en' ? 'Install nginx from nginx.org — Step by Step' : 'ติดตั้ง nginx จาก nginx.org — ทีละขั้นตอน'}</span>
        </div>
        <button className="rt-diff-btn" onClick={() => setShowDiff(!showDiff)}>
          <Layers style={{ width: 14, height: 14 }} />
          {lang === 'en' ? 'Compare Layouts' : 'เปรียบเทียบ Layout'}
        </button>
      </div>

      {showDiff && (
        <div className="layout-compare">
          <div className="layout-card ubuntu">
            <div className="lc-header">
              <span className="lc-badge ubuntu">Ubuntu</span>
              <code>/etc/nginx/</code>
            </div>
            <ul>
              <li><code>sites-available/</code> <span>— {lang === 'en' ? 'available blocks' : 'block ที่เขียนไว้'}</span></li>
              <li><code>sites-enabled/</code> <span>— {lang === 'en' ? 'symlinks to active blocks' : 'symlink ไปยัง block ที่เปิดใช้'}</span></li>
              <li><code>conf.d/</code> <span>— {lang === 'en' ? 'extra config' : 'config เพิ่มเติม'}</span></li>
              <li className="lc-highlight"><code>user www-data;</code></li>
            </ul>
          </div>
          <div className="layout-card nginxorg">
            <div className="lc-header">
              <span className="lc-badge nginxorg">nginx.org</span>
              <code>/etc/nginx/</code>
            </div>
            <ul>
              <li><code>conf.d/</code> <span>— {lang === 'en' ? 'ONLY source of blocks' : 'แหล่งเดียวของ block'}</span></li>
              <li><code>conf.d/default.conf</code> <span>— {lang === 'en' ? 'default block' : 'block เริ่มต้น'}</span></li>
              <li className="lc-highlight"><code>user nginx;</code></li>
            </ul>
          </div>
        </div>
      )}

      <div className="step-progress">
        {steps.map((s, i) => (
          <button
            key={i}
            className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
            onClick={() => setStep(i)}
          >
            {i < step ? <CheckCircle style={{ width: 14, height: 14 }} /> : i + 1}
          </button>
        ))}
      </div>

      <div className="step-card">
        <div className="step-cmd">
          <span className="sc-prompt">$</span>
          <code>{steps[step].cmd}</code>
        </div>
        <div className="step-title">{steps[step].title[lang]}</div>
        <pre className="step-output">{steps[step].output}</pre>
        <div className="step-explain">
          <Info style={{ width: 14, height: 14, color: 'var(--orange)', flexShrink: 0 }} />
          <span>{steps[step].explain[lang]}</span>
        </div>
      </div>

      <div className="step-nav">
        <button className="sn-btn" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
          ← {lang === 'en' ? 'Back' : 'ก่อนหน้า'}
        </button>
        <span className="sn-counter">{step + 1} / {steps.length}</span>
        <button className="sn-btn primary" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}>
          {lang === 'en' ? 'Next' : 'ถัดไป'} →
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   INTERACTIVE 2: 3-Layer Reachability Checker
   ═══════════════════════════════════════════════ */
const ReachabilityChecker = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';

  const [processRunning, setProcessRunning] = useState(false);
  const [portListening, setPortListening] = useState(false);
  const [firewallOpen, setFirewallOpen] = useState(false);
  const [testMode, setTestMode] = useState('local'); // 'local' | 'external'
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const runTest = () => {
    setTestRunning(true);
    setTestResult(null);
    setTimeout(() => {
      setTestRunning(false);
      if (!processRunning) {
        setTestResult({ type: 'refused', layer: 1 });
      } else if (!portListening) {
        setTestResult({ type: 'refused', layer: 1 });
      } else if (testMode === 'local') {
        setTestResult({ type: 'success', layer: 2 });
      } else if (!firewallOpen) {
        setTestResult({ type: 'timeout', layer: 3 });
      } else {
        setTestResult({ type: 'success', layer: 3 });
      }
    }, 1200);
  };

  const layers = [
    {
      num: 1,
      icon: <Server style={{ width: 20, height: 20 }} />,
      label: { th: 'Layer 1: Process', en: 'Layer 1: Process' },
      check: { th: 'nginx รันอยู่ไหม?', en: 'Is nginx running?' },
      cmd: 'systemctl is-active nginx',
      active: processRunning,
      toggle: () => {
        setProcessRunning(p => !p);
        if (!processRunning) setPortListening(true);
        else { setPortListening(false); setFirewallOpen(false); }
        setTestResult(null);
      },
      color: '#10b981',
    },
    {
      num: 2,
      icon: <Network style={{ width: 20, height: 20 }} />,
      label: { th: 'Layer 2: Port', en: 'Layer 2: Port' },
      check: { th: 'Port 80 listening อยู่ไหม?', en: 'Is port 80 listening?' },
      cmd: 'ss -tln | grep :80',
      active: portListening,
      toggle: () => { if (!processRunning) return; setPortListening(p => !p); setTestResult(null); },
      color: '#3b82f6',
      locked: !processRunning,
    },
    {
      num: 3,
      icon: <Shield style={{ width: 20, height: 20 }} />,
      label: { th: 'Layer 3: Firewall', en: 'Layer 3: Firewall' },
      check: { th: 'UFW เปิดช่องให้ Port 80 เข้าได้ไหม?', en: 'Does UFW allow port 80 incoming?' },
      cmd: 'sudo ufw allow 80/tcp',
      active: firewallOpen,
      toggle: () => { if (!portListening) return; setFirewallOpen(p => !p); setTestResult(null); },
      color: '#f59e0b',
      locked: !portListening,
    },
  ];

  const getResultContent = () => {
    if (!testResult) return null;
    if (testResult.type === 'refused') {
      return {
        icon: <XCircle style={{ width: 18, height: 18, color: '#ef4444' }} />,
        color: 'rgba(239,68,68,0.12)',
        border: 'rgba(239,68,68,0.3)',
        title: lang === 'en' ? 'Connection Refused' : 'Connection Refused',
        detail: lang === 'en'
          ? 'curl: (7) Failed to connect — no process is listening on port 80. Fix Layer 1 first.'
          : 'curl: (7) Failed to connect — ไม่มี process ที่ listen อยู่บน port 80 แก้ Layer 1 ก่อน'
      };
    }
    if (testResult.type === 'timeout') {
      return {
        icon: <AlertCircle style={{ width: 18, height: 18, color: '#f59e0b' }} />,
        color: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.3)',
        title: lang === 'en' ? 'Request Timed Out (Silence)' : 'Request Timed Out (ไม่ตอบ)',
        detail: lang === 'en'
          ? 'curl: (28) Operation timed out — packet dropped by firewall. Refusal and silence are DIFFERENT failure modes.'
          : 'curl: (28) Operation timed out — packet ถูก firewall ดรอป การ refused กับ silence คือความล้มเหลวคนละแบบ!'
      };
    }
    return {
      icon: <CheckCircle style={{ width: 18, height: 18, color: '#10b981' }} />,
      color: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.3)',
      title: testMode === 'local'
        ? (lang === 'en' ? '✓ curl localhost — Works!' : '✓ curl localhost — ทำงานได้!')
        : (lang === 'en' ? '✓ Visitor can reach your site!' : '✓ คนภายนอกเข้าถึงเว็บได้แล้ว!'),
      detail: testMode === 'local'
        ? (lang === 'en'
            ? 'The server is running and listening. But this only proves Layer 1 & 2. It says NOTHING about external access (Layer 3)!'
            : 'server รันและ listening — แต่นี่พิสูจน์แค่ Layer 1 & 2 เท่านั้น! ไม่ได้บอกว่าคนข้างนอกเข้าได้')
        : (lang === 'en'
            ? 'All 3 layers passed. Your site is publicly accessible!'
            : 'ผ่านทั้ง 3 Layer แล้ว เว็บไซต์ของคุณเข้าถึงได้จากภายนอกแล้ว!')
    };
  };

  const result = getResultContent();

  return (
    <div className="reach-checker-wrap">
      <div className="rc-topbar">
        <div className="rc-title">
          <Globe style={{ color: 'var(--orange)', width: 18, height: 18 }} />
          <span>{lang === 'en' ? '3-Layer Reachability Simulator' : '3 Layer แห่งความเข้าถึงได้ (Reachability)'}</span>
        </div>
      </div>

      <div className="rc-layers">
        {layers.map(layer => (
          <div key={layer.num} className={`rc-layer ${layer.active ? 'active' : ''} ${layer.locked ? 'locked' : ''}`}>
            <div className="rcl-left">
              <div className="rcl-icon" style={{ color: layer.color }}>{layer.icon}</div>
              <div className="rcl-info">
                <strong style={{ color: layer.color }}>{layer.label[lang]}</strong>
                <span>{layer.check[lang]}</span>
                <code className="rcl-cmd">{layer.cmd}</code>
              </div>
            </div>
            <button
              className={`rcl-toggle ${layer.active ? 'on' : 'off'} ${layer.locked ? 'disabled' : ''}`}
              onClick={layer.toggle}
            >
              {layer.active
                ? <><CheckCircle style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Active' : 'เปิดอยู่'}</>
                : <><XCircle style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Down' : 'ปิดอยู่'}</>
              }
            </button>
          </div>
        ))}
      </div>

      <div className="rc-test-panel">
        <div className="rc-test-modes">
          <button
            className={`rc-mode-btn ${testMode === 'local' ? 'active' : ''}`}
            onClick={() => { setTestMode('local'); setTestResult(null); }}
          >
            <TerminalIcon style={{ width: 14, height: 14 }} />
            {lang === 'en' ? 'curl localhost (from VM)' : 'curl localhost (จาก VM)'}
          </button>
          <button
            className={`rc-mode-btn ${testMode === 'external' ? 'active' : ''}`}
            onClick={() => { setTestMode('external'); setTestResult(null); }}
          >
            <Globe style={{ width: 14, height: 14 }} />
            {lang === 'en' ? 'Open from browser (external)' : 'เปิดจาก browser ข้างนอก'}
          </button>
        </div>

        <button className={`rc-run-btn ${testRunning ? 'loading' : ''}`} onClick={runTest} disabled={testRunning}>
          {testRunning
            ? <><RefreshCw style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> {lang === 'en' ? 'Testing...' : 'กำลังทดสอบ...'}</>
            : <><Play style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Run Test' : 'ทดสอบ'}</>
          }
        </button>

        {result && (
          <div className="rc-result" style={{ background: result.color, borderColor: result.border }}>
            {result.icon}
            <div>
              <strong>{result.title}</strong>
              <p>{result.detail}</p>
            </div>
          </div>
        )}
      </div>

      <div className="rc-callout">
        <AlertTriangle style={{ width: 14, height: 14, color: '#f59e0b', flexShrink: 0 }} />
        <span>
          {lang === 'en'
            ? 'curl localhost answers questions 1 & 2 — nothing more. It tells you NOTHING about the firewall. Connection refused ≠ request timeout.'
            : 'curl localhost ตอบคำถามข้อ 1 & 2 เท่านั้น — มันไม่ได้บอกอะไรเกี่ยวกับ firewall เลย! "Connection refused" ≠ "Request timed out" คือคนละปัญหากัน'}
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   INTERACTIVE 3: Server Block Selection Simulator
   ═══════════════════════════════════════════════ */
const ServerBlockSim = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';

  const [blocks, setBlocks] = useState([
    { id: 1, filename: 'default.conf', port: 80, serverName: 'localhost', root: '/usr/share/nginx/html', isDefault: false, content: 'Default nginx block' },
    { id: 2, filename: 'site.conf', port: 80, serverName: 'class.int134', root: '/var/www/classsite', isDefault: false, content: 'My INT134 class site' },
  ]);
  const [hostHeader, setHostHeader] = useState('lvm68001.sit.kmutt.ac.th');
  const [queryResult, setQueryResult] = useState(null);
  const [configCheck, setConfigCheck] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);

  const simulateRequest = () => {
    // nginx server block selection algorithm:
    // 1. Match exact server_name
    // 2. If no match → use default_server (or first block sorted by filename)
    const sortedBlocks = [...blocks].sort((a, b) => a.filename.localeCompare(b.filename));
    
    const exactMatch = sortedBlocks.find(b => b.serverName === hostHeader && b.port === 80);
    const defaultBlock = sortedBlocks.find(b => b.isDefault && b.port === 80) || sortedBlocks.find(b => b.port === 80);
    
    if (exactMatch) {
      setQueryResult({ block: exactMatch, reason: 'exact', reasonText: { th: `server_name "${exactMatch.serverName}" ตรงกับ Host: header พอดี`, en: `server_name "${exactMatch.serverName}" exactly matched the Host: header` } });
    } else if (defaultBlock) {
      setQueryResult({
        block: defaultBlock,
        reason: defaultBlock.isDefault ? 'explicit_default' : 'first_sorted',
        reasonText: {
          th: defaultBlock.isDefault
            ? `ไม่มี server_name ตรงกับ "${hostHeader}" → ใช้ block ที่มี default_server keyword`
            : `ไม่มี server_name ตรงกับ "${hostHeader}" → ใช้ block แรกตามลำดับ filename (${defaultBlock.filename})`,
          en: defaultBlock.isDefault
            ? `No server_name matches "${hostHeader}" → Using block with default_server keyword`
            : `No server_name matches "${hostHeader}" → Using first block in filename sort order (${defaultBlock.filename})`
        }
      });
    }
  };

  const runNginxT = () => {
    const duplicateDefault = blocks.filter(b => b.isDefault).length > 1;
    const noRoot = blocks.some(b => !b.root);
    if (duplicateDefault) {
      setConfigCheck({ ok: false, msg: lang === 'en' ? '[emerg] duplicate default server — only ONE block per port can declare default_server' : '[emerg] duplicate default server — มีแค่ block เดียวต่อ port ที่จะ default_server ได้' });
    } else {
      setConfigCheck({ ok: true, msg: 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful' });
    }
  };

  const toggleDefault = (id) => {
    setBlocks(prev => prev.map(b => ({ ...b, isDefault: b.id === id ? !b.isDefault : false })));
    setQueryResult(null);
  };

  const renameFile = (id, newName) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, filename: newName } : b));
    setQueryResult(null);
  };

  const sortedByFilename = [...blocks].sort((a, b) => a.filename.localeCompare(b.filename));

  return (
    <div className="sbs-wrap">
      <div className="sbs-topbar">
        <div className="sbs-title">
          <FileCode style={{ color: 'var(--orange)', width: 18, height: 18 }} />
          <span>{lang === 'en' ? 'nginx Server Block Selection Simulator' : 'จำลองการเลือก Server Block ของ nginx'}</span>
        </div>
      </div>

      <div className="sbs-layout">
        <div className="sbs-left">
          <div className="sbs-section-label">{lang === 'en' ? 'Server Blocks (sorted by filename):' : 'Server Blocks (เรียงตามชื่อไฟล์):'}</div>
          {sortedByFilename.map((block, idx) => (
            <div key={block.id} className={`sbs-block ${queryResult?.block?.id === block.id ? 'selected' : ''} ${block.isDefault ? 'is-default' : ''}`}>
              <div className="sbs-block-header">
                <div className="sbs-file-info">
                  <span className="sbs-sort-num">#{idx + 1}</span>
                  <FolderOpen style={{ width: 14, height: 14, opacity: 0.6 }} />
                  <input
                    className="sbs-filename-input"
                    value={block.filename}
                    onChange={e => renameFile(block.id, e.target.value)}
                    title={lang === 'en' ? 'Edit filename (affects sort order!)' : 'แก้ชื่อไฟล์ (ส่งผลต่อลำดับ!)'}
                  />
                </div>
                <button
                  className={`sbs-default-toggle ${block.isDefault ? 'active' : ''}`}
                  onClick={() => toggleDefault(block.id)}
                  title="toggle default_server"
                >
                  {block.isDefault ? 'default_server ✓' : 'set default_server'}
                </button>
              </div>
              <div className="sbs-block-body">
                <code>server {'{'}</code>
                <code>&nbsp;&nbsp;listen 80{block.isDefault ? ' <strong>default_server</strong>' : ''};</code>
                <code>&nbsp;&nbsp;server_name <em>{block.serverName}</em>;</code>
                <code>&nbsp;&nbsp;root <em>{block.root}</em>;</code>
                <code>{'}'}</code>
              </div>
              <div className="sbs-block-page">{block.content}</div>
            </div>
          ))}
        </div>

        <div className="sbs-right">
          <div className="sbs-section-label">{lang === 'en' ? 'Simulate HTTP Request:' : 'จำลอง HTTP Request:'}</div>
          <div className="sbs-request-box">
            <div className="sbs-req-label">Host: header</div>
            <input
              className="sbs-host-input"
              value={hostHeader}
              onChange={e => { setHostHeader(e.target.value); setQueryResult(null); }}
              placeholder="e.g. class.int134"
            />
            <div className="sbs-presets">
              {['class.int134', 'lvm68001.sit.kmutt.ac.th', 'localhost', 'nobody.claims.this'].map(h => (
                <button key={h} className="sbs-preset-btn" onClick={() => { setHostHeader(h); setQueryResult(null); }}>{h}</button>
              ))}
            </div>
            <button className="sbs-run-btn" onClick={simulateRequest}>
              <ChevronRight style={{ width: 14, height: 14 }} />
              {lang === 'en' ? 'Send Request' : 'ส่ง Request'}
            </button>
          </div>

          {queryResult && (
            <div className={`sbs-result ${queryResult.reason}`}>
              <div className="sbsr-header">
                <CheckCircle style={{ width: 16, height: 16, color: '#10b981' }} />
                <strong>{lang === 'en' ? 'nginx chose:' : 'nginx เลือก:'} {queryResult.block.filename}</strong>
              </div>
              <div className="sbsr-page">→ {queryResult.block.content}</div>
              <div className="sbsr-reason">{queryResult.reasonText[lang]}</div>
            </div>
          )}

          <div className="sbs-nginx-t">
            <button className="sbt-btn" onClick={runNginxT}>
              <Settings style={{ width: 14, height: 14 }} /> nginx -t
            </button>
            {configCheck && (
              <pre className={`sbt-output ${configCheck.ok ? 'ok' : 'error'}`}>{configCheck.msg}</pre>
            )}
          </div>
        </div>
      </div>

      <div className="sbs-rules">
        <div className="sbs-rule-title">{lang === 'en' ? 'nginx Selection Algorithm:' : 'กฎการเลือก Server Block:'}</div>
        <ol className="sbs-rule-list">
          <li>{lang === 'en' ? 'Match Host: header against server_name — exact match wins first' : 'เปรียบ Host: header กับ server_name — ถ้าตรงพอดีชนะเลย'}</li>
          <li>{lang === 'en' ? 'No match? → Use the block with default_server keyword' : 'ไม่มีที่ตรง → ใช้ block ที่มี keyword default_server'}</li>
          <li>{lang === 'en' ? 'No default_server? → Use the FIRST block by filename sort order' : 'ไม่มี default_server → ใช้ block แรกตามลำดับ alphabet ของชื่อไฟล์'}</li>
          <li style={{ color: '#f59e0b' }}>{lang === 'en' ? 'Two blocks with default_server on same port = CONFIG ERROR' : 'สอง block ใช้ default_server บน port เดียวกัน = CONFIG ERROR'}</li>
        </ol>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN CLASS 3 PAGE
   ═══════════════════════════════════════════════ */
const Class3 = React.memo(() => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const mainRef = useRef(null);
  const [quizContainer, setQuizContainer] = useState(null);

  useEffect(() => {
    if (!mainRef.current) return;
    setQuizContainer(mainRef.current.querySelector('#quizContainer3'));

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
      {quizContainer && createPortal(<Quiz3 />, quizContainer)}

      {/* ── HERO ── */}
      <div className="hero">
        <span className="eyebrow-badge">Class 3 · Deploy Static Web</span>
        <h1>
          {lang === 'en'
            ? 'nginx: From Install to Actually Reachable'
            : 'nginx: จากการติดตั้งสู่การ "เข้าถึงได้จริง"'}
        </h1>
        <p className="lede">
          {lang === 'en'
            ? 'Today you put something on the internet that other people can actually load. Almost everything that can go wrong today will go wrong the same way in every class after this.'
            : 'วันนี้คุณจะเอาของบางอย่างขึ้นอินเทอร์เน็ตให้คนอื่นเปิดได้จริงๆ — ทุกอย่างที่ผิดพลาดได้วันนี้จะผิดพลาดแบบเดิมในทุกคลาสหลังจากนี้ด้วย'}
        </p>
        <div className="hero-chips">
          <a className="hero-chip" href="#repos"><Package style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Repositories' : 'Repositories'}</a>
          <a className="hero-chip" href="#service"><Server style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Service Processes' : 'Service Processes'}</a>
          <a className="hero-chip" href="#reachable"><Globe style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Reachability' : 'เข้าถึงได้จริง'}</a>
          <a className="hero-chip" href="#blocks"><FileCode style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Server Blocks' : 'Server Blocks'}</a>
          <a className="hero-chip" href="#quiz"><CheckCircle style={{ width: 14, height: 14 }} /> {lang === 'en' ? 'Self-Test' : 'ทดสอบตัวเอง'}</a>
        </div>
      </div>

      {/* ── SECTION 0: COURSE MAP ── */}
      <section className="lesson" id="intro">
        <div className="section-kicker"><span className="num">00</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Where Are We?' : 'เราอยู่ตรงไหนในวิชานี้?'}</h2>
        <p>
          {lang === 'en'
            ? 'The same application runs all three weeks — and again in containers from Class 6. You are deploying software you did not write. That is the normal case, and it is the skill.'
            : 'แอปพลิเคชันเดิมถูกใช้ตลอด 3 สัปดาห์ — แล้วยังกลับมาอีกครั้งในรูปแบบ container จาก Class 6 คุณกำลัง deploy ซอฟต์แวร์ที่คุณไม่ได้เขียนเอง นั่นคือทักษะจริงๆ'}
        </p>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
          {[
            { num: 1, label: lang === 'en' ? 'Packages & Services' : 'Packages & Services', done: true },
            { num: 2, label: lang === 'en' ? 'Processes & Signals' : 'Processes & Signals', done: true },
            { num: 3, label: lang === 'en' ? 'Static Web (nginx)' : 'Static Web (nginx)', current: true },
            { num: 4, label: lang === 'en' ? 'Backend & Database' : 'Backend & Database', future: true },
            { num: 5, label: lang === 'en' ? 'Integrate + HTTPS' : 'Integrate + HTTPS', future: true },
          ].map(c => (
            <div key={c.num} className={`compare-card ${c.current ? 'current-week' : ''}`} style={c.current ? { borderColor: 'var(--orange)', boxShadow: '0 0 0 1px var(--orange)' } : {}}>
              <h4 style={{ fontSize: '0.8rem' }}>
                {c.done ? <CheckCircle2 style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> : null}
                {c.current ? <Zap style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: 'var(--orange)' }} /> : null}
                Class {c.num}
              </h4>
              <p style={{ fontSize: '0.75rem' }}>{c.label}</p>
            </div>
          ))}
        </div>
        <div className="callout">
          <strong>{lang === 'en' ? 'What you put on the internet today:' : 'สิ่งที่คุณเอาขึ้นอินเทอร์เน็ตวันนี้:'}</strong>
          {lang === 'en'
            ? ' A static front-end website. The app has a form — fill it in and press submit — and the server WILL refuse. That is intentional. Next week you will understand exactly why, and add the backend that handles it.'
            : ' เว็บไซต์ front-end แบบ static แอปมีฟอร์มให้กรอก — กดส่งแล้ว server จะปฏิเสธ นั่นเป็นเรื่องตั้งใจ สัปดาห์หน้าคุณจะเข้าใจว่าทำไม และเพิ่ม backend ที่จัดการกับมัน'}
        </div>
      </section>

      {/* ── SECTION 1: REPOSITORIES ── */}
      <section className="lesson" id="repos">
        <div className="section-kicker"><span className="num">01</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'There Is More Than One nginx' : 'มี nginx มากกว่าหนึ่งตัว'}
        </h2>
        <p>
          {lang === 'en'
            ? '"{<span className="term" data-def="Advanced Package Tool: เครื่องมือติดตั้งและจัดการ software ใน Ubuntu/Debian">apt install</span>} nginx" does not install nginx. It installs whichever nginx this machine has been told about. And there are two completely different builds.'
            : '"{<span className="term" data-def="Advanced Package Tool: เครื่องมือติดตั้งและจัดการ software ใน Ubuntu/Debian">apt install</span>} nginx" ไม่ได้ติดตั้ง nginx — มันติดตั้ง nginx ตัวที่เครื่องนี้ถูกบอกให้รู้จัก และมีสอง build ที่แตกต่างกันโดยสิ้นเชิง'}
        </p>

        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          <strong>{lang === 'en' ? 'Every nginx tutorial silently assumes one of the two builds. It never says which.' : 'ทุก tutorial nginx ที่หาได้บนอินเทอร์เน็ต "แอบ" สมมติว่าใช้ build ใด build หนึ่ง โดยไม่บอก'}</strong>
          {lang === 'en'
            ? ' If you follow Ubuntu instructions on nginx.org nginx, your paths will be wrong.'
            : ' ถ้าคุณตามคำสั่งจาก Ubuntu tutorial แต่ติดตั้งจาก nginx.org path จะผิดหมด'}
        </div>

        <p>
          {lang === 'en'
            ? 'We use the nginx.org build because it is identical to the official container image (you will meet that in Class 6). Learn one layout, not two.'
            : 'เราใช้ build จาก nginx.org เพราะมันเหมือนกับ official container image เป๊ะ (จะได้เจอใน Class 6) เรียนรู้ layout เดียว ไม่ต้องเรียนสอง'}
        </p>

        <h3 className="sub-title">{lang === 'en' ? 'Interactive: Install nginx from nginx.org' : 'Interactive: ติดตั้ง nginx จาก nginx.org ทีละขั้น'}</h3>
        <RepoTrustVisualizer />

        <h3 className="sub-title">{lang === 'en' ? 'Why Signing Keys Matter' : 'ทำไม Signing Key ถึงสำคัญมาก'}</h3>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="compare-card">
            <h4><Lock style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> {lang === 'en' ? 'With signed-by=' : 'มี signed-by='}</h4>
            <p>
              {lang === 'en'
                ? 'This specific key is trusted for THIS specific repo only. A compromised third party cannot replace your packages.'
                : 'Key นี้ถูก trust เฉพาะ repo นี้เท่านั้น คน third party ที่ถูก hack ไม่สามารถแทรก package ให้คุณติดตั้งได้'}
            </p>
          </div>
          <div className="compare-card" style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
            <h4><Unlock style={{ width: 14, height: 14, display: 'inline', marginRight: 4, color: '#ef4444' }} /> {lang === 'en' ? 'Without signed-by= (dangerous!)' : 'ไม่มี signed-by= (อันตราย!)'}</h4>
            <p style={{ color: '#fca5a5' }}>
              {lang === 'en'
                ? 'The key is trusted for EVERY repository on the machine. A compromised third party could replace your kernel.'
                : 'Key นั้นถูก trust สำหรับ EVERY repo ในเครื่อง ถ้า third party โดน hack อาจแทนที่ kernel คุณได้!'}
            </p>
          </div>
        </div>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">apt-cache policy nginx</span></span>
          <span className="ln t-out">nginx:</span>
          <span className="ln t-out">  Installed: (none)</span>
          <span className="ln t-out">  Candidate: 1.30.4-1~noble  ← <span style={{color:'#f59e0b'}}>from nginx.org (higher version wins)</span></span>
          <span className="ln t-out">  Version table:</span>
          <span className="ln t-out">    1.30.4-1~noble 500</span>
          <span className="ln t-out">      500 http://nginx.org/packages/ubuntu noble/nginx</span>
          <span className="ln t-out">    1.24.0-2ubuntu7.15 500</span>
          <span className="ln t-out">      500 http://th.archive.ubuntu.com/ubuntu noble-updates/main</span>
          <span className="ln t-comment">     ↑ ~noble suffix = nginx.org's build marker ↑ Ubuntu's build</span>
        </Terminal>
      </section>

      {/* ── SECTION 2: SERVICE ── */}
      <section className="lesson" id="service">
        <div className="section-kicker"><span className="num">02</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'Installed ≠ Running — Two Independent States' : 'ติดตั้งแล้ว ≠ รันอยู่ — สองสถานะอิสระ'}
        </h2>
        <p>
          {lang === 'en'
            ? 'Installing puts files on a disk. Nothing else. Everything from Class 1 & 2 about enabled and active now applies to something strangers can connect to.'
            : 'การติดตั้งแค่วางไฟล์ลง disk เท่านั้น ไม่มีอะไรเพิ่ม ทุกอย่างที่เรียนมาใน Class 1 & 2 เรื่อง enabled กับ active มาใช้กับสิ่งที่คนอื่นเชื่อมต่อถึงได้จริงๆ ตอนนี้'}
        </p>

        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          <strong>{lang === 'en' ? 'Key fact about nginx.org package:' : 'ข้อเท็จจริงสำคัญของ nginx.org package:'}</strong>
          {lang === 'en'
            ? ' After install, systemctl is-enabled = enabled BUT is-active = inactive. A package MAY auto-enable, MAY auto-start, or MAY do neither. Find out BEFORE you touch it.'
            : ' หลังติดตั้ง: is-enabled = enabled แต่ is-active = inactive! Package อาจ auto-enable, auto-start, หรือไม่ทำทั้งคู่ก็ได้ ตรวจสอบก่อนสั่งอะไร'}
        </div>

        <div className="tbl-wrap">
          <table>
            <tbody>
              <tr><th>{lang === 'en' ? 'Command' : 'คำสั่ง'}</th><th>{lang === 'en' ? 'What it answers' : 'ตอบอะไร'}</th></tr>
              <tr>
                <td><code>systemctl is-enabled nginx</code></td>
                <td>{lang === 'en' ? 'Will it start at boot? (enabled/disabled)' : 'จะ start อัตโนมัติตอนบูตไหม? (enabled/disabled)'}</td>
              </tr>
              <tr>
                <td><code>systemctl is-active nginx</code></td>
                <td>{lang === 'en' ? 'Is it running RIGHT NOW? (active/inactive)' : 'รันอยู่ตอนนี้ไหม? (active/inactive)'}</td>
              </tr>
              <tr>
                <td><code>systemctl enable --now nginx</code></td>
                <td>{lang === 'en' ? 'Both at once — enable AND start immediately' : 'ทั้งสองพร้อมกัน — enable และ start ทันที'}</td>
              </tr>
              <tr>
                <td><code>systemctl status nginx</code></td>
                <td>{lang === 'en' ? 'Both states + main PID + recent log lines' : 'ทั้งสองสถานะ + main PID + log ล่าสุด'}</td>
              </tr>
              <tr>
                <td><code>journalctl -u nginx -f</code></td>
                <td>{lang === 'en' ? 'Follow nginx logs in real-time' : 'ตาม log ของ nginx แบบ real-time'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'One Service, Two Users — The Master/Worker Model' : 'Service เดียว สองผู้ใช้ — Model Master/Worker'}</h3>
        <p>
          {lang === 'en'
            ? 'nginx deliberately runs with a split user model. This is not a bug — it is a security design.'
            : 'nginx ตั้งใจรันด้วย user สองคน — นี่ไม่ใช่บัค แต่เป็นการออกแบบด้านความปลอดภัย'}
        </p>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="compare-card" style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
            <h4 style={{ color: '#f87171' }}><Server style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> {lang === 'en' ? 'Master Process (root)' : 'Master Process (root)'}</h4>
            <ul>
              <li>{lang === 'en' ? 'Binds port 80 (needs root — ports < 1024 need privilege)' : 'Bind port 80 ต้องการ {<span className="term" data-def="ผู้ดูแลระบบสูงสุดใน Linux (Superuser)">root</span>} เพราะ port < 1024 ต้องมีสิทธิ์'}</li>
              <li>{lang === 'en' ? 'Reads and validates nginx.conf' : 'อ่านและตรวจสอบ nginx.conf'}</li>
              <li>{lang === 'en' ? 'Spawns worker processes' : 'สร้าง worker processes'}</li>
              <li>{lang === 'en' ? 'Does NOT handle actual web requests' : 'ไม่ได้จัดการ web request จริงๆ'}</li>
            </ul>
          </div>
          <div className="compare-card" style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
            <h4 style={{ color: '#34d399' }}><Layers style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> {lang === 'en' ? 'Worker Processes (nginx user)' : '{<span className="term" data-def="โพรเซสลูกที่รับหน้าที่เสิร์ฟไฟล์ให้ user จริงๆ โดยลดสิทธิ์ลงมาเพื่อความปลอดภัย">Worker Processes</span>} (nginx user)'}</h4>
            <ul>
              <li>{lang === 'en' ? 'Handle all actual HTTP requests' : 'จัดการ HTTP request จริงทั้งหมด'}</li>
              <li>{lang === 'en' ? 'Read your HTML/CSS/JS files from disk' : 'อ่านไฟล์ HTML/CSS/JS จาก disk'}</li>
              <li>{lang === 'en' ? 'Talk directly to visitors (strangers on the internet)' : 'คุยกับ visitors โดยตรง (คนแปลกหน้าบนอินเทอร์เน็ต)'}</li>
              <li>{lang === 'en' ? 'Run as low-privilege "nginx" user — cannot escape root' : 'รันเป็น user "nginx" ที่มีสิทธิ์ต่ำ'}</li>
            </ul>
          </div>
        </div>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">ps -o user,pid,ppid,cmd -C nginx</span></span>
          <span className="ln t-out">USER         PID    PPID CMD</span>
          <span className="ln t-out"><span style={{color:'#f87171'}}>root</span>      264545       1 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf</span>
          <span className="ln t-out"><span style={{color:'#34d399'}}>nginx</span>     264546  264545 nginx: worker process</span>
          <span className="ln t-out"><span style={{color:'#34d399'}}>nginx</span>     264547  264545 nginx: worker process</span>
          <span className="ln t-comment">  ↑ Master = root (binds port 80)    ↑ Workers = nginx user (handles requests)</span>
        </Terminal>

        <div className="callout">
          {lang === 'en'
            ? 'When a file of yours is unreadable in Class 4, this is why. Your files may be owned by you (sysadmin), but the nginx worker process reads them as the "nginx" user. Check permissions!'
            : 'ถ้าใน Class 4 แล้วเกิดปัญหาอ่านไฟล์ไม่ได้ — นี่คือเหตุผล ไฟล์ของคุณอาจเป็นเจ้าของโดย sysadmin แต่ nginx worker อ่านในฐานะ user "nginx" ตรวจ permissions ด้วย!'}
        </div>
      </section>

      {/* ── SECTION 3: REACHABILITY ── */}
      <section className="lesson" id="reachable">
        <div className="section-kicker"><span className="num">03</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'Listening ≠ Reachable — 3 Things That Can Block You' : '"Listening" ≠ "เข้าถึงได้" — 3 สิ่งที่กั้นคุณอยู่'}
        </h2>
        <p>
          {lang === 'en'
            ? 'This is the part that matters most. Every remaining class deploys something on a port, and this failure looks identical every time.'
            : 'นี่คือส่วนที่สำคัญที่สุด ทุกคลาสที่เหลือจะ deploy บางอย่างบน port — และความล้มเหลวนี้หน้าตาเหมือนกันทุกครั้ง'}
        </p>

        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          <strong>
            {lang === 'en'
              ? 'curl localhost only answers questions 1 & 2. It tells you NOTHING about whether external visitors can reach your server.'
              : 'curl localhost ตอบคำถามแค่ข้อ 1 & 2 เท่านั้น — ไม่ได้บอกเลยว่า visitor ข้างนอกเข้าถึงได้หรือไม่'}
          </strong>
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Simulate All 3 Failure Modes' : 'จำลอง 3 โหมดความล้มเหลว'}</h3>
        <ReachabilityChecker />

        <h3 className="sub-title">{lang === 'en' ? 'Managing the Firewall with ufw' : 'จัดการ Firewall ด้วย ufw'}</h3>
        <p>
          {lang === 'en'
            ? 'ufw = Uncomplicated Firewall. By default on your VM: deny all incoming except port 22 (SSH). That one rule exists because someone added it for you before you ever logged in.'
            : 'ufw = Uncomplicated Firewall ค่าเริ่มต้นบน VM ของคุณ: บล็อกทุกอย่างที่เข้า ยกเว้น port 22 (SSH) rule นั้นมีอยู่เพราะมีคนเพิ่มไว้ก่อนที่คุณจะ login ครั้งแรก'}
        </p>

        <div className="callout warn" style={{ borderColor: 'rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }}>
          <AlertTriangle style={{ width: 16, height: 16, color: '#ef4444' }} />
          <strong style={{ color: '#f87171' }}>
            {lang === 'en' ? 'NEVER deny or delete the SSH rule!' : 'อย่าลบหรือ deny rule ของ SSH เด็ดขาด!'}
          </strong>
          {lang === 'en'
            ? ' If you lock yourself out of port 22, you cannot SSH in. There is no other way to access the VM. You will be permanently locked out.'
            : ' ถ้าล็อคตัวเองออกจาก port 22 คุณจะ SSH เข้าไม่ได้ ไม่มีทางอื่นเข้า VM อีกต่อไปแล้ว'}
        </div>

        <div className="tbl-wrap">
          <table>
            <tbody>
              <tr><th>{lang === 'en' ? 'Command' : 'คำสั่ง'}</th><th>{lang === 'en' ? 'What it does' : 'ทำอะไร'}</th></tr>
              <tr><td><code>sudo ufw status verbose</code></td><td>{lang === 'en' ? 'Show all rules and default policies' : 'แสดง rule ทั้งหมดและ policy เริ่มต้น'}</td></tr>
              <tr><td><code>sudo ufw status numbered</code></td><td>{lang === 'en' ? 'Show rules with numbers (for deleting)' : 'แสดง rule พร้อมเลข (ใช้สำหรับลบ)'}</td></tr>
              <tr><td><code>sudo ufw allow 80/tcp</code></td><td>{lang === 'en' ? 'Open port 80 for incoming TCP connections' : 'เปิด port 80 ให้รับการเชื่อมต่อ TCP ขาเข้า'}</td></tr>
              <tr><td><code>sudo ufw delete allow 80/tcp</code></td><td>{lang === 'en' ? 'Remove the port 80 rule' : 'ลบ rule ที่เปิด port 80'}</td></tr>
              <tr><td><code>sudo ufw show listening</code></td><td>{lang === 'en' ? 'Show what ports are open AND their firewall rules' : 'แสดง port ที่เปิดอยู่พร้อม rule ของ firewall'}</td></tr>
              <tr><td><code>ss -tln</code></td><td>{lang === 'en' ? 'Show listening TCP ports (process perspective)' : 'แสดง TCP port ที่ listening (มุมมองของ process)'}</td></tr>
            </tbody>
          </table>
        </div>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">ss -tln</span></span>
          <span className="ln t-out">State  Recv-Q Send-Q  Local Address:Port</span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>LISTEN</span> 0      511           <span className="term" data-def="0.0.0.0 = ทุก network interface บนเครื่องนี้ ทุกคนที่เชื่อมต่อถึงเครื่องนี้ได้จะเห็น port นี้">0.0.0.0</span>:80         0.0.0.0:*</span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>LISTEN</span> 0      4096          0.0.0.0:22         0.0.0.0:*</span>
          <span className="ln t-out"><span style={{color:'#6b7280'}}>LISTEN</span> 0      4096       <span className="term" data-def="127.0.0.53 = localhost เท่านั้น process อื่นบนเครื่องเดียวกันเข้าถึงได้ แต่คนข้างนอกไม่มีทาง">127.0.0.53</span>:53         0.0.0.0:*</span>
          <span className="ln t-comment">   ↑ port 80 = 0.0.0.0 (everyone)    ↑ port 53 = 127.x (local only)</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo ufw allow 80/tcp</span></span>
          <span className="ln t-out">Rule added</span>
        </Terminal>

        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          {[
            { icon: <XCircle style={{ width: 18, height: 18, color: '#ef4444' }} />, label: lang === 'en' ? 'Connection Refused' : 'Connection Refused', desc: lang === 'en' ? 'Machine says "not here". Port closed or process down.' : 'เครื่องตอบว่า "ไม่มี" — port ปิดหรือ process ไม่รัน' },
            { icon: <AlertCircle style={{ width: 18, height: 18, color: '#f59e0b' }} />, label: lang === 'en' ? 'Request Timed Out' : 'Request Timed Out', desc: lang === 'en' ? 'Silence. Packet dropped by firewall — machine says nothing.' : 'เงียบสนิท Packet ถูก firewall ดรอป — เครื่องไม่พูดอะไร' },
            { icon: <CheckCircle style={{ width: 18, height: 18, color: '#10b981' }} />, label: lang === 'en' ? 'Page Loads' : 'Page Loads', desc: lang === 'en' ? 'All 3 layers passed. Machine says yes.' : 'ผ่านทั้ง 3 layer เครื่องตอบว่า "ใช่"' },
          ].map((item, i) => (
            <div key={i} className="compare-card">
              <h4>{item.icon} {item.label}</h4>
              <p style={{ fontSize: '0.8rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: SERVER BLOCKS ── */}
      <section className="lesson" id="blocks">
        <div className="section-kicker"><span className="num">04</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'Server Blocks — Which Block Answers Which Request?' : 'Server Blocks — ใคร Block ไหนตอบ Request ไหน?'}
        </h2>
        <p>
          {lang === 'en'
            ? 'Writing a server block does not put your site on the web. nginx can hold several blocks claiming port 80, and it picks exactly one per request. Your block can be 100% correct and still never answer.'
            : 'การเขียน server block ไม่ได้หมายความว่าเว็บคุณอยู่บน internet แล้ว nginx มีหลาย block ที่อ้าง port 80 และจะเลือกแค่หนึ่งตัวต่อ request block ของคุณอาจถูก 100% แต่ก็ยังไม่เคยถูกเลือก'}
        </p>

        <h3 className="sub-title">{lang === 'en' ? 'Where Config Lives' : 'Config อยู่ที่ไหน'}</h3>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">grep -n include /etc/nginx/nginx.conf</span></span>
          <span className="ln t-out">15:    include       /etc/nginx/mime.types;</span>
          <span className="ln t-out">31:    include /etc/nginx/conf.d/<span style={{color:'var(--orange)'}}>*.conf</span>;</span>
          <span className="ln t-comment">           ↑ Only *.conf files. In FILENAME SORT ORDER. Both details matter.</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">ls /etc/nginx/conf.d/</span></span>
          <span className="ln t-out">default.conf</span>
        </Terminal>

        <div className="callout warn">
          <AlertTriangle style={{ width: 16, height: 16 }} />
          {lang === 'en'
            ? 'Only files ending .conf are read — renaming is the cheapest possible on/off switch! And files are read in ALPHABETICAL order, not creation order.'
            : 'อ่านเฉพาะไฟล์ที่ลงท้ายด้วย .conf เท่านั้น — การเปลี่ยนชื่อไฟล์คือวิธี on/off ที่ง่ายที่สุด! และไฟล์ถูกอ่านตาม ลำดับ ALPHABET ไม่ใช่ลำดับที่สร้าง'}
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Interactive: Server Block Simulator' : 'Interactive: จำลองการเลือก Server Block'}</h3>
        <ServerBlockSim />

        <h3 className="sub-title">{lang === 'en' ? 'nginx -t vs systemctl reload' : 'nginx -t vs systemctl reload'}</h3>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="compare-card">
            <h4><Settings style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> <code>sudo nginx -t</code></h4>
            <p>{lang === 'en' ? 'Tests if config would LOAD. Does NOT touch the running server. Run this before every reload!' : 'ทดสอบว่า config จะโหลดได้ไหม ไม่แตะ server ที่รันอยู่ รันทุกครั้งก่อน reload!'}</p>
          </div>
          <div className="compare-card">
            <h4><RefreshCw style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> <code>sudo systemctl reload nginx</code></h4>
            <p>{lang === 'en' ? 'Applies the new config. Old workers finish current requests first. Reload with broken config = keeps old config. RESTART with broken config = no web server!' : 'ใช้ config ใหม่ worker เก่าทำ request ปัจจุบันจบก่อน reload ด้วย config ผิด = ใช้ config เก่าต่อ RESTART ด้วย config ผิด = ไม่มี web server!'}</p>
          </div>
        </div>

        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo nginx -t</span></span>
          <span className="ln t-out" style={{color:'#10b981'}}>nginx: the configuration file /etc/nginx/nginx.conf syntax is ok</span>
          <span className="ln t-out" style={{color:'#10b981'}}>nginx: configuration file /etc/nginx/nginx.conf test is successful</span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">sudo systemctl reload nginx</span></span>
          <span className="ln t-comment">     ↑ Safe! Config passed -t. Now safely applying new config.</span>
        </Terminal>

        <div className="callout">
          {lang === 'en'
            ? 'nginx -t says config would LOAD, not that it WORKS. Pointing root at a directory that does not exist passes nginx -t just fine. Test and verify with curl too.'
            : 'nginx -t บอกว่า config จะโหลดได้ ไม่ได้บอกว่ามันทำงานได้ถูกต้อง กำหนด root ไปยัง directory ที่ไม่มีอยู่ก็ผ่าน nginx -t ได้สบาย ต้องทดสอบด้วย curl ด้วย'}
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Full Server Block Example' : 'ตัวอย่าง Server Block ครบถ้วน'}</h3>
        <Terminal title="/etc/nginx/conf.d/site.conf">
          <span className="ln t-out">server {'{'}</span>
          <span className="ln t-out">    listen      80 <span style={{color:'#f59e0b'}}>default_server</span>;  <span className="t-comment"># ← answers unclaimed Host: headers</span></span>
          <span className="ln t-out">    server_name class.int134;  <span className="t-comment"># ← exact match for this name</span></span>
          <span className="ln t-out"></span>
          <span className="ln t-out">    root  /var/www/classsite;  <span className="t-comment"># ← where your files live</span></span>
          <span className="ln t-out">    index index.html;         <span className="t-comment"># ← what to return for directory requests</span></span>
          <span className="ln t-out"></span>
          <span className="ln t-out">    location / {'{'}</span>
          <span className="ln t-out">        try_files $uri $uri/ =404;  <span className="t-comment"># ← file → dir → 404</span></span>
          <span className="ln t-out">    {'}'}</span>
          <span className="ln t-out">{'}'}</span>
        </Terminal>
      </section>

      {/* ── SECTION 5: WHAT A STATIC SERVER CANNOT DO ── */}
      <section className="lesson" id="limits">
        <div className="section-kicker"><span className="num">05</span><span className="line"></span></div>
        <h2 className="section-title">
          {lang === 'en' ? 'What a Static Web Server Cannot Do' : 'สิ่งที่ Static Web Server ทำไม่ได้'}
        </h2>
        <p>
          {lang === 'en'
            ? 'The app has a form. Fill it in, press the button — and the server will refuse. Nothing is broken.'
            : 'แอปมีฟอร์มให้กรอก กดส่ง — แล้ว server จะปฏิเสธ ไม่มีอะไรพังนะ'}
        </p>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="compare-card">
            <h4><Eye style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> {lang === 'en' ? 'What nginx CAN do' : 'nginx ทำได้'}</h4>
            <ul>
              <li>{lang === 'en' ? 'Read an existing file from disk' : 'อ่านไฟล์ที่มีอยู่แล้วบน disk'}</li>
              <li>{lang === 'en' ? 'Send that file back to the browser' : 'ส่งไฟล์นั้นกลับให้ browser'}</li>
              <li>{lang === 'en' ? 'Handle hundreds of concurrent requests' : 'รับ request หลายร้อยพร้อมกันได้'}</li>
            </ul>
          </div>
          <div className="compare-card" style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
            <h4 style={{ color: '#f87171' }}><XCircle style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} /> {lang === 'en' ? 'What nginx CANNOT do' : 'nginx ทำไม่ได้'}</h4>
            <ul>
              <li>{lang === 'en' ? 'Accept a form submission and save it' : 'รับฟอร์มที่ส่งมาแล้วบันทึก'}</li>
              <li>{lang === 'en' ? 'Query or update a database' : 'Query หรืออัปเดตฐานข้อมูล'}</li>
              <li>{lang === 'en' ? 'Execute application logic' : 'รัน logic ของแอปพลิเคชัน'}</li>
            </ul>
          </div>
        </div>
        <div className="callout">
          {lang === 'en'
            ? 'It tells you so with HTTP 405 Method Not Allowed. Read it. Remember it — because it is the argument for next week\'s backend.'
            : 'Server ตอบกลับด้วย HTTP 405 Method Not Allowed อ่านมัน จำมันไว้ — เพราะมันคือเหตุผลของ backend สัปดาห์หน้า'}
        </div>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">curl -I http://localhost/</span></span>
          <span className="ln t-out"><span style={{color:'#10b981'}}>HTTP/1.1 200 OK</span>  ← {lang === 'en' ? 'GET works! Static file served.' : 'GET ได้! ส่งไฟล์ static สำเร็จ'}</span>
          <span className="ln t-out t-comment"></span>
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">curl -X POST http://localhost/api/submit -d '{"{}"}'</span></span>
          <span className="ln t-out"><span style={{color:'#ef4444'}}>HTTP/1.1 405 Not Allowed</span>  ← {lang === 'en' ? 'POST refused. This is expected!' : 'POST ถูกปฏิเสธ นั่นคือสิ่งที่คาดหวัง!'}</span>
          <span className="ln t-comment">   static server = read & return files. It cannot "handle" a POST request.</span>
        </Terminal>
      </section>

      {/* ── SECTION 6: QUIZ ── */}
      <section className="lesson" id="quiz">
        <div className="section-kicker"><span className="num">06</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Self-Test Quiz' : 'ทดสอบความเข้าใจ'}</h2>
        <div id="quizContainer3"></div>
      </section>

      {/* ── SECTION 7: CHEATSHEET ── */}
      <section className="lesson" id="cheatsheet">
        <div className="section-kicker"><span className="num">07</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Class 3 Cheat Sheet' : 'Cheat Sheet Class 3'}</h2>
        <div className="cheat-grid">
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Install nginx (nginx.org)' : 'ติดตั้ง nginx (nginx.org)'}</h4>
            <ul>
              <li><code>apt-cache policy nginx</code><span className="d">{lang === 'en' ? '— check available versions & sources' : '— ดูเวอร์ชันที่มี & แหล่งที่มา'}</span></li>
              <li><code>curl ... | gpg --dearmor -o ...</code><span className="d">{lang === 'en' ? '— save signing key' : '— บันทึก signing key'}</span></li>
              <li><code>echo "deb [signed-by=...] ..." | sudo tee ...</code><span className="d">{lang === 'en' ? '— add repo' : '— เพิ่ม repo'}</span></li>
              <li><code>sudo apt update && sudo apt install nginx</code><span className="d"></span></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Service Management' : 'จัดการ Service'}</h4>
            <ul>
              <li><code>systemctl is-enabled nginx</code><span className="d">{lang === 'en' ? '— boot autostart?' : '— บูตอัตโนมัติไหม?'}</span></li>
              <li><code>systemctl is-active nginx</code><span className="d">{lang === 'en' ? '— running now?' : '— รันอยู่ไหม?'}</span></li>
              <li><code>systemctl enable --now nginx</code><span className="d">{lang === 'en' ? '— enable + start' : '— enable + เริ่มทันที'}</span></li>
              <li><code>ps -o user,pid,ppid,cmd -C nginx</code><span className="d">{lang === 'en' ? '— check master/worker users' : '— ดู user ของ master/worker'}</span></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Reachability & Firewall' : 'Reachability & Firewall'}</h4>
            <ul>
              <li><code>ss -tln</code><span className="d">{lang === 'en' ? '— listening ports & addresses' : '— port ที่ listening & ที่อยู่'}</span></li>
              <li><code>curl localhost</code><span className="d">{lang === 'en' ? '— test layers 1 & 2 only' : '— ทดสอบแค่ layer 1 & 2'}</span></li>
              <li><code>sudo ufw status verbose</code><span className="d">{lang === 'en' ? '— view all firewall rules' : '— ดู rule firewall ทั้งหมด'}</span></li>
              <li><code>sudo ufw allow 80/tcp</code><span className="d">{lang === 'en' ? '— open port 80' : '— เปิด port 80'}</span></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Server Blocks' : 'Server Blocks'}</h4>
            <ul>
              <li><code>sudo nginx -t</code><span className="d">{lang === 'en' ? '— test config (safe, no changes)' : '— ทดสอบ config (ปลอดภัย ไม่เปลี่ยนอะไร)'}</span></li>
              <li><code>sudo systemctl reload nginx</code><span className="d">{lang === 'en' ? '— apply new config' : '— ใช้ config ใหม่'}</span></li>
              <li><code>listen 80 default_server;</code><span className="d">{lang === 'en' ? '— explicit fallback block' : '— ประกาศ block fallback ชัดเจน'}</span></li>
              <li><code>curl -H 'Host: name' localhost</code><span className="d">{lang === 'en' ? '— test a specific block' : '— ทดสอบ block ที่ต้องการ'}</span></li>
            </ul>
          </div>
        </div>

        <div className="callout tip" style={{ marginTop: '24px' }}>
          <span className="tag">{lang === 'en' ? '4 Things Before You Leave' : '4 สิ่งก่อนกลับบ้าน'}</span>
          1. {lang === 'en' ? 'Your site loads from a machine that is NOT your VM (phone/laptop browser)' : 'เว็บโหลดได้จากเครื่องที่ไม่ใช่ VM (browser โทรศัพท์/laptop)'}<br />
          2. {lang === 'en' ? 'You can name which of the 3 failures you hit, and how you knew' : 'คุณบอกได้ว่าเจอความล้มเหลว layer ไหน และรู้ได้ยังไง'}<br />
          3. {lang === 'en' ? 'You ran nginx -t before a reload, and saw it FAIL at least once' : 'คุณรัน nginx -t ก่อน reload อย่างน้อยครั้งหนึ่ง และเห็นมัน FAIL อย่างน้อยครั้งหนึ่ง'}<br />
          4. {lang === 'en' ? 'You pressed Add in the form, got 405, and understand WHY' : 'คุณกดปุ่ม Add ในฟอร์ม ได้ 405 และเข้าใจว่า ทำไม'}
        </div>
      </section>

      <div className="foot">
        Class 3 · Deploy Static Web (nginx) · INT134 System Deployment 2026 · OrLor Study Guide
      </div>
    </main>
  );
});

export default Class3;
