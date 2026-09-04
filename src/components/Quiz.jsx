import React, { useState } from 'react';

const quizData = [
  {
    q: "1. login ด้วยบัญชี sysadmin แล้วพิมพ์ sudo who am i จะได้ผลลัพธ์เป็นอะไร?",
    options: [
      {t:"root", correct:false},
      {t:"sysadmin", correct:true},
      {t:"error: permission denied", correct:false}
    ],
    explain: "who am i ดูว่า 'ใคร login เข้า terminal จริงๆ' ไม่สนใจสิทธิ์ที่ขอยืมผ่าน sudo จึงตอบว่า sysadmin เสมอ ต่างจาก sudo id หรือ sudo whoami ที่จะตอบว่า root เพราะดูสิทธิ์ปัจจุบันที่ใช้งานอยู่"
  },
  {
    q: "2. สร้างโฟลเดอร์ด้วย sudo mkdir แล้วพบว่าเขียนไฟล์ลงไปไม่ได้ (Permission denied) เพราะอะไร?",
    options: [
      {t:"โฟลเดอร์เสีย ต้องสร้างใหม่", correct:false},
      {t:"เจ้าของโฟลเดอร์กลายเป็น root เพราะสร้างด้วยสิทธิ์ root", correct:true},
      {t:"ลืม chmod +x ให้โฟลเดอร์", correct:false}
    ],
    explain: "เมื่อสร้างไฟล์/โฟลเดอร์ด้วย sudo ระบบจะให้ root เป็นเจ้าของทันที เราซึ่งเป็นผู้ใช้ทั่วไปจึงเขียนต่อไม่ได้ ต้องใช้ sudo chown เพื่อยกกรรมสิทธิ์กลับมาเป็นของตัวเอง"
  },
  {
    q: "3. sudo usermod -G newgroup test (ไม่มี -a) จะเกิดอะไรขึ้นกับกลุ่มเดิมของ test?",
    options: [
      {t:"เพิ่มเข้า newgroup โดยกลุ่มเดิมยังอยู่ครบ", correct:false},
      {t:"secondary group เดิมทั้งหมดถูกเขียนทับหายไป", correct:true},
      {t:"คำสั่งจะ error เพราะไม่มี -a", correct:false}
    ],
    explain: "ไม่มี -a (append) เท่ากับสั่งให้ 'แทนที่' secondary group ทั้งหมดด้วย newgroup อย่างเดียว กลุ่มอื่นที่เคยอยู่จะหายไปหมด ต้องมี -a เสมอถ้าต้องการแค่เพิ่ม"
  },
  {
    q: "4. apt update ทำอะไร?",
    options: [
      {t:"ติดตั้งเวอร์ชันใหม่ของทุกโปรแกรมทันที", correct:false},
      {t:"แค่รีเฟรชข้อมูลว่าคลังมีอะไรใหม่บ้าง ไม่ติดตั้งอะไรเลย", correct:true},
      {t:"ลบแพ็กเกจที่ไม่ได้ใช้งานแล้ว", correct:false}
    ],
    explain: "apt update แค่ไปอัปเดต 'รายการ meta-data' ว่ามีเวอร์ชันใหม่อะไรบ้างในคลัง ไม่ได้ติดตั้งหรือเปลี่ยนแปลงโปรแกรมที่มีอยู่เลย ตัวที่ติดตั้งจริงคือ apt install หรือ upgrade"
  },
  {
    q: "5. สั่ง sudo systemctl disable cron ตอนที่ cron กำลัง active อยู่ เช็คสถานะทันทีจะเห็นอะไร?",
    options: [
      {t:"active — เพราะ disable ไม่ได้หยุดโพรเซสที่รันอยู่ตอนนี้", correct:true},
      {t:"inactive — เพราะ disable ทำให้หยุดทำงานทันที", correct:false}
    ],
    explain: "disable ควบคุมแค่ 'จะเปิดตอนบูตครั้งหน้าไหม' เท่านั้น ไม่ได้ไปแตะสถานะการทำงานปัจจุบันเลย เซอร์วิสจึงยัง active อยู่จนกว่าจะสั่ง stop หรือ reboot เครื่อง"
  },
  {
    q: "6. ต้องการแก้ไฟล์ config ของเซอร์วิสแล้วให้มีผลโดยไม่ตัดการเชื่อมต่อที่ผู้ใช้กำลังใช้งานอยู่ ควรใช้คำสั่งไหน?",
    options: [
      {t:"systemctl restart", correct:false},
      {t:"systemctl reload", correct:true},
      {t:"systemctl disable แล้ว enable ใหม่", correct:false}
    ],
    explain: "reload สั่งให้เซอร์วิสอ่าน config ใหม่โดยไม่ต้องปิดตัวเองก่อน การเชื่อมต่อที่มีอยู่จึงไม่หลุด ต่างจาก restart ที่ปิดแล้วเปิดใหม่ทั้งหมด"
  }
];

const Quiz = () => {
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(Array(quizData.length).fill(false));
  const [selections, setSelections] = useState(Array(quizData.length).fill(null));

  const handleSelect = (qIndex, oIndex, isCorrect) => {
    if (answered[qIndex]) return;

    if (isCorrect) {
      setScore(s => s + 1);
    }

    setAnswered(prev => {
      const next = [...prev];
      next[qIndex] = true;
      return next;
    });

    setSelections(prev => {
      const next = [...prev];
      next[qIndex] = oIndex;
      return next;
    });
  };

  return (
    <>
      <div id="quizContainer">
        {quizData.map((item, qi) => (
          <div key={qi} className="quiz-card">
            <p className="quiz-q">{item.q}</p>
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
                    {opt.t}
                  </button>
                );
              })}
            </div>
            <div className={`quiz-explain ${answered[qi] ? 'show' : ''}`}>
              {item.explain}
            </div>
          </div>
        ))}
      </div>
      <p id="scoreText">{score} / {quizData.length}</p>
    </>
  );
};

export default Quiz;
