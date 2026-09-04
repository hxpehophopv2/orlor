import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import {
  Eye,
  LogOut,
  Radio,
  Cog,
  CheckCircle,
  CheckCircle2,
  Activity,
  XCircle,
  AlertCircle,
  Target,
  ArrowRightCircle,
  MousePointerClick,
  Check,
  X,
  RotateCcw,
  ShieldAlert,
  Terminal as TerminalIcon,
  Zap,
  Play,
  Pause,
  Server,
  RefreshCw,
  GitBranch,
  Layers
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import Terminal from '../components/Terminal';
import Quiz2 from '../components/Quiz2';

/* ── INTERACTIVE 1: SIGNAL SIMULATOR ── */
const SIGNALS = [
  {
    num: 1,
    name: 'SIGHUP',
    color: '#f59e0b',
    catchable: true,
    desc: {
      th: 'terminal หายไป — เกิดขึ้นเมื่อ logout หรือปิดหน้าต่าง terminal',
      en: 'terminal disconnected — occurs on logout or closing terminal window'
    }
  },
  {
    num: 2,
    name: 'SIGINT',
    color: '#3b82f6',
    catchable: true,
    desc: {
      th: 'Ctrl+C — สั่งขอร้องให้หยุดการทำงานทันที',
      en: 'Ctrl+C — polite request to interrupt execution immediately'
    }
  },
  {
    num: 9,
    name: 'SIGKILL',
    color: '#ef4444',
    catchable: false,
    desc: {
      th: 'Kernel บังคับหยุดทันที — ห้าม catch/block/ignore เด็ดขาด!',
      en: 'Kernel forced kill — CANNOT be caught, blocked, or ignored!'
    }
  },
  {
    num: 15,
    name: 'SIGTERM',
    color: '#10b981',
    catchable: true,
    desc: {
      th: 'ขอให้ปิดตัวอย่างสุภาพ (default ของคำสั่ง kill)',
      en: 'Polite request to terminate (default for kill command)'
    }
  },
];

const SignalSimulator = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const [stubborn, setStubborn] = useState(true);
  const [isAlive, setIsAlive] = useState(true);
  const [pid, setPid] = useState(55401);
  const [logs, setLogs] = useState([
    { time: '14:20:00', text: 'Process started (PID 55401)', type: 'system' },
    { time: '14:20:05', text: 'heartbeat 2026-08-12 14:20:05', type: 'out' },
  ]);
  const [activeSignal, setActiveSignal] = useState(null);
  const [animatingPayload, setAnimatingPayload] = useState(null);
  const [lastActionExplain, setLastActionExplain] = useState(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!isAlive) return;
    const interval = setInterval(() => {
      const now = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [
        ...prev.slice(-15),
        { time: now, text: `heartbeat 2026-08-12 ${now}`, type: 'out' }
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAlive]);

  const sendSignal = (sig) => {
    if (animatingPayload) return;

    setActiveSignal(sig);
    setAnimatingPayload(sig);

    const now = new Date().toTimeString().split(' ')[0];

    setLogs(prev => [
      ...prev,
      { time: now, text: `$ kill -${sig.num} ${pid}`, type: 'cmd' }
    ]);

    setTimeout(() => {
      setAnimatingPayload(null);
      const isTrap = stubborn && sig.num === 15;

      if (!isAlive) {
        setLogs(prev => [
          ...prev,
          { time: now, text: `[ERROR] No process found with PID ${pid} (already dead)`, type: 'error' }
        ]);
        setLastActionExplain({
          sig,
          status: 'error',
          detail: lang === 'en'
            ? 'Process is dead! Cannot receive signals. Click "Respawn Process" first.'
            : 'โพรเซสนี้ตายไปแล้ว! ไม่สามารถส่ง signal ถึงได้ ต้องกด "รีสตาร์ทโพรเซส" ก่อน'
        });
        return;
      }

      if (sig.num === 9) {
        setIsAlive(false);
        setLogs(prev => [
          ...prev,
          { time: now, text: `[KERNEL] SIGKILL (9) delivered. Process forcibly terminated!`, type: 'kill' },
          { time: now, text: `[SYSTEM] Process ${pid} killed (Killed by Signal 9)`, type: 'system' }
        ]);
        setLastActionExplain({
          sig,
          status: 'killed',
          detail: lang === 'en'
            ? 'SIGKILL (9) was handled directly by the Kernel! The program gets no chance to trap or clean up files—unsaved buffer data is lost instantly!'
            : 'SIGKILL (9) ถูกส่งตรงโดย Kernel! โปรแกรมไม่มีโอกาสได้ trap หรือทำความสะอาดไฟล์ ข้อมูลค้างที่ยังไม่บันทึกจะหายทันที!'
        });
      } else if (isTrap) {
        setLogs(prev => [
          ...prev,
          { time: now, text: `caught it — not going anywhere`, type: 'trap' },
          { time: now, text: `[TRAP] SIGTERM (15) intercepted by script handler. Process still running.`, type: 'warn' }
        ]);
        setLastActionExplain({
          sig,
          status: 'trapped',
          detail: lang === 'en'
            ? 'stubborn.sh had a pre-configured trap "echo ..." TERM. When SIGTERM (15) arrived, it intercepted the request and kept running.'
            : 'stubborn.sh ได้ตั้ง trap "echo ..." TERM ไว้ล่วงหน้า! เมื่อ SIGTERM (15) มาถึง มันเลยเลือกปฏิเสธคำขอปิดตัวแล้วรันต่อสบายๆ'
        });
      } else {
        setIsAlive(false);
        const exitMsg = sig.num === 2
          ? 'SIGINT (2) received (Ctrl+C). Terminating...'
          : sig.num === 1
          ? 'SIGHUP (1) received (Hangup). Terminal disconnected.'
          : 'SIGTERM (15) received. Gracefully shutting down...';

        setLogs(prev => [
          ...prev,
          { time: now, text: exitMsg, type: 'warn' },
          { time: now, text: `[SYSTEM] Process ${pid} exited with status 0`, type: 'system' }
        ]);
        setLastActionExplain({
          sig,
          status: 'graceful',
          detail: lang === 'en'
            ? `${sig.name} (${sig.num}) was sent to the process. The process gracefully accepted the request and terminated.`
            : `${sig.name} (${sig.num}) ถูกส่งไปยังโพรเซส ซึ่งโปรแกรมยอมรับคำขอและปิดตัวลงอย่างเรียบร้อย`
        });
      }
    }, 700);
  };

  const resetProcess = () => {
    const newPid = pid + Math.floor(Math.random() * 500) + 1;
    setPid(newPid);
    setIsAlive(true);
    setActiveSignal(null);
    setLastActionExplain(null);
    const now = new Date().toTimeString().split(' ')[0];
    setLogs([
      { time: now, text: `Process started (${stubborn ? 'stubborn.sh' : 'heartbeat.sh'}) PID ${newPid}`, type: 'system' },
      { time: now, text: `heartbeat 2026-08-12 ${now}`, type: 'out' }
    ]);
  };

  return (
    <div className="signal-sim-container">
      <div className="signal-sim-topbar">
        <div className="sim-title">
          <Zap className="icon-sm" style={{ color: 'var(--orange)' }} />
          <span>{lang === 'en' ? 'Linux Signal Interactive Playground' : 'สนามทดลอง Linux Signal แบบ Interactive'}</span>
        </div>

        <div className="sim-mode-toggle">
          <span className="sim-label">{lang === 'en' ? 'Script Tested:' : 'สคริปต์ที่ทดสอบ:'}</span>
          <button
            className={`mode-chip ${stubborn ? 'active' : ''}`}
            onClick={() => {
              setStubborn(true);
              setIsAlive(true);
              setActiveSignal(null);
              setLastActionExplain(null);
              const now = new Date().toTimeString().split(' ')[0];
              setLogs([{ time: now, text: `Loaded stubborn.sh (trap '...' TERM) PID ${pid}`, type: 'system' }]);
            }}
          >
            <ShieldAlert className="icon-sm" /> stubborn.sh ({lang === 'en' ? 'trap TERM' : 'ดื้อ / trap TERM'})
          </button>
          <button
            className={`mode-chip ${!stubborn ? 'active' : ''}`}
            onClick={() => {
              setStubborn(false);
              setIsAlive(true);
              setActiveSignal(null);
              setLastActionExplain(null);
              const now = new Date().toTimeString().split(' ')[0];
              setLogs([{ time: now, text: `Loaded heartbeat.sh (normal) PID ${pid}`, type: 'system' }]);
            }}
          >
            <Activity className="icon-sm" /> heartbeat.sh ({lang === 'en' ? 'Normal' : 'ปกติ'})
          </button>
        </div>
      </div>

      <div className="sim-animation-stage">
        <div className="stage-card sender">
          <div className="card-header">
            <TerminalIcon className="icon-sm" />
            <span>{lang === 'en' ? 'Terminal / Sender' : 'Terminal / User'}</span>
          </div>
          <div className="sender-body">
            <div className="cmd-prompt">
              <code>$ kill -N {pid}</code>
            </div>
            <p className="hint-text">{lang === 'en' ? 'Click a signal button below to dispatch' : 'คลิกปุ่ม Signal ด้านล่างเพื่อส่งยิงไปที่ Process'}</p>
          </div>
        </div>

        <div className="stage-track">
          {animatingPayload && (
            <div
              className="flying-payload"
              style={{ '--payload-color': animatingPayload.color }}
            >
              <Zap className="icon-sm" />
              <span>{animatingPayload.name} ({animatingPayload.num})</span>
            </div>
          )}
          <div className="track-line"></div>
        </div>

        <div className={`stage-card process ${isAlive ? 'alive' : 'dead'}`}>
          <div className="card-header">
            <div className={`status-dot ${isAlive ? 'pulse-green' : 'dead-red'}`}></div>
            <span>{stubborn ? 'stubborn.sh' : 'heartbeat.sh'}</span>
            <span className="pid-badge">PID: {isAlive ? pid : 'DEAD'}</span>
          </div>

          <div className="process-body">
            <div className="proc-state-display">
              {isAlive ? (
                <>
                  <Activity className="icon-sm pulse-icon" style={{ color: '#10b981' }} />
                  <span style={{ color: '#10b981', fontWeight: 600 }}>RUNNING</span>
                </>
              ) : (
                <>
                  <XCircle className="icon-sm" style={{ color: '#ef4444' }} />
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>STOPPED / KILLED</span>
                </>
              )}
            </div>

            {stubborn && isAlive && (
              <div className="trap-indicator">
                <ShieldAlert className="icon-sm" style={{ color: '#f59e0b' }} />
                <span>trap TERM Active</span>
              </div>
            )}

            {!isAlive && (
              <button className="respawn-btn" onClick={resetProcess}>
                <RotateCcw className="icon-sm" /> {lang === 'en' ? 'Respawn Process' : 'รีสตาร์ทโพรเซส'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="sim-dispatch-panel">
        <div className="panel-title">{lang === 'en' ? 'Select Signal to Send:' : 'เลือก Signal ที่ต้องการส่ง:'}</div>
        <div className="signal-grid">
          {SIGNALS.map(sig => (
            <button
              key={sig.num}
              className={`sig-card-btn ${activeSignal?.num === sig.num ? 'selected' : ''}`}
              style={{ '--sig-color': sig.color }}
              onClick={() => sendSignal(sig)}
            >
              <div className="sig-badge-num">{sig.num}</div>
              <div className="sig-details">
                <span className="name">{sig.name}</span>
                <span className="desc">{sig.desc[lang]}</span>
              </div>
              {!sig.catchable && <span className="uncatch-tag">Kernel Force</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="sim-console">
        <div className="console-bar">
          <div className="dots">
            <span></span><span></span><span></span>
          </div>
          <span className="console-title">Live Process Log Output ({stubborn ? 'stubborn.sh' : 'heartbeat.sh'})</span>
          {isAlive && <span className="live-indicator"><span className="pulse"></span> LIVE</span>}
        </div>
        <div className="console-logs" ref={logContainerRef}>
          {logs.map((l, index) => (
            <div key={index} className={`log-line type-${l.type}`}>
              <span className="log-time">[{l.time}]</span>
              <span className="log-text">{l.text}</span>
            </div>
          ))}
        </div>
      </div>

      {lastActionExplain && (
        <div className={`sim-explanation ${lastActionExplain.status}`}>
          <div className="exp-header">
            <AlertCircle className="icon-sm" style={{ color: lastActionExplain.sig.color }} />
            <span>{lang === 'en' ? 'Behavior Explanation:' : 'คำอธิบายพฤติกรรมของระบบ:'} <strong>{lastActionExplain.sig.name} (Signal {lastActionExplain.sig.num})</strong></span>
          </div>
          <p className="exp-detail">{lastActionExplain.detail}</p>
        </div>
      )}
    </div>
  );
};

/* ── INTERACTIVE 2: PROCESS TREE & ADOPTION SIMULATOR ── */
const ProcessTree = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const [selected, setSelected] = useState(null);
  const [bashAlive, setBashAlive] = useState(true);
  const [heartbeatPid, setHeartbeatPid] = useState(55120);
  const [bannerNotice, setBannerNotice] = useState(null);

  const isAdopted = !bashAlive;

  const handleSimulateLogout = () => {
    setBashAlive(false);
    setBannerNotice({
      title: lang === 'en' ? '🚪 Simulating Logout (Bash Shell Closes)' : '🚪 จำลองการ Logout (Bash Shell ปิดตัว)',
      detail: lang === 'en'
        ? `bash (PID 54754) closed → heartbeat.sh did NOT die! It was instantly adopted by systemd (PID 1). Notice line re-routing and PPID changing from 54754 to 1.`
        : `bash (PID 54754) ปิดตัวลง → heartbeat.sh ไม่ได้ตายตาม! แต่ถูก "รับเลี้ยง" (adopt) โดย systemd (PID 1) ทันที! สังเกตเส้นเชื่อมและ PPID ที่เปลี่ยนจาก 54754 เป็น 1`
    });
  };

  const handleSimulateKillService = () => {
    const newPid = heartbeatPid + 121;
    setHeartbeatPid(newPid);
    setBannerNotice({
      title: lang === 'en' ? '⚡ Simulating Kill on Managed Service Process' : '⚡ จำลองการ Kill Process ของ Service',
      detail: lang === 'en'
        ? `Old process (PID ${heartbeatPid}) killed! But systemd (Restart=always) instantly spawned a NEW replacement process (PID ${newPid}) — Service status remained Active throughout! "The service is NOT the process!"`
        : `Process เก่า (PID ${heartbeatPid}) ถูก kill! แต่ systemd ตรวจพบ (Restart=always) จึง spawn Process ใหม่ขึ้นมาแทนที่ทันที (PID ใหม่ ${newPid}) — สังเกตว่า Service ยังคง Active! "The service is NOT the process!"`
    });
  };

  const handleResetTree = () => {
    setBashAlive(true);
    setHeartbeatPid(55120);
    setBannerNotice(null);
    setSelected(null);
  };

  const nodes = [
    {
      id: 'systemd',
      label: 'systemd',
      pid: 1,
      ppid: 0,
      info: lang === 'en'
        ? 'PID 1 — Runs continuously. Has no parent; root process of the entire system.'
        : 'PID 1 — มีชีวิตอยู่ตลอด ไม่มี parent คือ root process ของทั้งระบบ',
      color: '#f59e0b',
      x: 50,
      y: 10
    },
    {
      id: 'sshd',
      label: 'sshd',
      pid: 820,
      ppid: 1,
      info: lang === 'en'
        ? 'SSH daemon — Listens for incoming connections; started at boot.'
        : 'SSH daemon — รอรับการเชื่อมต่อจากภายนอก เปิดมาตั้งแต่บูต',
      color: '#3b82f6',
      x: 25,
      y: 32
    },
    {
      id: 'cron',
      label: 'cron',
      pid: 819,
      ppid: 1,
      info: lang === 'en'
        ? 'cron daemon — Runs scheduled time-based tasks as root.'
        : 'cron daemon — รันงานตามเวลาที่กำหนด รันเป็น root',
      color: '#8b5cf6',
      x: 75,
      y: 32
    },
  ];

  if (bashAlive) {
    nodes.push({
      id: 'bash',
      label: lang === 'en' ? 'bash (Yours)' : 'bash (ของคุณ)',
      pid: 54754,
      ppid: 820,
      info: lang === 'en'
        ? 'Your interactive shell created on SSH login — child of sshd.'
        : 'shell ของเราที่ได้มาตอน ssh เข้ามา — เป็นลูกของ sshd',
      color: '#10b981',
      x: 25,
      y: 60
    });
  }

  nodes.push({
    id: 'heartbeat',
    label: 'heartbeat.sh',
    pid: heartbeatPid,
    ppid: isAdopted ? 1 : 54754,
    info: isAdopted
      ? (lang === 'en'
          ? `PID ${heartbeatPid} | PPID 1 (Adopted by systemd) — Survived logout because PID 1 adopted it!`
          : `PID ${heartbeatPid} | PPID 1 (Adopted by systemd) — รอดจากการ logout เพราะโดน PID 1 รับเลี้ยง!`)
      : (lang === 'en'
          ? `PID ${heartbeatPid} | PPID 54754 (bash) — Running as background job in your shell.`
          : `PID ${heartbeatPid} | PPID 54754 (bash) — รันเป็น background job ใน shell ของคุณ`),
    color: isAdopted ? '#f59e0b' : '#ef4444',
    x: isAdopted ? 50 : 12,
    y: isAdopted ? 78 : 84
  });

  if (bashAlive) {
    nodes.push({
      id: 'ps',
      label: lang === 'en' ? 'ps (ephemeral)' : 'ps (ชั่วคราว)',
      pid: 55130,
      ppid: 54754,
      info: lang === 'en'
        ? 'Spawns when typing ps, executes instantly, and exits.'
        : 'เมื่อพิมพ์ ps มันสร้าง process ใหม่ ทำงาน แล้วก็หายไป',
      color: '#6b7280',
      x: 38,
      y: 84
    });
  }

  const edges = [
    ['systemd', 'sshd'],
    ['systemd', 'cron'],
  ];

  if (bashAlive) {
    edges.push(['sshd', 'bash']);
    edges.push(['bash', 'heartbeat']);
    edges.push(['bash', 'ps']);
  } else {
    edges.push(['systemd', 'heartbeat']);
  }

  const getNode = (id) => nodes.find(n => n.id === id);

  return (
    <div className="process-tree-wrap">
      <div className="tree-topbar">
        <div className="tree-title">
          <GitBranch className="icon-sm" style={{ color: 'var(--orange)' }} />
          <span>{lang === 'en' ? 'Interactive Process Tree & Adoption Simulator' : 'Process Tree & การรับเลี้ยงโพรเซส (Adoption) แบบ Interactive'}</span>
        </div>
        <div className="tree-actions">
          {bashAlive ? (
            <button className="tree-btn warn" onClick={handleSimulateLogout}>
              <LogOut className="icon-sm" /> {lang === 'en' ? 'Simulate Logout (Close Bash)' : 'จำลองการ Logout (ปิด Bash)'}
            </button>
          ) : (
            <button className="tree-btn" onClick={handleResetTree}>
              <RotateCcw className="icon-sm" /> {lang === 'en' ? 'Reset Tree' : 'รีเซ็ต Tree กลับเดิม'}
            </button>
          )}

          <button className="tree-btn danger" onClick={handleSimulateKillService}>
            <Zap className="icon-sm" /> {lang === 'en' ? 'Kill Service Process' : 'Kill Process ของ Service'}
          </button>
        </div>
      </div>

      <svg viewBox="0 0 100 100" className="process-tree-svg" style={{ width: '100%', height: '320px' }}>
        {edges.map(([a, b], i) => {
          const na = getNode(a), nb = getNode(b);
          if (!na || !nb) return null;
          return (
            <line
              key={i}
              x1={na.x} y1={na.y + 4}
              x2={nb.x} y2={nb.y - 4}
              stroke={a === 'systemd' && b === 'heartbeat' ? '#f59e0b' : 'rgba(255,255,255,0.2)'}
              strokeWidth={a === 'systemd' && b === 'heartbeat' ? '0.8' : '0.5'}
              strokeDasharray={a === 'systemd' && b === 'heartbeat' ? 'none' : '1 0.5'}
            />
          );
        })}
        {nodes.map(n => (
          <g key={n.id} onClick={() => setSelected(selected?.id === n.id ? null : n)} style={{ cursor: 'pointer' }}>
            <circle
              cx={n.x} cy={n.y}
              r={selected?.id === n.id ? 5.5 : 4.5}
              fill={n.color + '33'}
              stroke={n.color}
              strokeWidth={selected?.id === n.id ? 0.9 : 0.5}
            />
            <text x={n.x} y={n.y + 0.5} textAnchor="middle" dominantBaseline="middle" fill={n.color} fontSize="1.8">
              ●
            </text>
            <text x={n.x} y={n.y + 7} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="2.2" fontWeight="bold">
              {n.label}
            </text>
            <text x={n.x} y={n.y + 10} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="1.7">
              PID {n.pid} (PPID {n.ppid})
            </text>
          </g>
        ))}
      </svg>

      {bannerNotice && (
        <div className="tree-notice-banner">
          <strong>{bannerNotice.title}</strong>
          <p>{bannerNotice.detail}</p>
        </div>
      )}

      {selected ? (
        <div className="proc-info-box" style={{ borderColor: selected.color + '66' }}>
          <strong style={{ color: selected.color }}>{selected.label}</strong> — PID: {selected.pid} | PPID: {selected.ppid}
          <br />
          {selected.info}
        </div>
      ) : (
        <div className="proc-info-box" style={{ opacity: 0.6 }}>
          <MousePointerClick className="icon-sm" /> {lang === 'en' ? 'Click any node to inspect PID, PPID, and process role.' : 'คลิกที่ Node เพื่อดู PID, PPID และบทบาทของโพรเซสนั้น'}
        </div>
      )}
    </div>
  );
};

/* ── INTERACTIVE 3: JOB CONTROL & LOGOUT VISUALIZER ── */
const JobControlSimulator = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const [jobs, setJobs] = useState([]);
  const [shoptHup, setShoptHup] = useState(false);
  const [sessionActive, setSessionActive] = useState(true);

  const spawnJob = (mode) => {
    if (!sessionActive) return;
    const jobNum = jobs.length + 1;
    const pid = 55000 + Math.floor(Math.random() * 800);
    const newJob = {
      id: jobNum,
      pid,
      cmd: mode === 'nohup' ? 'nohup ./heartbeat.sh &' : './heartbeat.sh &',
      state: 'Running',
      isNohup: mode === 'nohup',
      stdout: mode === 'nohup' ? 'nohup.out' : '/dev/pts/1 (Terminal)'
    };
    setJobs(prev => [...prev, newJob]);
  };

  const handleSuspendJob = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, state: 'Stopped' } : j));
  };

  const handleBgJob = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, state: 'Running' } : j));
  };

  const handleKillJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleSimulateLogout = () => {
    setSessionActive(false);
    setJobs(prev => {
      return prev.filter(j => {
        if (j.isNohup) return true;
        if (shoptHup) return false;
        return true;
      }).map(j => ({ ...j, stdout: j.isNohup ? 'nohup.out' : '/dev/pts/1 (DELETED)' }));
    });
  };

  const handleReconnect = () => {
    setSessionActive(true);
  };

  return (
    <div className="job-sim-container">
      <div className="job-sim-topbar">
        <div className="job-sim-title">
          <Layers className="icon-sm" style={{ color: 'var(--orange)' }} />
          <span>{lang === 'en' ? 'Job Control & Terminal Detach Playground' : 'Job Control & Terminal Detach Playground'}</span>
        </div>

        <div className="job-sim-controls">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={shoptHup}
              onChange={e => setShoptHup(e.target.checked)}
              disabled={!sessionActive}
            />
            <span><code>shopt -s huponexit</code> ({shoptHup ? 'ON' : 'OFF'})</span>
          </label>

          {sessionActive ? (
            <button className="job-btn warn" onClick={handleSimulateLogout}>
              <LogOut className="icon-sm" /> exit ({lang === 'en' ? 'Simulate Logout' : 'จำลอง Logout'})
            </button>
          ) : (
            <button className="job-btn success" onClick={handleReconnect}>
              <RotateCcw className="icon-sm" /> {lang === 'en' ? 'SSH Reconnect' : 'SSH Login กลับเข้ามาใหม่'}
            </button>
          )}
        </div>
      </div>

      <div className="job-sim-body">
        <div className="job-spawn-panel">
          <span className="panel-label">{lang === 'en' ? 'Spawn New Job:' : 'สร้าง Job ใหม่:'}</span>
          <button className="spawn-btn" onClick={() => spawnJob('bg')} disabled={!sessionActive}>
            + ./heartbeat.sh &amp; (Background)
          </button>
          <button className="spawn-btn nohup" onClick={() => spawnJob('nohup')} disabled={!sessionActive}>
            + nohup ./heartbeat.sh &amp; (nohup)
          </button>
        </div>

        <div className="job-list-wrap">
          <div className="table-header">{lang === 'en' ? 'Background Jobs ($ jobs):' : 'Background Jobs ($ jobs):'}</div>
          {jobs.length === 0 ? (
            <div className="empty-jobs">{lang === 'en' ? 'No active jobs running — try clicking spawn buttons above' : 'ไม่มี Job รันอยู่ในขณะนี้ — ลองกดสร้าง Job ด้านบน'}</div>
          ) : (
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>PID</th>
                  <th>State</th>
                  <th>Command</th>
                  <th>stdout Destination</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id} className={j.state === 'Stopped' ? 'stopped' : ''}>
                    <td><code>[{j.id}]</code></td>
                    <td><code>{j.pid}</code></td>
                    <td>
                      <span className={`state-badge ${j.state.toLowerCase()}`}>{j.state}</span>
                    </td>
                    <td><code>{j.cmd}</code></td>
                    <td>
                      <span className={j.stdout.includes('DELETED') ? 'stdout-deleted' : ''}>{j.stdout}</span>
                    </td>
                    <td>
                      <div className="job-actions">
                        {j.state === 'Running' ? (
                          <button onClick={() => handleSuspendJob(j.id)} title="Ctrl+Z">Ctrl+Z</button>
                        ) : (
                          <button onClick={() => handleBgJob(j.id)}>bg</button>
                        )}
                        <button className="danger" onClick={() => handleKillJob(j.id)}>kill</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── INTERACTIVE 4: SYSTEMD LIFECYCLE BUILDER ── */
const UnitFileBuilder = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const [desc, setDesc] = useState('Heartbeat for INT134 lab02');
  const [execPath, setExecPath] = useState('/home/sysadmin/int134/lab02/heartbeat.sh');
  const [user, setUser] = useState('sysadmin');
  const [restart, setRestart] = useState('always');
  const [wantedBy, setWantedBy] = useState('multi-user.target');

  const [diskDrift, setDiskDrift] = useState(false);
  const [serviceEnabled, setServiceEnabled] = useState(false);
  const [serviceActive, setServiceActive] = useState(false);
  const [mainPid, setMainPid] = useState(63047);

  const errors = [];
  if (!execPath.startsWith('/')) errors.push(lang === 'en' ? 'ExecStart must be an absolute path (starting with /)' : 'ExecStart ต้องเป็น absolute path (ขึ้นต้นด้วย /) ห้ามใช้ ~ หรือ relative path');
  if (execPath.includes('~')) errors.push(lang === 'en' ? 'Do not use ~ in ExecStart (systemd does not expand tilde)' : 'ห้ามใช้ ~ ใน ExecStart เพราะ systemd ไม่ expand home directory');
  if (!user) errors.push(lang === 'en' ? 'Unspecified User will execute as root (security risk)' : 'ไม่ระบุ User = จะรันเป็น root ซึ่งอันตราย');

  const fileContent = `[Unit]
Description=${desc}

[Service]
ExecStart=${execPath}
User=${user}
Restart=${restart}

[Install]
WantedBy=${wantedBy}`;

  const handleInputChange = (setter, val) => {
    setter(val);
    setDiskDrift(true);
  };

  const handleDaemonReload = () => {
    setDiskDrift(false);
  };

  const handleEnableNow = () => {
    setServiceEnabled(true);
    setServiceActive(true);
    setMainPid(prev => prev + 10);
  };

  const handleStopService = () => {
    setServiceActive(false);
  };

  const handleDisableService = () => {
    setServiceEnabled(false);
  };

  const handleRebootVM = () => {
    setTimeout(() => {
      if (serviceEnabled) {
        setServiceActive(true);
        setMainPid(prev => prev + 150);
      } else {
        setServiceActive(false);
      }
    }, 400);
  };

  return (
    <div className="unit-builder-container">
      <div className="builder-topbar">
        <Server className="icon-sm" style={{ color: 'var(--orange)' }} />
        <span>{lang === 'en' ? 'Interactive Systemd Lifecycle & Service Status Simulator' : 'Systemd Lifecycle & Service Status Simulator แบบ Interactive'}</span>
      </div>

      <div className="unit-builder">
        <div className="unit-inputs">
          <div className="section-label">{lang === 'en' ? 'Edit file on disk (/etc/systemd/system/int134-heartbeat.service):' : 'แก้ไขไฟล์บน Disk (/etc/systemd/system/int134-heartbeat.service):'}</div>
          <label>
            <span>Description=</span>
            <input value={desc} onChange={e => handleInputChange(setDesc, e.target.value)} placeholder="ข้อความอธิบาย service" />
          </label>
          <label>
            <span>ExecStart=</span>
            <input value={execPath} onChange={e => handleInputChange(setExecPath, e.target.value)} placeholder="/absolute/path/to/script.sh" style={{ fontFamily: 'monospace' }} />
          </label>
          <label>
            <span>User=</span>
            <input value={user} onChange={e => handleInputChange(setUser, e.target.value)} placeholder="sysadmin" />
          </label>
          <label>
            <span>Restart=</span>
            <select value={restart} onChange={e => handleInputChange(setRestart, e.target.value)}>
              <option value="always">always ({lang === 'en' ? 'restart always' : 'เปิดใหม่เสมอ'})</option>
              <option value="on-failure">on-failure ({lang === 'en' ? 'restart on crash' : 'เปิดใหม่แค่ตอน crash'})</option>
              <option value="no">no ({lang === 'en' ? 'do not restart' : 'ไม่ restart'})</option>
            </select>
          </label>
          <label>
            <span>WantedBy=</span>
            <input value={wantedBy} onChange={e => handleInputChange(setWantedBy, e.target.value)} placeholder="multi-user.target" />
          </label>

          {errors.length > 0 && (
            <div className="validation-error-box">
              {errors.map((e, i) => (
                <div key={i} className="val-err-line">
                  <AlertCircle className="icon-sm" /> {e}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="unit-preview">
          <div className="terminal-bar">
            <span></span><span></span><span></span>
            <span className="terminal-title">/etc/systemd/system/int134-heartbeat.service</span>
          </div>
          <pre className="unit-file-pre">{fileContent}</pre>
        </div>
      </div>

      <div className="systemctl-palette">
        <span className="palette-label">{lang === 'en' ? 'Dispatch Systemctl Commands / Reboot VM:' : 'สั่งคำสั่ง Systemctl / Reboot:'}</span>
        <div className="palette-buttons">
          <button className={`sys-cmd-btn ${diskDrift ? 'highlight' : ''}`} onClick={handleDaemonReload}>
            <RefreshCw className="icon-sm" /> systemctl daemon-reload
          </button>

          <button className="sys-cmd-btn success" onClick={handleEnableNow}>
            <Play className="icon-sm" /> systemctl enable --now
          </button>

          <button className="sys-cmd-btn warn" onClick={handleStopService} disabled={!serviceActive}>
            <Pause className="icon-sm" /> systemctl stop
          </button>

          <button className="sys-cmd-btn danger" onClick={handleDisableService} disabled={!serviceEnabled}>
            <XCircle className="icon-sm" /> systemctl disable
          </button>

          <button className="sys-cmd-btn reboot" onClick={handleRebootVM}>
            <RotateCcw className="icon-sm" /> {lang === 'en' ? 'sudo reboot (Test after boot)' : 'sudo reboot (ทดสอบหลังบูตเครื่อง)'}
          </button>
        </div>
      </div>

      <div className="systemd-status-window">
        <div className="window-bar">
          <div className="dots"><span></span><span></span><span></span></div>
          <span>$ systemctl status int134-heartbeat</span>
        </div>

        <div className="window-body">
          {diskDrift && (
            <div className="status-drift-warning">
              <AlertCircle className="icon-sm" />
              <span>Warning: The unit file changed on disk. Run 'systemctl daemon-reload' to reload units.</span>
            </div>
          )}

          <div className="status-line">
            ● int134-heartbeat.service - {desc}
          </div>
          <div className="status-line">
            &nbsp;&nbsp;Loaded: loaded (/etc/systemd/system/int134-heartbeat.service; <strong>{serviceEnabled ? 'enabled' : 'disabled'}</strong>)
          </div>
          <div className="status-line">
            &nbsp;&nbsp;Active: <strong style={{ color: serviceActive ? '#10b981' : '#ef4444' }}>{serviceActive ? 'active (running)' : 'inactive (dead)'}</strong>
          </div>
          {serviceActive && (
            <div className="status-line">
              &nbsp;&nbsp;Main PID: <strong>{mainPid}</strong> (bash)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ── */
const Class2 = React.memo(() => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const mainRef = useRef(null);
  const [quizContainer, setQuizContainer] = useState(null);

  useEffect(() => {
    if (!mainRef.current) return;
    setQuizContainer(mainRef.current.querySelector('#quizContainer2'));

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
      term.addEventListener('focus', enter);
      term.addEventListener('blur', leave);
      handlers.push(() => {
        term.removeEventListener('mouseenter', enter);
        term.removeEventListener('mouseleave', leave);
        term.removeEventListener('focus', enter);
        term.removeEventListener('blur', leave);
      });
    });

    return () => handlers.forEach(h => h());
  }, []);

  return (
    <main ref={mainRef}>
      {quizContainer && createPortal(<Quiz2 />, quizContainer)}

      {/* ── HERO ── */}
      <div className="hero">
        <span className="eyebrow-badge">Class 2 · Managing Processes</span>
        <h1>{lang === 'en' ? 'How Processes Work & How Far Can We Control Them?' : 'โพรเซสทำงานอย่างไร และเราจัดการมันได้แค่ไหน?'}</h1>
        <p className="lede">
          {lang === 'en'
            ? 'Every service you started in Class 1 is a process behind the scenes. Today we learn to inspect, terminate, survive logouts, and hand processes off to systemd.'
            : 'ทุก service ที่คุณเคยเปิดใน Class 1 คือ "โพรเซส" (process) อยู่เบื้องหลัง — วันนี้เราจะเรียนรู้วิธีมอง, หยุด, หนีจาก logout, และส่งมอบโพรเซสให้ systemd ดูแล เพื่อให้มันรอดจากทุกสถานการณ์'}
        </p>
        <div className="hero-chips">
          <a className="hero-chip" href="#seeing"><Eye className="icon-sm" /> {lang === 'en' ? 'Seeing Processes' : 'มองเห็นโพรเซส'}</a>
          <a className="hero-chip" href="#detaching"><LogOut className="icon-sm" /> {lang === 'en' ? 'Surviving Logout' : 'หนีจาก Logout'}</a>
          <a className="hero-chip" href="#signals"><Radio className="icon-sm" /> Signals</a>
          <a className="hero-chip" href="#systemd"><Cog className="icon-sm" /> {lang === 'en' ? 'Deploy with systemd' : 'ส่งให้ systemd'}</a>
          <a className="hero-chip" href="#quiz"><CheckCircle className="icon-sm" /> {lang === 'en' ? 'Self-Test Quiz' : 'ทดสอบความเข้าใจ'}</a>
        </div>
      </div>

      {/* ── SECTION 0: WHERE WE ARE ── */}
      <section className="lesson" id="intro">
        <div className="section-kicker"><span className="num">00</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Where Are We in This Course?' : 'เราอยู่ตรงไหนในวิชานี้?'}</h2>
        <p>
          {lang === 'en'
            ? 'In Class 1, you learned how to start/stop existing services with systemctl. Today, we build custom services and understand how processes run under the OS.'
            : 'Class 1 คุณเรียนรู้ว่า service ที่มีอยู่แล้วสั่ง start/stop ได้ด้วย systemctl — วันนี้คือการสร้าง service ขึ้นมาเอง และเข้าใจว่า service นั้นทำงานอย่างไรใต้ระบบ'}
        </p>
        <div className="compare-grid">
          <div className="compare-card">
            <h4><CheckCircle2 className="icon-sm" /> {lang === 'en' ? 'Class 1 (Done)' : 'Class 1 (แล้ว)'}</h4>
            <p>{lang === 'en' ? 'Existing services → manage with systemctl' : 'service ที่มีอยู่แล้ว → สั่ง start/stop ด้วย systemctl'}</p>
          </div>
          <div className="compare-card" style={{ borderColor: 'var(--orange)', boxShadow: '0 0 0 1px var(--orange)' }}>
            <h4><Target className="icon-sm" /> {lang === 'en' ? 'Class 2 (Today)' : 'Class 2 (วันนี้)'}</h4>
            <p>{lang === 'en' ? 'Build custom processes → process trees, signals & systemd adoption' : 'สร้าง process ขึ้นมาเอง → ทำความเข้าใจ process tree, signals, และการส่งให้ systemd ดูแล'}</p>
          </div>
          <div className="compare-card">
            <h4><ArrowRightCircle className="icon-sm" /> {lang === 'en' ? 'Class 3+ (Next)' : 'Class 3+ (ต่อไป)'}</h4>
            <p>{lang === 'en' ? 'Deploy web servers, databases & containers that survive logouts' : 'deploy web server, database, containers — ทั้งหมดเป็น process ที่ต้องรอดจากการ logout'}</p>
          </div>
        </div>
        <div className="callout">
          <strong>{lang === 'en' ? 'Key Question Today:' : 'คำถามหลักของวันนี้:'}</strong> {lang === 'en' ? 'If you run ./myapp & and exit your session — will it still be running tomorrow? Answer is NO — and this lesson explains why.' : 'ถ้ารัน ./myapp & แล้ว exit ออกไป — แล้วกลับมาวันรุ่งขึ้น มันยังรันอยู่ไหม? คำตอบคือ "ไม่" — และเหตุผลคือทั้งหมดของ Class 2 นี้'}
        </div>
      </section>

      {/* ── SECTION 1: SEEING ── */}
      <section className="lesson" id="seeing">
        <div className="section-kicker"><span className="num">01</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Seeing Running Processes' : 'มองเห็นสิ่งที่กำลังรันอยู่'}</h2>
        <p>
          {lang === 'en'
            ? 'Before controlling anything, you must be able to see it. But the simple ps command alone does NOT show the entire system.'
            : 'ก่อนจัดการอะไรได้ ต้องมองเห็นก่อน — แต่ คำสั่ง ps เพียงอย่างเดียวไม่ได้แสดงระบบให้คุณ'}
        </p>
        <div className="callout warn">
          <span className="tag">{lang === 'en' ? 'Misconception #1' : 'ความเข้าใจผิดอันดับ 1'}</span>
          {lang === 'en'
            ? '"I ran ps and did not see my service!" — That is NOT proof that it is not running! Plain ps only shows your current terminal session (2-3 processes) out of 100+ system processes.'
            : '"ผมรัน ps แล้วไม่เห็น service ของผม" — นั่นไม่ใช่หลักฐานว่ามันไม่รัน! ps เฉยๆ แสดงแค่ terminal ของตัวเอง (2-3 ตัว) จาก 100+ ตัวทั้งระบบ'}
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Process Inspection Commands' : 'คำสั่งดูโพรเซส'}</h3>
        <div className="tbl-wrap">
          <table>
            <tbody>
              <tr><th>{lang === 'en' ? 'Command' : 'คำสั่ง'}</th><th>{lang === 'en' ? 'What it Displays' : 'แสดงอะไร'}</th></tr>
              <tr>
                <td><code>ps</code></td>
                <td>{lang === 'en' ? 'Only processes tied to your current terminal session' : 'เฉพาะโพรเซสที่ผูกกับ terminal ตัวเอง (ไม่ใช่ทั้งระบบ!)'}</td>
              </tr>
              <tr>
                <td><code>ps aux</code></td>
                <td>{lang === 'en' ? 'All system processes (BSD style) with %CPU and %MEM' : 'ทุกโพรเซสในระบบ สไตล์ BSD พร้อม %CPU %MEM'}</td>
              </tr>
              <tr>
                <td><code>ps -ef</code></td>
                <td>{lang === 'en' ? 'All system processes (UNIX style) including PPID (Parent ID)' : 'ทุกโพรเซส สไตล์ UNIX พร้อม PPID (ID ของ parent)'}</td>
              </tr>
              <tr>
                <td><code>ps -o pid,ppid,user,stat,cmd -p 1234</code></td>
                <td>{lang === 'en' ? 'Select specific output columns for PID 1234' : 'เลือก column ที่อยากดูสำหรับ PID ที่ระบุ'}</td>
              </tr>
              <tr>
                <td><code>pstree -p</code></td>
                <td>{lang === 'en' ? 'Displays full parent-child process hierarchy as a tree' : 'แสดงเป็น tree ให้เห็น parent-child ทั้งระบบ'}</td>
              </tr>
              <tr>
                <td><code>pgrep -af myapp</code></td>
                <td>{lang === 'en' ? 'Find process by name (-f matches full command line)' : 'หา process โดยใช้ชื่อ -f match ทั้ง command line'}</td>
              </tr>
              <tr>
                <td><code>top</code></td>
                <td>{lang === 'en' ? 'Real-time interactive process viewer (press q to quit)' : 'ดู process แบบ real-time อัปเดตตลอด (กด q เพื่อออก)'}</td>
              </tr>
              <tr>
                <td><code>ss -tln</code></td>
                <td>{lang === 'en' ? 'View active listening TCP ports' : 'ดูว่า port ไหนกำลัง listening อยู่บ้าง'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'PID vs PPID — Two Numbers to Distinguish' : 'PID กับ PPID — สองตัวเลขที่ต้องแยกออก'}</h3>
        <p>
          {lang === 'en' ? 'Every process carries two identification numbers:' : 'ทุกโพรเซสมีหมายเลขประจำตัวสองตัว:'}
        </p>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="compare-card">
            <h4>PID (Process ID)</h4>
            <p>{lang === 'en' ? 'The process own unique ID — used when sending signals or killing it.' : 'หมายเลขประจำตัวของโพรเซสนั้นๆ เอง — ใช้ระบุตอนจะ kill หรือสั่งอะไรเกี่ยวกับมัน'}</p>
          </div>
          <div className="compare-card">
            <h4>PPID (Parent Process ID)</h4>
            <p>{lang === 'en' ? 'The ID of the parent process that created it. Used to trace who launched it.' : 'หมายเลขของโพรเซสที่ "ให้กำเนิด" มัน — ใช้ trace ว่าใครเป็นคนรัน ทำไม ถ้า parent ตาย ลูกอาจตายด้วย'}</p>
          </div>
        </div>
        <Terminal title="sysadmin@lvm68001">
          <span className="ln"><span className="t-user">[~]$</span> <span className="t-cmd">ps -ef | head -3</span></span>
          <span className="ln t-out">UID          PID    PPID  C STIME TTY          TIME CMD</span>
          <span className="ln t-out">root           1       0  0 Aug05 ?        00:00:26 /sbin/init</span>
          <span className="ln t-out t-comment">           ↑PID   ↑PPID&nbsp;&nbsp;&nbsp; PID=1, PPID=0 → No parent → This is systemd!</span>
          <span className="ln t-out">root           2       1  0 Aug05 ?        00:00:00 [kthreadd]</span>
          <span className="ln t-out t-comment">           ↑PID=2  ↑PPID=1 → Parent is systemd</span>
        </Terminal>

        <h3 className="sub-title">{lang === 'en' ? 'Process Tree — Everything hangs on systemd' : 'process tree — ทุกอย่างแขวนอยู่บน systemd'}</h3>
        <p>
          {lang === 'en'
            ? 'pstree -p draws the full hierarchy — every process is a descendant of PID 1 (systemd).'
            : 'pstree -p วาด tree ของทุกโพรเซสในระบบ — จะเห็นว่า ทุกโพรเซสเป็นลูกหลานของ PID 1 (systemd) ทั้งหมด'}
        </p>
        <ProcessTree />

        <h3 className="sub-title">{lang === 'en' ? 'Process States (STAT)' : 'สถานะ (STAT) ของโพรเซส'}</h3>
        <div className="tbl-wrap">
          <table>
            <tbody>
              <tr><th>{lang === 'en' ? 'Code' : 'ตัวอักษร'}</th><th>{lang === 'en' ? 'Meaning' : 'ความหมาย'}</th></tr>
              <tr><td><code>R</code></td><td>Running — {lang === 'en' ? 'Currently using CPU' : 'กำลังใช้ CPU อยู่'}</td></tr>
              <tr><td><code>S</code></td><td>Sleeping — {lang === 'en' ? 'Waiting for events or I/O' : 'นอนรอคำสั่งหรือ event (ปกติของ service ที่ idle)'}</td></tr>
              <tr><td><code>T</code></td><td>Stopped — {lang === 'en' ? 'Suspended (e.g. via Ctrl+Z)' : 'ถูกหยุด (เช่น กด Ctrl+Z) ยังอยู่ในระบบแต่ไม่ทำงาน'}</td></tr>
              <tr><td><code>Z</code></td><td>Zombie — {lang === 'en' ? 'Terminated but parent hasn\'t collected exit code' : 'ตายแล้วแต่ parent ยังไม่ได้ "เก็บ" ค่า exit'}</td></tr>
              <tr><td><code>+</code> (suffix)</td><td>Foreground — {lang === 'en' ? 'Receiving terminal input' : 'อยู่หน้า terminal (รับ input ได้)'}</td></tr>
              <tr><td><code>s</code> (lowercase)</td><td>Session leader — {lang === 'en' ? 'Root of session' : 'เป็นหัวหน้าของ session'}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SECTION 2: DETACHING ── */}
      <section className="lesson" id="detaching">
        <div className="section-kicker"><span className="num">02</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Your Terminal Owns Your Processes' : 'terminal ของคุณเป็นเจ้าของ process ของคุณ'}</h2>
        <p>
          {lang === 'en'
            ? 'Close terminal → processes inside it disappear. Here is how job control and detaching work.'
            : 'ปิด terminal → โพรเซสที่รันอยู่ในนั้นจะหายตามไปด้วย — นี่คือสิ่งที่ต้องเข้าใจและแก้ไข'}
        </p>

        <h3 className="sub-title">{lang === 'en' ? 'Foreground vs Background' : 'Foreground vs Background'}</h3>
        <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="compare-card">
            <h4>Foreground</h4>
            <p>{lang === 'en' ? 'Program receives keyboard input directly. Terminal blocks until it finishes.' : 'โปรแกรมรับ input จาก keyboard ตรงๆ คุณพิมพ์อะไรไม่ได้จนกว่ามันจะจบ — เหมาะกับงานที่ต้องดูผล'}</p>
          </div>
          <div className="compare-card">
            <h4>Background</h4>
            <p>{lang === 'en' ? 'Program runs behind the scenes. Terminal remains usable using &.' : 'ทำงานอยู่ด้านหลัง คุณยังพิมพ์คำสั่งอื่นได้ — ใช้ & ต่อท้ายคำสั่ง'}</p>
          </div>
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Job Control Playground' : 'Job Control Playground — สลับ foreground/background & logout'}</h3>
        <JobControlSimulator />
      </section>

      {/* ── SECTION 3: SIGNALS ── */}
      <section className="lesson" id="signals">
        <div className="section-kicker"><span className="num">03</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Signals — kill Does Not Always Kill' : 'Signals — kill ไม่ได้ kill เสมอไป'}</h2>
        <p>
          {lang === 'en'
            ? 'kill does not directly destroy a process — it delivers a signal message which processes can catch or ignore.'
            : 'kill ไม่ได้ "ฆ่า" process จริงๆ — มันแค่ ส่งข้อความ (signal) ไปบอก — และโปรแกรมสามารถเลือกที่จะ ignore หรือ handle message นั้นได้!'}
        </p>
        <div className="callout warn">
          <span className="tag">{lang === 'en' ? 'Misconception #2' : 'ความเข้าใจผิดอันดับ 2'}</span>
          {lang === 'en'
            ? 'Do not jump straight to kill -9! It denies the process any chance to flush buffers or close DB connections.'
            : 'หลายคนเห็นว่า kill -9 แรงสุดก็ใช้มันก่อนเสมอ — นั่นผิดมาก! โปรแกรมจะไม่ได้รับโอกาสเซฟข้อมูล ปิด connection, หรือ flush ไฟล์ database อาจเสียหาย!'}
        </div>

        <h3 className="sub-title">{lang === 'en' ? 'Interactive Signal Simulator' : 'ทดลองส่ง Signal แบบ interactive'}</h3>
        <SignalSimulator />
      </section>

      {/* ── SECTION 4: SYSTEMD ── */}
      <section className="lesson" id="systemd">
        <div className="section-kicker"><span className="num">04</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Handing Off to systemd — "Running" ≠ "Deployed"' : 'ส่งให้ systemd ดูแล — "รันอยู่" ≠ "Deploy แล้ว"'}</h2>
        <p>
          {lang === 'en'
            ? 'nohup solves part of the problem, but real deployment requires systemd unit files for auto-restarts and boot persistence.'
            : 'nohup แก้ปัญหาได้บางส่วน แต่ยังไม่ใช่ deploy จริงๆ — มีปัญหาหลายอย่างที่ยังอยู่'}
        </p>

        <h3 className="sub-title">{lang === 'en' ? 'Interactive Systemd Lifecycle Builder' : 'สร้าง unit file เอง — ลองแก้และสั่ง Systemctl'}</h3>
        <UnitFileBuilder />
      </section>

      {/* ── SECTION 5: QUIZ ── */}
      <section className="lesson" id="quiz">
        <div className="section-kicker"><span className="num">05</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Self-Test Quiz' : 'ทดสอบความเข้าใจ'}</h2>
        <div id="quizContainer2"></div>
        <div className="quiz-score">
          <span>{lang === 'en' ? 'Your Score' : 'คะแนนของคุณ'}</span>
          <b id="scoreText2">0 / 8</b>
        </div>
      </section>

      {/* ── SECTION 6: CHEATSHEET ── */}
      <section className="lesson" id="cheatsheet">
        <div className="section-kicker"><span className="num">06</span><span className="line"></span></div>
        <h2 className="section-title">{lang === 'en' ? 'Class 2 Cheat Sheet' : 'Cheat Sheet Class 2'}</h2>
        <div className="cheat-grid">
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Inspect Processes' : 'ดูโพรเซส'}</h4>
            <ul>
              <li><code>ps</code><span className="d">{lang === 'en' ? '— current terminal only' : '— เฉพาะ terminal ตัวเอง'}</span></li>
              <li><code>ps aux</code><span className="d">{lang === 'en' ? '— all processes with CPU/MEM' : '— ทุก process พร้อม %CPU %MEM'}</span></li>
              <li><code>ps -ef</code><span className="d">{lang === 'en' ? '— all processes with PPID' : '— ทุก process พร้อม PPID'}</span></li>
              <li><code>pstree -p</code><span className="d">{lang === 'en' ? '— process hierarchy tree' : '— แสดงเป็น tree parent-child'}</span></li>
              <li><code>pgrep -af pattern</code><span className="d">{lang === 'en' ? '— search process by full command' : '— หาด้วยชื่อ (-f = match ทั้ง command line)'}</span></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>{lang === 'en' ? 'Job Control & Detach' : 'Job Control & Detach'}</h4>
            <ul>
              <li><code>cmd &amp;</code><span className="d">{lang === 'en' ? '— run in background' : '— รัน background'}</span></li>
              <li><code>jobs</code><span className="d">{lang === 'en' ? '— list current shell jobs' : '— ดู background jobs ของ shell นี้'}</span></li>
              <li><code>fg / bg</code><span className="d">{lang === 'en' ? '— bring to foreground / resume in bg' : '— ดึง foreground / ปล่อย background'}</span></li>
              <li><code>nohup cmd &amp;</code><span className="d">{lang === 'en' ? '— ignore SIGHUP &amp; log to nohup.out' : '— ignore SIGHUP + output → nohup.out'}</span></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>Signals</h4>
            <ul>
              <li><code>kill &lt;pid&gt;</code><span className="d">{lang === 'en' ? '— send SIGTERM (15) polite request' : '— ส่ง SIGTERM (15) ขอให้ปิดสุภาพ'}</span></li>
              <li><code>kill -9 &lt;pid&gt;</code><span className="d">{lang === 'en' ? '— send SIGKILL (9) forced kill' : '— SIGKILL บังคับ (ใช้เป็น last resort)'}</span></li>
              <li><code>kill -l</code><span className="d">{lang === 'en' ? '— list all 64 signal names' : '— list signal ทั้งหมด 64 ตัว'}</span></li>
            </ul>
          </div>
          <div className="cheat-card">
            <h4>systemd Unit File</h4>
            <ul>
              <li><code>sudo systemctl daemon-reload</code><span className="d">{lang === 'en' ? '— reload disk unit files' : '— โหลด unit file ใหม่จาก disk'}</span></li>
              <li><code>sudo systemctl enable --now svc</code><span className="d">{lang === 'en' ? '— enable auto-start &amp; start now' : '— เปิดใช้ตอนนี้ + บูตอัตโนมัติ'}</span></li>
              <li><code>journalctl -u svc -f</code><span className="d">{lang === 'en' ? '— follow live service logs' : '— follow log แบบ real-time'}</span></li>
            </ul>
          </div>
        </div>

        <div className="callout tip" style={{ marginTop: '24px' }}>
          <span className="tag">{lang === 'en' ? '3 Key Takeaways' : '3 ประโยคที่ต้องจำ'}</span>
          1. <strong>ps alone proves nothing</strong> — Use ps aux or pgrep -af<br />
          2. <strong>kill does not mean instant death</strong> — It sends signals; only SIGKILL (9) forces immediate exit<br />
          3. <strong>Service ≠ Process</strong> — Killing the process does not stop the service if Restart=always is set
        </div>
      </section>

      <div className="foot">
        Class 2 · Managing Processes · INT134 System Deployment 2026 · OrLor Study Guide
      </div>
    </main>
  );
});

export default Class2;
