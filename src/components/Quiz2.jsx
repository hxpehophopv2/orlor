import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';

const quizData = [
  {
    q: {
      th: "1. พิมพ์ ps แค่นั้นเฉยๆ จะเห็นโพรเซสกี่ตัว?",
      en: "1. Running just 'ps' alone, how many processes will you see?"
    },
    options: [
      {
        t: { th: "ทุกโพรเซสในเครื่อง (100+ ตัว)", en: "Every process on the system (100+ processes)" },
        correct: false
      },
      {
        t: { th: "แค่โพรเซสที่รันบน terminal ของตัวเอง (2-3 ตัวเท่านั้น)", en: "Only processes attached to your own terminal (just 2-3 processes)" },
        correct: true
      },
      {
        t: { th: "ทุกโพรเซสของ user ปัจจุบัน", en: "All processes belonging to the current user" },
        correct: false
      },
    ],
    explain: {
      th: "ps เฉยๆ จะแสดงเฉพาะโพรเซสที่ผูกกับ terminal ของตัวเอง เช่น bash กับ ps เอง — บนเครื่องที่มี 100+ โพรเซสคุณจะเห็นแค่ 2 ตัว! ถ้าอยากเห็นทั้งหมดต้องใช้ ps aux หรือ ps -ef",
      en: "Just running 'ps' only shows processes tied to your current terminal (like bash and ps itself). On a system with 100+ processes, you'll only see 2! Use 'ps aux' or 'ps -ef' to view all processes."
    }
  },
  {
    q: {
      th: "2. รัน ./myapp & แล้ว exit ออก session — app ยังรันอยู่ไหม? (ค่า default ของ bash ทั่วไป)",
      en: "2. Running './myapp &' and exiting the session — is app still running? (default bash behavior)"
    },
    options: [
      {
        t: { th: "ไม่รัน — เพราะ shell ปิด SIGHUP จะถูกส่งไปยัง child ที่เป็น background job", en: "No — when shell closes, SIGHUP is sent to background child jobs" },
        correct: true
      },
      {
        t: { th: "ยังรันอยู่ — เพราะ & ทำให้เป็น background ซึ่งรอดจาก logout", en: "Yes — because & makes it background which survives logout" },
        correct: false
      },
      {
        t: { th: "ขึ้นอยู่กับ RAM ว่าเหลือพอไหม", en: "Depends on whether enough RAM is remaining" },
        correct: false
      },
    ],
    explain: {
      th: "โดย default bash จะส่ง SIGHUP ไปยัง background jobs ตอน exit ดังนั้น myapp จะตาย! ยกเว้นถ้าใช้ nohup ./myapp & หรือกำหนด shopt -s huponexit ก่อน",
      en: "By default, bash dispatches SIGHUP to background jobs on exit, so myapp terminates! Unless you use 'nohup ./myapp &' or configure 'shopt -s huponexit'."
    }
  },
  {
    q: {
      th: "3. kill 12345 ส่ง signal อะไร?",
      en: "3. What signal does 'kill 12345' send?"
    },
    options: [
      {
        t: { th: "SIGKILL (9) — หยุดทันทีบังคับโดย kernel", en: "SIGKILL (9) — Instant forced kill by kernel" },
        correct: false
      },
      {
        t: { th: "SIGTERM (15) — ขอให้ปิดตัวเองอย่างสุภาพ", en: "SIGTERM (15) — Politely request process termination" },
        correct: true
      },
      {
        t: { th: "SIGHUP (1) — แจ้งว่า terminal หายไปแล้ว", en: "SIGHUP (1) — Inform that terminal is hung up" },
        correct: false
      },
    ],
    explain: {
      th: "kill โดยไม่ระบุหมายเลขจะส่ง SIGTERM (15) ซึ่งเป็นการ 'ขอร้องให้ปิดตัว' โปรแกรมสามารถรับ SIGTERM แล้วเลือกที่จะเซฟงานก่อนปิด หรือแม้แต่ ignore ได้! SIGKILL คือตัวที่บังคับจริงๆ",
      en: "Running kill without specifying a signal number sends SIGTERM (15), which is a polite request. The application can catch SIGTERM to save data or even ignore it! SIGKILL is the uncatchable forced kill."
    }
  },
  {
    q: {
      th: "4. signal ไหนที่โปรแกรมไม่สามารถ catch, block, หรือ ignore ได้เลย?",
      en: "4. Which signal CANNOT be caught, blocked, or ignored by any process?"
    },
    options: [
      { t: { th: "SIGTERM (15)", en: "SIGTERM (15)" }, correct: false },
      { t: { th: "SIGHUP (1)", en: "SIGHUP (1)" }, correct: false },
      { t: { th: "SIGKILL (9)", en: "SIGKILL (9)" }, correct: true },
    ],
    explain: {
      th: "SIGKILL (9) คือสัญญาณที่ kernel บังคับใช้โดยตรง โปรแกรมไม่มีทางหลีกเลี่ยงได้ ดังนั้นควรใช้เป็น last resort เพราะโปรแกรมไม่ได้รับโอกาสเซฟงานหรือปิด connection อย่างถูกต้อง",
      en: "SIGKILL (9) is handled directly by the kernel. The process cannot avoid or catch it, so use it as a last resort since the process gets no chance to save state or close connections."
    }
  },
  {
    q: {
      th: "5. ทำไม systemctl stop บางทีรอนาน 90 วินาทีก่อนจะหยุด?",
      en: "5. Why does 'systemctl stop' sometimes wait up to 90 seconds before stopping?"
    },
    options: [
      { t: { th: "เพราะ systemd มีบัค", en: "Because systemd has a bug" }, correct: false },
      {
        t: { th: "เพราะส่ง SIGTERM ก่อน — รอให้โปรแกรมปิดตัวเองอย่างถูกต้อง แล้วค่อย SIGKILL ถ้าไม่ยอม", en: "Because it sends SIGTERM first — waiting for graceful exit before sending SIGKILL" },
        correct: true
      },
      { t: { th: "เพราะ server มีคนเชื่อมต่ออยู่", en: "Because external clients are still connected to the server" }, correct: false },
    ],
    explain: {
      th: "systemd ส่ง SIGTERM ก่อน แล้วรอ 90 วินาทีเพื่อให้เซอร์วิสมีเวลาปิดตัวเองอย่างถูกต้อง (เซฟ file, ปิด connection) ถ้ายังไม่ยอม จึงใช้ SIGKILL บังคับ — นี่คือพฤติกรรมที่ถูกต้อง ไม่ใช่บัค!",
      en: "systemd sends SIGTERM first and waits up to 90 seconds for graceful cleanup (flushing files, ending active connections). If it refuses to stop, systemd falls back to SIGKILL. This is intended behavior, not a bug!"
    }
  },
  {
    q: {
      th: "6. systemctl enable ทำอะไร? ต่างจาก systemctl start อย่างไร?",
      en: "6. What does 'systemctl enable' do compared to 'systemctl start'?"
    },
    options: [
      {
        t: { th: "enable = เปิดทำงานตอนนี้เลย, start = กำหนดให้เปิดตอนบูต", en: "enable = start now, start = set to start on boot" },
        correct: false
      },
      {
        t: { th: "enable = กำหนดให้เปิดตอนบูตอัตโนมัติ, start = เปิดทำงานตอนนี้เลย", en: "enable = configure auto-start on boot, start = start running right now" },
        correct: true
      },
      { t: { th: "ทั้งสองอย่างทำสิ่งเดียวกัน", en: "Both commands perform the exact same action" }, correct: false },
    ],
    explain: {
      th: "enable สร้าง symlink ใน multi-user.target.wants/ เพื่อบอก systemd ว่า 'บูตครั้งหน้าให้เปิดตัวนี้ด้วย' แต่ไม่ได้เปิดตอนนี้! start เปิดทำงานทันทีแต่ไม่ได้ทำให้ persistent หลัง reboot — ต้องใช้ enable --now เพื่อทำทั้งสองอย่างพร้อมกัน",
      en: "enable creates a symlink in multi-user.target.wants/ telling systemd to start the service on next boot (it doesn't start it immediately). start launches it now, but isn't persistent across reboots. Use 'enable --now' for both!"
    }
  },
  {
    q: {
      th: "7. kill process ที่ systemd ดูแลอยู่ — Main PID จะเปลี่ยนไปไหม?",
      en: "7. If you kill a process managed by systemd, will the Main PID change?"
    },
    options: [
      { t: { th: "ไม่เปลี่ยน — PID เดิมถูก restart", en: "No — the original PID is restarted" }, correct: false },
      { t: { th: "เปลี่ยน — เพราะ systemd spawn process ใหม่ (PID ใหม่)", en: "Yes — because systemd spawns a NEW process with a new PID" }, correct: true },
      { t: { th: "service จะหยุดทำงานเพราะ process ตาย", en: "The service stops because its process died" }, correct: false },
    ],
    explain: {
      th: "เมื่อ process ตาย systemd จะ spawn process ใหม่ทดแทน (Restart=always) ซึ่งจะได้ PID ใหม่! นี่คือประเด็นสำคัญ: 'The service is NOT the process' — service ยังคง active แม้ process จะถูก kill",
      en: "When the process dies, systemd spawns a new replacement process (Restart=always) with a new PID! Key takeaway: 'The service is NOT the process' — the service remains Active even if its process is killed."
    }
  },
  {
    q: {
      th: "8. nohup ./myapp & ทำสองอย่างต่างกันอย่างไรบ้าง?",
      en: "8. What 2 distinct actions does 'nohup ./myapp &' perform?"
    },
    options: [
      { t: { th: "แค่ทำให้รัน background เหมือน & ปกติ", en: "Just runs it in background like normal &" }, correct: false },
      {
        t: { th: "1) ทำให้ ignore SIGHUP  2) redirect stdout ไปที่ nohup.out", en: "1) Ignores SIGHUP signal  2) Redirects stdout to nohup.out file" },
        correct: true
      },
      { t: { th: "ทำให้รัน foreground โดยไม่มี SIGHUP", en: "Runs in foreground without SIGHUP" }, correct: false },
    ],
    explain: {
      th: "nohup ทำสองอย่างแยกกัน: (1) ตั้ง SIGHUP ให้ถูก ignore — process รอดจาก logout และ (2) redirect stdout ไปที่ไฟล์ nohup.out เพราะ terminal ที่จะรับ output ไม่มีอีกแล้ว",
      en: "nohup performs two separate actions: (1) configures SIGHUP to be ignored so the process survives logout, and (2) redirects stdout output to nohup.out since the terminal target will disappear."
    }
  },
];

