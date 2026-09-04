import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';

const quizData = [
  {
    q: {
      th: "1. apt install nginx (Ubuntu repo) vs ติดตั้งจาก nginx.org — มีอะไรต่างกันบ้าง?",
      en: "1. 'apt install nginx' (Ubuntu repo) vs installing from nginx.org — what's different?"
    },
    options: [
      {
        t: {
          th: "เหมือนกันทุกอย่าง เวอร์ชันเดียวกัน แค่ดาวน์โหลดมาจากคนละ source",
          en: "Identical in every way, same version, just downloaded from different sources"
        },
        correct: false
      },
      {
        t: {
          th: "เวอร์ชันต่างกัน, โครงสร้างไฟล์ต่างกัน, และไฟล์คอนฟิกเริ่มต้นต่างกัน",
          en: "Different versions, different file layouts, and different default configs"
        },
        correct: true
      },
      {
        t: {
          th: "ต่างกันแค่เวอร์ชันของซอฟต์แวร์เท่านั้น โครงสร้างโฟลเดอร์เหมือนกันหมด",
          en: "Only the software version differs; folder layouts and configs are identical"
        },
        correct: false
      },
    ],
    explain: {
      th: "Ubuntu build แพ็กเกจของตัวเอง ส่วน nginx.org ก็ build ของตัวเอง — จึงได้เวอร์ชันต่างกัน โครงสร้างไดเรกทอรีต่างกัน (/etc/nginx/sites-enabled บน Ubuntu vs /etc/nginx/conf.d บน nginx.org) และ tutorial แต่ละเว็บมักจะสมมติรูปแบบใดรูปแบบหนึ่งไว้โดยไม่ได้บอก!",
      en: "Ubuntu packages one build and nginx.org packages another — different versions, file layouts (/etc/nginx/sites-enabled on Ubuntu vs /etc/nginx/conf.d on nginx.org), and every tutorial assumes one silently."
    }
  },
  {
    q: {
      th: "2. หลังรัน apt install nginx เสร็จสิ้น สถานะ systemctl is-enabled จะเป็นอย่างไร?",
      en: "2. After 'apt install nginx', what is the 'systemctl is-enabled' status?"
    },
    options: [
      {
        t: {
          th: "enabled (ตัว package จะ auto-enable ให้ทันทีตอนติดตั้ง)",
          en: "enabled (the package auto-enables it upon installation)"
        },
        correct: true
      },
      {
        t: {
          th: "disabled (ต้องสั่ง systemctl enable ด้วยตัวเองก่อนเสมอ)",
          en: "disabled (you must manually run systemctl enable first)"
        },
        correct: false
      },
      {
        t: {
          th: "ขึ้นอยู่กับเวอร์ชันของ Ubuntu ว่าจะเปิดหรือไม่",
          en: "Depends on the Ubuntu version"
        },
        correct: false
      },
    ],
    explain: {
      th: "nginx จาก nginx.org จะ auto-enable ตัวเองตอนติดตั้งทันที (is-enabled แสดงเป็น enabled) แต่ตัวมันยังไม่ได้ auto-start — ดังนั้น is-active จะแสดงเป็น inactive! สองสถานะนี้เป็นอิสระต่อกัน",
      en: "nginx from nginx.org auto-enables itself at install. But it does NOT auto-start — so is-active shows inactive! These are two independent states."
    }
  },
  {
    q: {
      th: "3. nginx master process รันในฐานะ user ใด? และ worker processes รันในฐานะ user ใด?",
      en: "3. nginx master process runs as which user? Worker processes as which user?"
    },
    options: [
      {
        t: {
          th: "ทั้ง master และ workers รันเป็น root ทั้งหมด",
          en: "Both master and workers run as root"
        },
        correct: false
      },
      {
        t: {
          th: "ทั้ง master และ workers รันเป็น nginx ทั้งหมด",
          en: "Both master and workers run as nginx"
        },
        correct: false
      },
      {
        t: {
          th: "master รันเป็น root, workers รันเป็น nginx",
          en: "master runs as root, workers run as nginx"
        },
        correct: true
      },
    ],
    explain: {
      th: "Master process ต้อง bind port 80 ซึ่งเป็น privileged port (<1024 ต้องใช้ root) ส่วน worker processes มีหน้าที่อ่านไฟล์และรับส่งข้อมูล connection จริง จะ drop สิทธิ์ root ทันทีเพื่อความปลอดภัย",
      en: "The master binds port 80 (needs root, ports <1024 require root). Workers handle actual file reading and client connections — they drop root immediately for security."
    }
  },
  {
    q: {
      th: "4. curl localhost ใช้งานได้ปกติ แต่เพื่อนเปิดเข้าเว็บจากแล็ปท็อปของเขาไม่ได้ สาเหตุที่น่าจะเป็นไปได้มากที่สุดคืออะไร?",
      en: "4. curl localhost works, but your friend can't open your site from their laptop. What is the MOST LIKELY cause?"
    },
    options: [
      {
        t: {
          th: "nginx ไม่ได้รันอยู่ หรือ service ดับไปแล้ว",
          en: "nginx isn't running"
        },
        correct: false
      },
      {
        t: {
          th: "Firewall บล็อก port 80 — UFW กำลัง active และยังไม่มี rule อนุญาต port 80 เข้ามา",
          en: "Firewall blocking port 80 — UFW is active and no rule allows port 80 in"
        },
        correct: true
      },
      {
        t: {
          th: "ไม่มีไฟล์ HTML อยู่ในเครื่อง",
          en: "The HTML file doesn't exist"
        },
        correct: false
      },
    ],
    explain: {
      th: "curl localhost ตรวจสอบได้ว่า: (1) process รันอยู่ไหม? (2) กำลัง listen อยู่ไหม? ซึ่งถ้า curl สำเร็จคำตอบคือ ใช่ ทั้งคู่ แต่คำถามที่ 3 คือ 'มีเส้นทางจากภายนอกเข้ามาได้หรือไม่' ซึ่งเป็นเรื่องของ Firewall โดยคำสั่ง sudo ufw allow 80/tcp คือวิธีแก้ไข",
      en: "curl localhost checks: (1) is process running? (2) is it listening? Both YES if curl works. The THIRD question — is there a path in from outside — is the firewall. 'sudo ufw allow 80/tcp' is the fix."
    }
  },
  {
    q: {
      th: "5. คำสั่ง ss -tln แสดงข้อมูลอะไร?",
      en: "5. What does 'ss -tln' show?"
    },
    options: [
      {
        t: {
          th: "พอร์ต TCP ใดบ้างที่กำลัง listening อยู่ในปัจจุบัน และผูกอยู่กับ address ใด",
          en: "Which TCP ports are currently listening and on which addresses"
        },
        correct: true
      },
      {
        t: {
          th: "การใช้งาน CPU ของโปรเซสที่กำลังรันทั้งหมด",
          en: "Running process CPU usage"
        },
        correct: false
      },
      {
        t: {
          th: "error logs ล่าสุดของ nginx",
          en: "nginx error logs"
        },
        correct: false
      },
    ],
    explain: {
      th: "ss ย่อมาจาก socket statistics: -t คือ TCP, -l คือ listening sockets เท่านั้น, -n คือ numeric (แสดงเป็นตัวเลข ไม่แปลงเป็นชื่อ service) ทำให้เห็นว่าเปิด 0.0.0.0:80 (รับทุก network interface) หรือ 127.0.0.1 (รับเฉพาะ localhost)",
      en: "ss = socket statistics. -t = TCP, -l = listening only, -n = numeric (don't resolve names). It shows 0.0.0.0:80 (all interfaces) vs 127.0.0.1:something (localhost only)."
    }
  },
  {
    q: {
      th: "6. คุณเขียน server block ใน /etc/nginx/conf.d/site.conf เมื่อผู้ใช้เปิดผ่าน IP address ของ VM กลับได้หน้า default nginx ทำไมถึงเป็นเช่นนั้น?",
      en: "6. You write a server block in /etc/nginx/conf.d/site.conf. A visitor uses your VM's IP address — your site shows the default nginx page, not yours. Why?"
    },
    options: [
      {
        t: {
          th: "คุณลืม reload nginx หลังแก้ไขไฟล์",
          en: "You forgot to reload nginx"
        },
        correct: false
      },
      {
        t: {
          th: "nginx อ่านไฟล์ใน conf.d ตามลำดับตัวอักษร — default.conf มาก่อน site.conf จึงเป็น default server",
          en: "nginx reads conf.d files in alphabetical order — default.conf sorts before site.conf, so it is the default server"
        },
        correct: true
      },
      {
        t: {
          th: "พาธ root directory ในการตั้งค่าระบุไว้ไม่ถูกต้อง",
          en: "Your root directory path is wrong"
        },
        correct: false
      },
    ],
    explain: {
      th: "เมื่อ Host: header ไม่ตรงกับ server_name ใดๆ nginx จะเลือก DEFAULT SERVER ซึ่งก็คือ block แรกสุดที่อ่านพบสำหรับพอร์ตนั้น และเนื่องจาก nginx โหลดไฟล์ตามลำดับตัวอักษร default.conf จึงชนะ site.conf เสมอ",
      en: "When the Host: header doesn't match any server_name, nginx uses the DEFAULT SERVER — which is the FIRST block read for that port. Files are read alphabetically, so default.conf beats site.conf."
    }
  },
  {
    q: {
      th: "7. เพื่อแก้ปัญหาการเลือก server block ข้างต้นโดยไม่ต้องเปลี่ยนชื่อไฟล์ ต้องเติม keyword ใดลงในบรรทัด listen?",
      en: "7. To fix the server block selection problem WITHOUT renaming files — what one keyword do you add to your listen line?"
    },
    options: [
      {
        t: {
          th: "priority (เช่น listen 80 priority;)",
          en: "priority (e.g. listen 80 priority;)"
        },
        correct: false
      },
      {
        t: {
          th: "first (เช่น listen 80 first;)",
          en: "first (e.g. listen 80 first;)"
        },
        correct: false
      },
      {
        t: {
          th: "default_server (เช่น listen 80 default_server;)",
          en: "default_server (e.g., listen 80 default_server;)"
        },
        correct: true
      },
    ],
    explain: {
      th: "'listen 80 default_server;' เป็นการประกาศอย่างชัดเจนว่าให้ block นี้เป็น fallback สำหรับทุก Host: header ที่ไม่มี block อื่นรับ โดยพอร์ตเดียวกันสามารถระบุได้เพียง block เดียวเท่านั้น",
      en: "'listen 80 default_server;' explicitly declares this block as the fallback for any Host: header that no other block claims. Only ONE block per port can declare this."
    }
  },
  {
    q: {
      th: "8. ความแตกต่างระหว่างคำสั่ง nginx -t กับ systemctl reload nginx คืออะไร?",
      en: "8. What is the DIFFERENCE between 'nginx -t' and 'systemctl reload nginx'?"
    },
    options: [
      {
        t: {
          th: "nginx -t ใช้ทดสอบคอนฟิกเท่านั้น (ปลอดภัย ไม่กระทบการทำงาน) ส่วน reload นำคอนฟิกไปปรับใช้กับเซิร์ฟเวอร์ที่รันอยู่",
          en: "'nginx -t' only TESTS the config (safe, touching nothing). 'reload' applies it to the running server."
        },
        correct: true
      },
      {
        t: {
          th: "ทั้งสองคำสั่งทำงานเหมือนกันทุกประการ",
          en: "They do the same thing"
        },
        correct: false
      },
      {
        t: {
          th: "nginx -t นำการเปลี่ยนแปลงไปใช้งานจริง ส่วน reload แค่ตรวจสอบสถานะ",
          en: "nginx -t applies changes, reload just checks"
        },
        correct: false
      },
    ],
    explain: {
      th: "ควรสั่ง nginx -t ก่อน reload เสมอ หาก reload ด้วยคอนฟิกที่ผิดพลาด nginx จะยังคงรันคอนฟิกเก่าต่อไป แต่หากสั่ง restart ด้วยคอนฟิกที่ผิดพลาด เซิร์ฟเวอร์จะดับไปเลยและไม่มี web server ทำงานอยู่! nginx -t จะช่วยป้องกันปัญหานี้",
      en: "Always run 'nginx -t' BEFORE 'reload'. A reload with broken config keeps the old config running. A RESTART with broken config leaves you with NO web server at all. nginx -t saves you from that disaster."
    }
  },
];

const Quiz3 = () => {
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
      <p id="scoreText3">{score} / {quizData.length}</p>
    </>
  );
};

export default Quiz3;
