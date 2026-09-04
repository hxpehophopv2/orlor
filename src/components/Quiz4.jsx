import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';

const quizData4 = [
  {
    q: {
      th: "1. หลังติดตั้ง MySQL เสร็จทันที คำสั่ง systemctl is-active mysql จะแสดงผลว่าอย่างไร?",
      en: "1. Immediately after installing MySQL, what did 'systemctl is-active mysql' show?"
    },
    options: [
      {
        t: {
          th: "inactive (ติดตั้งเสร็จแล้วแต่ยังไม่เริ่มทำงาน ต้องสั่ง start เอง)",
          en: "inactive (installed but not running yet, requires manual start)"
        },
        correct: false
      },
      {
        t: {
          th: "active (MySQL จะ auto-start ทำงานทันทีหลังติดตั้ง ต่างจาก nginx)",
          en: "active (MySQL auto-starts immediately upon installation, unlike nginx)"
        },
        correct: true
      },
      {
        t: {
          th: "ขึ้นอยู่กับเวอร์ชันของ Ubuntu ว่าจะเริ่มทำงานทันทีหรือไม่",
          en: "Depends on the Ubuntu version whether it starts immediately"
        },
        correct: false
      },
    ],
    explain: {
      th: "MySQL จาก package ของ Ubuntu จะ auto-enable และ auto-start ตัวเองทันทีตอนติดตั้ง ในขณะที่ nginx จาก nginx.org จะแค่ auto-enable แต่คงสถานะเป็น inactive! คนแพ็กเกจคนละกลุ่ม ย่อมตัดสินใจคนละแบบ — จึงควรตรวจเช็คทั้ง is-enabled และ is-active แยกกันเสมอ",
      en: "MySQL from Ubuntu packages auto-enables AND auto-starts itself. nginx.org's nginx only auto-enabled but stayed inactive. Two packagers, two decisions — always check both is-enabled and is-active separately."
    }
  },
  {
    q: {
      th: "2. คำสั่ง ss -tln แสดงว่า MySQL กำลัง listen อยู่ที่ 127.0.0.1:3306 จำเป็นต้องตั้งกฎ UFW firewall เพื่อให้แอป Node.js เชื่อมต่อได้หรือไม่?",
      en: "2. 'ss -tln' shows MySQL is listening on 127.0.0.1:3306. Does MySQL need a UFW firewall rule so your Node.js app can connect to it?"
    },
    options: [
      {
        t: {
          th: "จำเป็น เพราะ UFW ต้องมีกฎอนุญาตสำหรับทุกพอร์ตที่ถูกเรียกใช้งานเสมอ",
          en: "Yes, UFW always needs a rule for any port"
        },
        correct: false
      },
      {
        t: {
          th: "ไม่จำเป็น — ทั้งสองโปรเซสรันอยู่บนเครื่องเดียวกัน การเชื่อมต่อไม่ผ่านเน็ตเวิร์ก ไฟร์วอลล์จึงไม่เห็นทราฟฟิกนี้",
          en: "No — both are on the same machine; the connection never touches the network, so the firewall doesn't see it"
        },
        correct: true
      },
      {
        t: {
          th: "จำเป็น เพราะต้องเปิดพอร์ต 3306 ให้ระบบอนุญาตการส่งข้อมูล",
          en: "Yes, because port 3306 must be opened"
        },
        correct: false
      },
    ],
    explain: {
      th: "127.0.0.1 = loopback = ข้อมูลวนอยู่เฉพาะภายในเครื่องเท่านั้น OS จัดการให้โดยไม่ผ่านการ์ดเน็ตเวิร์กใดๆ กฎของไฟร์วอลล์มีผลกับทราฟฟิกที่ผ่านเข้า/ออกทาง network interface จริงเท่านั้น หากใช้ 0.0.0.0 หมายถึงทุกคนสามารถลองเชื่อมต่อเข้ามาได้ — นั่นคือเหตุผลที่ MySQL bind กับ 127.0.0.1 เป็นค่าเริ่มต้น",
      en: "127.0.0.1 = loopback = stays inside the machine. The OS handles it without going through any network card. Firewall rules only matter for traffic that physically enters/leaves through a network interface. 0.0.0.0 would mean everyone can try — that's why MySQL binds to 127.0.0.1 by default."
    }
  },
  {
    q: {
      th: "3. คำสั่ง sudo mysql เข้าใช้งานได้โดยไม่ต้องใส่รหัสผ่าน แต่ mysql (ไม่ใช้ sudo) กลับได้ ERROR 1045 เพราะเหตุใด?",
      en: "3. 'sudo mysql' works with no password. 'mysql' (without sudo) gives ERROR 1045. Why?"
    },
    options: [
      {
        t: {
          th: "เพราะยังไม่ได้ตั้งรหัสผ่านสำหรับ root ใน MySQL",
          en: "The password was not set yet"
        },
        correct: false
      },
      {
        t: {
          th: "บัญชี admin ของ MySQL ผูกกับ Linux root user — การเป็น root บนเครื่องคือ credential เมื่อต่อโดยไม่ใช้ sudo คุณคือ 'sysadmin' ซึ่งไม่มี user นี้ใน MySQL",
          en: "MySQL's admin account is tied to the Linux root user — being root on this machine IS the credential. Connecting without sudo means you're just 'sysadmin', who doesn't exist in MySQL."
        },
        correct: true
      },
      {
        t: {
          th: "MySQL service ยังไม่ได้รัน จึงเชื่อมต่อแบบปกติไม่ได้",
          en: "MySQL is not running yet"
        },
        correct: false
      },
    ],
    explain: {
      th: "นี่คือกลไกของปลั๊กอิน 'auth_socket' (unix_socket) เมื่อคุณรัน sudo mysql คุณมีสิทธิ์เป็น root ใน OS ซึ่ง MySQL จะเชื่อถือทันที Error 1045 หมายถึง 'ไม่รู้จักว่าคุณคือใคร' — Linux user ชื่อ sysadmin ไม่ได้มีบัญชีอยู่ใน MySQL แอปพลิเคชันของคุณไม่สามารถใช้วิธีนี้ได้ จึงต้องสร้าง MySQL user แยกต่างหากพร้อมรหัสผ่านจริง",
      en: "This is called the 'unix_socket' auth plugin. When you run sudo mysql, you're root in the OS, and MySQL trusts that. Error 1045 means 'I don't know who you are' — the sysadmin Linux user is simply not a MySQL user. Your application CANNOT use this method; it needs its own MySQL user with a real password."
    }
  },
  {
    q: {
      th: "4. ทำไมจึงควรใช้ IDENTIFIED BY RANDOM PASSWORD แทนการตั้งรหัสผ่านเองสำหรับ MySQL user?",
      en: "4. Why use 'IDENTIFIED BY RANDOM PASSWORD' instead of picking your own password for the MySQL user?"
    },
    options: [
      {
        t: {
          th: "รหัสผ่านสุ่ม 20 ตัวอักษรเดาหรือจำไม่ได้ และเป็นไปไม่ได้ที่จะถูกนำไปใช้ซ้ำในที่อื่น",
          en: "A random 20-char password is impossible to guess or memorize — and impossible to reuse in another place"
        },
        correct: true
      },
      {
        t: {
          th: "เป็นข้อกำหนดของไวยากรณ์ MySQL สำหรับผู้ใช้ใหม่",
          en: "It's required by MySQL syntax"
        },
        correct: false
      },
      {
        t: {
          th: "ใช้สำหรับสภาพแวดล้อม Development เท่านั้น",
          en: "It's only for development environments"
        },
        correct: false
      },
    ],
    explain: {
      th: "รหัสผ่านที่คุณคิดขึ้นเองมักจะถูกนำไปใช้ซ้ำ ย่อให้สั้นลงเพื่อให้จำง่าย หรือเผลอพิมพ์ผิดหน้าต่าง แต่รหัสผ่านสุ่ม 20 ตัวอักษรจะถูกบันทึกไว้ในไฟล์เดียว (.env) บนเครื่องเดียวเท่านั้น ไม่มีใครต้องจำ และอยู่เฉพาะที่ที่มันควรอยู่ ซึ่งเป็นลักษณะที่ถูกต้องของ service credential",
      en: "A password YOU invent for a service is one you'll reuse, shorten so you can remember it, or type in the wrong window. A 20-character random password goes into exactly ONE file on ONE machine. Nobody memorizes it. It lives where it belongs and nowhere else. That's what a service credential should look like."
    }
  },
  {
    q: {
      th: "5. คุณใส่ค่าใน .env เป็น DATABASE_URL=\"mysql://school:${SCHOOL_PASSWORD}@127.0.0.1:3306/school\" เมื่อ systemd สตาร์ทแอปกลับล้มเหลว เพราะเหตุใด?",
      en: "5. You put the password in .env as DATABASE_URL=\"mysql://school:${SCHOOL_PASSWORD}@127.0.0.1:3306/school\". systemd starts the app and it fails. Why?"
    },
    options: [
      {
        t: {
          th: "รูปแบบ URL ไม่ถูกต้อง",
          en: "The URL format is wrong"
        },
        correct: false
      },
      {
        t: {
          th: "ฐานข้อมูล MySQL ไม่ได้รันอยู่",
          en: "The database is not running"
        },
        correct: false
      },
      {
        t: {
          th: "systemd ไม่ได้ expand ค่าตัวแปร ${SCHOOL_PASSWORD} — มันส่งข้อความตรงๆ '${SCHOOL_PASSWORD}' ไปเป็นรหัสผ่านให้กับแอป",
          en: "systemd does NOT expand ${SCHOOL_PASSWORD} — it passes the literal string ${SCHOOL_PASSWORD} to the app as the password"
        },
        correct: true
      },
    ],
    explain: {
      th: "Prisma CLI จะ expand ค่า ${VAR} ให้เมื่อคุณรันเอง แต่ systemd อ่านจาก EnvironmentFile= และส่งค่าไปแบบตรงตัว (literal) โดยไม่มีการขยายตัวแปร ทำให้แอปพยายามเชื่อมต่อด้วยรหัสผ่าน '${SCHOOL_PASSWORD}' ซึ่ง MySQL ปฏิเสธ จึงต้องใส่ค่ารหัสผ่านจริงลงใน .env ไม่ใช่การอ้างอิงตัวแปร ปัญหานี้เป็นแพตเทิร์น 'ทำงานได้ตอนเทสต์ แต่พังบนโปรดักชัน' ที่พบบ่อยมาก",
      en: "Prisma CLI expands ${VAR} when YOU run it. systemd reads EnvironmentFile= and passes values literally — no expansion. So the app tries to connect with the password ${SCHOOL_PASSWORD} which MySQL rejects. Put the actual password value in .env, not a variable reference. This 'works in testing, fails in production' pattern is one of the nastiest bugs."
    }
  },
  {
    q: {
      th: "6. เมื่อคุณรันคำสั่ง npx prisma migrate dev --name init แล้วพบข้อผิดพลาดเกี่ยวกับ shadow database เกิดอะไรขึ้น?",
      en: "6. You run 'npx prisma migrate dev --name init' and get an error about a shadow database. What's wrong?"
    },
    options: [
      {
        t: {
          th: "การตั้งค่าของคุณไม่มีอะไรผิด — migrate dev เป็นคำสั่งของนักพัฒนาที่ต้องใช้สิทธิ์สร้างฐานข้อมูล (CREATE DATABASE) ซึ่ง least-privilege user ของคุณไม่มีสิทธิ์นั้น และนั่นถูกต้องแล้ว",
          en: "Nothing is wrong with your setup — 'migrate dev' is a DEVELOPER's command that needs permission to CREATE databases. Your least-privilege user can't do that, and that's correct."
        },
        correct: true
      },
      {
        t: {
          th: "database schema ยังไม่ถูกสร้างขึ้นมาในระบบ",
          en: "The database schema hasn't been created yet"
        },
        correct: false
      },
      {
        t: {
          th: "รหัสผ่านของ database user ไม่ถูกต้อง",
          en: "The user's password is wrong"
        },
        correct: false
      },
    ],
    explain: {
      th: "migrate dev จะพยายามสร้างฐานข้อมูลชั่วคราว (scratch copy) เพื่อดูว่ามีอะไรเปลี่ยนแปลงไปบ้าง ซึ่งต้องใช้สิทธิ์ CREATE DATABASE แต่คุณได้จำกัดสิทธิ์ user ไว้แค่ฐานข้อมูลเดียว (school.*) ในพาร์ท 2 อย่างถูกต้องแล้ว วิธีแก้ไม่ใช่การให้สิทธิ์เพิ่ม แต่ควรใช้คำสั่ง prisma migrate diff ซึ่งทำหน้าที่แค่อ่านเท่านั้น อีกทั้งคุณสร้าง schema จาก schema.sql ไปเรียบร้อยแล้ว จึงไม่มีอะไรต้อง migrate",
      en: "migrate dev builds a temporary scratch copy of your database to work out what changed. That requires CREATE DATABASE permission. You scoped the user to ONE database (school.*) in Part 2, correctly. The fix is NOT to grant more permissions — the right command is prisma migrate diff which only READS. You already built the schema from schema.sql, so there's nothing to migrate anyway."
    }
  },
  {
    q: {
      th: "7. วิธีที่ถูกต้องในการรัน percent-encoding รหัสผ่าน MySQL ก่อนนำไปใส่ใน DATABASE_URL คือวิธีใด?",
      en: "7. What is the correct way to run percent-encoding on the MySQL password before putting it in DATABASE_URL?"
    },
    options: [
      {
        t: {
          th: "เพียงแค่ครอบรหัสผ่านด้วยเครื่องหมายคำพูด (double quotes)",
          en: "Just wrap it in double quotes"
        },
        correct: false
      },
      {
        t: {
          th: "python3 -c 'import urllib.parse; print(urllib.parse.quote(\"p@ss:w/rd\", safe=\"\"))' → ได้ผลลัพธ์เป็น p%40ss%3Aw%2Frd",
          en: "python3 -c 'import urllib.parse; print(urllib.parse.quote(\"p@ss:w/rd\", safe=\"\"))' → gives p%40ss%3Aw%2Frd"
        },
        correct: true
      },
      {
        t: {
          th: "ใช้ urlencode เฉพาะเมื่อรหัสผ่านมีเว้นวรรค (spaces) เท่านั้น",
          en: "Use urlencode only if the password contains spaces"
        },
        correct: false
      },
    ],
    explain: {
      th: "URL มีโครงสร้าง: mysql://USER:PASSWORD@HOST:PORT/DB ตัวอักษรอย่าง /, @, :, % ล้วนมีความหมายพิเศษใน URL รหัสผ่าน 20 ตัวอักษรที่ระบบสุ่มขึ้นมามีโอกาสสูงที่จะมีตัวอักษรเหล่านี้ โดยเฉลี่ย 1 ใน 5 ของรหัสผ่านที่สุ่มได้จะพังเพราะมีเครื่องหมาย / จึงควรเข้ารหัส (encode) เสมอ แม้ว่ารหัสผ่านปัจจุบันของคุณจะใช้ได้โดยไม่ต้อง encode แต่รหัสผ่านถัดไปอาจไม่รอด",
      en: "A URL has structure: mysql://USER:PASSWORD@HOST:PORT/DB. The characters /, @, :, % all have special meaning in URLs. A generated 20-char password can easily contain these. 1 in 5 generated passwords break because of /. Always encode — even if yours worked without it, the next one might not."
    }
  },
  {
    q: {
      th: "8. หลังจากรัน sudo systemctl restart school-api แล้วเรียก GET /api/students ข้อมูลนักเรียนที่คุณเพิ่มเข้าไปจะยังอยู่ในฐานข้อมูลหรือไม่?",
      en: "8. After you run 'sudo systemctl restart school-api' and call 'GET /api/students' — is the student you added still in the database?"
    },
    options: [
      {
        t: {
          th: "ไม่อยู่ — การ restart จะเคลียร์ state ของแอปพลิเคชันทิ้งเสมอ",
          en: "No — restarting always clears application state"
        },
        correct: false
      },
      {
        t: {
          th: "ขึ้นอยู่กับว่าตัวแอปมีการทำ caching ไว้หรือไม่",
          en: "Depends on whether the app has caching"
        },
        correct: false
      },
      {
        t: {
          th: "ยังอยู่ — ข้อมูลอยู่ใน MySQL ไม่ได้อยู่ในโปรเซสของ Node.js การรีสตาร์ทแอปจึงไม่กระทบกับข้อมูลในฐานข้อมูล",
          en: "Yes — the data lives in MySQL, not in the Node.js process. Restarting the app process doesn't touch the database."
        },
        correct: true
      },
    ],
    explain: {
      th: "นี่คือจุดประสงค์หลักของการมีฐานข้อมูล! ฐานข้อมูลคือโปรเซสแยกต่างหากที่รันบนพอร์ต 3306 ซึ่งทำหน้าที่จำข้อมูลไว้อย่างถาวร แอป Node.js ของคุณเป็นเพียงแค่ CLIENT ที่เชื่อมต่อไปหา MySQL คุณจะสั่ง kill หรือ restart Node.js กี่ครั้ง MySQL ก็ยังคงเก็บข้อมูลไว้ นี่คือความแตกต่างระหว่าง \"website\" (Class 3) และ \"application\" (Class 4)",
      en: "This is the whole point of a database. A database is a SEPARATE process on port 3306 that remembers things permanently. Your Node.js app is just a CLIENT of MySQL. Kill and restart Node.js all you want — MySQL holds the data. This is the difference between a 'website' (Class 3) and an 'application' (Class 4)."
    }
  },
];

const Quiz4 = () => {
  const { currentLang } = useI18n();
  const lang = currentLang === 'en' ? 'en' : 'th';
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(Array(quizData4.length).fill(false));
  const [selections, setSelections] = useState(Array(quizData4.length).fill(null));

  const handleSelect = (qIndex, oIndex, isCorrect) => {
    if (answered[qIndex]) return;
    if (isCorrect) setScore(s => s + 1);
    setAnswered(prev => { const n = [...prev]; n[qIndex] = true; return n; });
    setSelections(prev => { const n = [...prev]; n[qIndex] = oIndex; return n; });
  };

  return (
    <>
      {quizData4.map((item, qi) => (
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
      <p id="scoreText4">{score} / {quizData4.length}</p>
    </>
  );
};

export default Quiz4;