const Quiz2 = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(Array(quizData.length).fill(false));
  const [selections, setSelections] = useState(Array(quizData.length).fill(null));

  const handleSelect = (qIndex, oIndex, isCorrect) => {
    if (answered[qIndex]) return;
    if (isCorrect) setScore(s => s + 1);
    setAnswered(prev => { const n = [...prev]; n[qIndex] = true; return n; });
    setSelections(prev => { const n = [...prev]; n[qIndex] = oIndex; return n; });
  };

  return (
    <>
      <div id="quizContainer2">
        {quizData.map((item, qi) => (
          <div key={qi} className="quiz-card">
            <p className="quiz-q">{item.q[lang]}</p>
            <div className="quiz-options">
              {item.options.map((opt, oi) => {
                const isSelected = selections[qi] === oi;
                let btnClass = '';
                if (answered[qi]) {
                  if (opt.correct) btnClass = 'correct';
                  else if (isSelected) btnClass = 'incorrect';
                }
                return (
                  <button
                    key={oi}
                    className={btnClass}
                    disabled={answered[qi]}
                    onClick={() => handleSelect(qi, oi, opt.correct)}
                  >
                    {opt.t[lang]}
                  </button>
                );
              })}
            </div>
            <div className={`quiz-explain ${answered[qi] ? 'show' : ''}`}>
              {item.explain[lang]}
            </div>
          </div>
        ))}
      </div>
      <p id="scoreText2">{score} / {quizData.length}</p>
    </>
  );
};

export default Quiz2;
