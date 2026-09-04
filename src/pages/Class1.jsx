import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../context/I18nContext';
import gsap from 'gsap';
import Terminal from '../components/Terminal';
import Quiz from '../components/Quiz';

const Class1 = React.memo(() => {
  const { t, currentLang } = useI18n();
  const mainRef = useRef(null);
  const [quizContainer, setQuizContainer] = useState(null);

  useEffect(() => {
    if (!mainRef.current) return;
    
    // Set quiz container for portal
    setQuizContainer(mainRef.current.querySelector('#quizContainer'));

    const terms = mainRef.current.querySelectorAll('.term');
    
    // Clean up old popups if they exist
    mainRef.current.querySelectorAll('.term-pop-injected').forEach(el => el.remove());

    const handlers = [];

    terms.forEach(term => {
      // Create popup
      const def = term.getAttribute('data-def');
      if (!def) return;
      const popup = document.createElement('div');
      popup.className = 'term-pop term-pop-injected';
      popup.innerHTML = def;
      term.appendChild(popup);

      // GSAP Animations
      const enter = () => {
        term.classList.add('open');
        gsap.killTweensOf(popup);
        gsap.fromTo(popup, 
          { opacity: 0, scale: 0.9, y: 15 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
        );
      };
      
      const leave = () => {
        gsap.killTweensOf(popup);
        gsap.to(popup, { 
          opacity: 0, 
          scale: 0.95, 
          y: 10, 
          duration: 0.2, 
          ease: 'power2.in',
          onComplete: () => term.classList.remove('open')
        });
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

    // ---------- command anatomy ----------
    const anatomyParts = mainRef.current.querySelectorAll('.anatomy .part');
    const anatomyDesc = mainRef.current.querySelector('#anatomyDesc');
    anatomyParts.forEach(el => {
      const clickHandler = () => {
        anatomyParts.forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        if (anatomyDesc) anatomyDesc.innerHTML = el.getAttribute('data-desc');
      };
      el.addEventListener('click', clickHandler);
      handlers.push(() => el.removeEventListener('click', clickHandler));
    });

    // ---------- enabled/active matrix ----------
    const matrixData = {
      ea: "<b>Enabled + Active</b> — สถานการณ์ปกติของเซอร์วิสที่ควรทำงานตลอด เช่น ssh หรือ cron ในสภาพเริ่มต้น: เปิดใช้ตอนนี้ และตั้งไว้ให้เปิดอัตโนมัติทุกครั้งที่บูตด้วย",
      ei: "<b>Enabled + Inactive</b> — ตั้งไว้ให้เปิดตอนบูต แต่ตอนนี้ดันไม่ได้ทำงาน! มักเกิดเพราะเซอร์วิส crash หรือมีปัญหาระหว่างทำงานแล้วหยุดไปเอง ต้องไปดู log ว่ามันบ่นอะไร แล้วค่อย start ใหม่",
      da: "<b>Disabled + Active</b> — เพิ่งสั่ง disable ไป แต่ยังไม่ได้ reboot หรือ stop เอง เซอร์วิสจึงยังรันต่อไปตามปกติ (นี่คือสถานการณ์ในแล็บวันนี้ทันทีหลังพิมพ์ 'sudo systemctl disable cron')",
      di: "<b>Disabled + Inactive</b> — ปิดสนิททั้งสองมิติ: ไม่ทำงานตอนนี้ และจะไม่เปิดเองตอนบูตครั้งหน้าด้วย (สถานการณ์ที่เจอหลัง reboot เครื่องที่เพิ่ง disable ไปในแล็บวันนี้)"
    };
    const matrixCells = mainRef.current.querySelectorAll('.matrix .cell');
    const matrixDetail = mainRef.current.querySelector('#matrixDetail');
    matrixCells.forEach(btn => {
      const clickHandler = () => {
        matrixCells.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (matrixDetail) matrixDetail.innerHTML = matrixData[btn.getAttribute('data-key')];
      };
      btn.addEventListener('click', clickHandler);
      handlers.push(() => btn.removeEventListener('click', clickHandler));
    });

    // ---------- locked class pills ----------
    const lockedPills = mainRef.current.querySelectorAll('.class-pill.locked');
    lockedPills.forEach(p => {
      p.dataset.orig = p.textContent;
      const clickHandler = () => {
        clearTimeout(p._t);
        p.textContent = p.getAttribute('data-msg');
        p._t = setTimeout(() => { p.textContent = p.dataset.orig; }, 1800);
      };
      p.addEventListener('click', clickHandler);
      handlers.push(() => p.removeEventListener('click', clickHandler));
    });

    return () => {
      handlers.forEach(h => h());
    };
  }, [t, currentLang]); // Re-run when translations change

  return (
    <main ref={mainRef}>
      {quizContainer && createPortal(<Quiz />, quizContainer)}
      <div className="hero">
          <span className="eyebrow-badge" dangerouslySetInnerHTML={{ __html: t("t_21") }}
             />
          <h1 dangerouslySetInnerHTML={{ __html: t("t_22") }} />
          <p className="lede" dangerouslySetInnerHTML={{ __html: t("t_23") }} />
          <div className="hero-chips">
            <a className="hero-chip" href="#history" dangerouslySetInnerHTML={{ __html: t("t_24") }}
               />
            <a className="hero-chip" href="#identity" dangerouslySetInnerHTML={{ __html: t("t_25") }}
               />
            <a className="hero-chip" href="#packages" dangerouslySetInnerHTML={{ __html: t("t_26") }}
               />
            <a className="hero-chip" href="#services" dangerouslySetInnerHTML={{ __html: t("t_27") }}
               />
          </div>
        </div>

        {/* ============ INTRO ============ */}
        <section className="lesson" id="intro">
          <div className="section-kicker">
            <span className="num">00</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_28") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_29") }} />
          <div className="callout" dangerouslySetInnerHTML={{ __html: t("t_30") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_32") }} />
        </section>

        {/* ============ ANATOMY ============ */}
        <section className="lesson" id="anatomy">
          <div className="section-kicker">
            <span className="num">01</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_33") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_34") }} />
          <div className="anatomy">
            <div className="anatomy-line">
              <span
                className="part cmd"
                data-desc="<b>ชื่อคำสั่ง (command)</b> — บอกโปรแกรมว่าอยากให้ทำอะไร ในที่นี้ <code>cp</code> แปลว่า copy (คัดลอกไฟล์)"
                >cp</span
              >
              <span
                className="part opt"
                data-desc="<b>ตัวเลือก (option)</b> — ปรับพฤติกรรมของคำสั่ง แบบสั้นใช้ขีดเดียว <code>-v</code> ย่อมาจาก verbose แปลว่า 'พิมพ์รายละเอียดให้ดูด้วย'"
                >-v</span
              >
              <span
                className="part arg"
                data-desc="<b>อาร์กิวเมนต์ (argument)</b> — สิ่งที่คำสั่งจะเอาไปทำงานด้วย ในที่นี้คือไฟล์ต้นทางที่จะคัดลอก"
                >file1</span
              >
              <span
                className="part arg"
                data-desc="<b>อาร์กิวเมนต์ตัวที่ 2</b> — ปลายทางที่จะคัดลอกไปวาง"
                >file2</span
              >
            </div>
            <div className="anatomy-desc" id="anatomyDesc" dangerouslySetInnerHTML={{ __html: t("t_35") }} />
            <div className="anatomy-legend">
              <span dangerouslySetInnerHTML={{ __html: t("t_36") }}
                 />
              <span dangerouslySetInnerHTML={{ __html: t("t_37") }}
                 />
              <span dangerouslySetInnerHTML={{ __html: t("t_38") }}
                 />
            </div>
          </div>
          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_39") }} />
          <div className="compare-grid">
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_40") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_41") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_42") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_43") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_44") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_45") }} />
            </div>
          </div>
          <div className="callout tip" dangerouslySetInnerHTML={{ __html: t("t_46") }} />
        </section>

        {/* ============ HISTORY ============ */}
        <section className="lesson" id="history">
          <div className="section-kicker">
            <span className="num">02</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_48") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_49") }} />
          <div className="tbl-wrap">
            <table>
              <tbody>
                <tr>
                  <th dangerouslySetInnerHTML={{ __html: t("t_50") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_51") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_52") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_53") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_54") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_55") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_56") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_57") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_58") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_59") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_60") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_61") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_62") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_63") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_64") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_65") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_66") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_67") }} />
                </tr>
              </tbody>
            </table>
          </div>
          <Terminal title="sysadmin@lvm68001">
              <span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">history 5</span></span
              ><span className="ln t-out"> 5 who -q</span
              ><span className="ln t-out"> 6 echo $SHELL</span
              ><span className="ln t-out"> 7 bash</span
              ><span className="ln t-out"> 8 logout</span
              ><span className="ln t-out"> 9 history 5</span
              ><span className="ln"
                ><span className="t-user">[~]$</span> <span className="t-cmd">!6</span>
                <span className="t-comment"
                  >← เท่ากับพิมพ์ "echo $SHELL"</span
                ></span
              ><span className="ln t-out">/bin/bash</span>
          </Terminal>
          <div className="reveal-box">
            <p style={{"marginBottom":"12px"}} dangerouslySetInnerHTML={{ __html: t("t_68") }} />
            <button
              className="reveal-btn"
              onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('show')}
              dangerouslySetInnerHTML={{ __html: t("t_69") }}
             />
            <div className="reveal-content" dangerouslySetInnerHTML={{ __html: t("t_70") }} />
          </div>
          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_71") }} />
          <div className="compare-grid">
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_72") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_73") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_74") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_75") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_76") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_77") }} />
            </div>
          </div>
        </section>

        {/* ============ EDITING ============ */}
        <section className="lesson" id="editing">
          <div className="section-kicker">
            <span className="num">03</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_78") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_79") }} />
          <div className="tbl-wrap">
            <table>
              <tbody>
                <tr>
                  <th dangerouslySetInnerHTML={{ __html: t("t_80") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_51") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_81") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_82") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_83") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_84") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_85") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_86") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_87") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_88") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_89") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_90") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_91") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_92") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_93") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_94") }} />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="callout" dangerouslySetInnerHTML={{ __html: t("t_95") }} />
        </section>

        {/* ============ BASHRC ============ */}
        <section className="lesson" id="bashrc">
          <div className="section-kicker">
            <span className="num">04</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_97") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_98") }} />
          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_99") }} />
          <div className="tbl-wrap">
            <table>
              <tbody>
                <tr>
                  <th dangerouslySetInnerHTML={{ __html: t("t_100") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_51") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_101") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_102") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_103") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_104") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_105") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_106") }} />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="callout warn" dangerouslySetInnerHTML={{ __html: t("t_107") }} />
          <Terminal title="~/.bashrc">
              <span className="ln t-comment"
                ># disable terminal resume key, to use CTRL+S for forward
                search</span
              ><span className="ln t-cmd">stty -ixon</span><span className="ln"></span
              ><span className="ln t-comment"># keep more command history</span
              ><span className="ln t-cmd">HISTSIZE=10000</span
              ><span className="ln t-cmd">HISTFILESIZE=20000</span>
          </Terminal>
          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_109") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_110") }} />
          <div className="reveal-box">
            <p style={{"marginBottom":"12px"}} dangerouslySetInnerHTML={{ __html: t("t_111") }} />
            <button
              className="reveal-btn"
              onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('show')}
              dangerouslySetInnerHTML={{ __html: t("t_69") }}
             />
            <div className="reveal-content" dangerouslySetInnerHTML={{ __html: t("t_112") }} />
          </div>
        </section>

        {/* ============ IDENTITY / SUDO ============ */}
        <section className="lesson" id="identity">
          <div className="section-kicker">
            <span className="num">05</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_113") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_114") }} />
          <div className="callout warn" dangerouslySetInnerHTML={{ __html: t("t_115") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_117") }} />
          <Terminal title="sysadmin@lvm68001">
              <span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">sudo mkdir tempdir</span></span
              ><span className="ln t-out"
                >[sudo] password for sysadmin:
                <span className="t-comment"
                  >← ใส่รหัสผ่านของ "ตัวเอง" ไม่ใช่รหัสของ root</span
                ></span
              >
          </Terminal>
          <div className="callout tip" dangerouslySetInnerHTML={{ __html: t("t_118") }} />

          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_120") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_121") }} />
          <div className="compare-grid">
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_122") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_123") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_124") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_125") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_126") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_127") }} />
            </div>
          </div>
          <div className="reveal-box">
            <p style={{"marginBottom":"12px"}} dangerouslySetInnerHTML={{ __html: t("t_128") }} />
            <button
              className="reveal-btn"
              onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('show')}
              dangerouslySetInnerHTML={{ __html: t("t_69") }}
             />
            <div className="reveal-content" dangerouslySetInnerHTML={{ __html: t("t_129") }} />
          </div>

          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_130") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_131") }} />
          <div
            className="compare-grid"
            style={{"gridTemplateColumns":"repeat(2, 1fr)"}}
          >
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_132") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_133") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_134") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_135") }} />
            </div>
          </div>
          <div className="callout" dangerouslySetInnerHTML={{ __html: t("t_136") }} />
        </section>

        {/* ============ OWNERSHIP ============ */}
        <section className="lesson" id="ownership">
          <div className="section-kicker">
            <span className="num">06</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_138") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_139") }} />
          <Terminal title="sysadmin@lvm68001">
              <span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">ls -ld tempdir</span></span
              ><span className="ln t-out"
                >drwxr-xr-x 2 sysadmin sysadmin 4096 Aug 5 13:22 tempdir</span
              ><span className="ln t-comment">
                <i data-lucide="arrow-up" className="icon-sm"></i> owner
                <i data-lucide="arrow-up" className="icon-sm"></i> group</span
              >
          </Terminal>
          <div className="callout warn" dangerouslySetInnerHTML={{ __html: t("t_140") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_142") }} />
          <Terminal title="sysadmin@lvm68001">
              <span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">sudo chown -R sysadmin: tempdir</span></span
              ><span className="ln t-comment"
                >-R = ทำกับทุกไฟล์ใน tempdir ทั้งโฟลเดอร์ย่อยด้วย
                (recursive)</span
              ><span className="ln t-comment"
                >sysadmin: = เปลี่ยนเจ้าของเป็น sysadmin และใช้กลุ่มหลักของ
                sysadmin ด้วย</span
              >
          </Terminal>
          <div
            className="compare-grid"
            style={{"gridTemplateColumns":"repeat(3, 1fr)"}}
          >
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_143") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_144") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_145") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_146") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_147") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_148") }} />
            </div>
          </div>
          <div className="callout" dangerouslySetInnerHTML={{ __html: t("t_149") }} />
        </section>

        {/* ============ USERS & GROUPS ============ */}
        <section className="lesson" id="users">
          <div className="section-kicker">
            <span className="num">07</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_151") }} />
          <Terminal title="sysadmin@lvm68001">
              <span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd"
                  >sudo useradd -m -s /bin/bash test</span
                ></span
              ><span className="ln t-comment"
                >-m = สร้าง home directory ให้ด้วย -s = กำหนด shell ที่จะใช้ตอน
                login</span
              ><span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">sudo passwd test</span></span
              ><span className="ln t-out"
                >New password:
                <span className="t-comment"
                  >← พิมพ์แล้วจะไม่มีอะไรขึ้นบนจอ ปกติ ไม่ใช่คีย์บอร์ดเสีย</span
                ></span
              ><span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">id test</span></span
              ><span className="ln t-out"
                >uid=1001(test) gid=1001(test) groups=1001(test)</span
              >
          </Terminal>
          <div className="callout" dangerouslySetInnerHTML={{ __html: t("t_152") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_154") }} />
          <Terminal title="sysadmin@lvm68001">
              <span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">sudo usermod -aG sysadmin test</span></span
              ><span className="ln t-comment"
                >-a = append (เพิ่มเข้าไป) -G = แก้ secondary group</span
              >
          </Terminal>
          <div className="callout warn" dangerouslySetInnerHTML={{ __html: t("t_155") }} />
          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_157") }} />
          <div
            className="compare-grid"
            style={{"gridTemplateColumns":"repeat(2, 1fr)"}}
          >
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_158") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_159") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_160") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_161") }} />
            </div>
          </div>
        </section>

        {/* ============ PACKAGES ============ */}
        <section className="lesson" id="packages">
          <div className="section-kicker">
            <span className="num">08</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_162") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_163") }} />
          <div className="tbl-wrap">
            <table>
              <tbody>
                <tr>
                  <th dangerouslySetInnerHTML={{ __html: t("t_164") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_165") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_166") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_167") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_168") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_169") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_170") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_171") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_172") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_173") }} />
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_174") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_175") }} />
          <div className="tbl-wrap">
            <table>
              <tbody>
                <tr>
                  <th dangerouslySetInnerHTML={{ __html: t("t_176") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_177") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_178") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_179") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_180") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_181") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_182") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_183") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_184") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_185") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_186") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_187") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_188") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_189") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_190") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_191") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_192") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_193") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_194") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_195") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_196") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_197") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_198") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_199") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_200") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_201") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_202") }} />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="callout warn" dangerouslySetInnerHTML={{ __html: t("t_203") }} />
          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_205") }} />
          <Terminal title="sysadmin@lvm68001">
              <span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">apt list unzip -a</span>
                <span className="t-comment"
                  >← -a แสดงทุกเวอร์ชันที่มีในคลัง</span
                ></span
              ><span className="ln t-out"
                >unzip/noble-updates,noble-security 6.0-28ubuntu4.1 amd64</span
              ><span className="ln t-out">unzip/noble 6.0-28ubuntu4 amd64</span
              ><span className="ln"
                ><span className="t-user">[~]$</span>
                <span className="t-cmd">sudo apt install unzip=6.0-28ubuntu4</span>
                <span className="t-comment">← ระบุเวอร์ชันด้วย =</span></span
              >
          </Terminal>
          <p dangerouslySetInnerHTML={{ __html: t("t_206") }} />
        </section>

        {/* ============ SERVICES ============ */}
        <section className="lesson" id="services">
          <div className="section-kicker">
            <span className="num">09</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_207") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_208") }} />
          <div className="callout" dangerouslySetInnerHTML={{ __html: t("t_209") }} />
          <div className="tbl-wrap">
            <table>
              <tbody>
                <tr>
                  <th dangerouslySetInnerHTML={{ __html: t("t_211") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_51") }} />
                  <th dangerouslySetInnerHTML={{ __html: t("t_212") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_213") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_214") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_215") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_216") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_217") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_218") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_219") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_220") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_218") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_221") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_222") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_218") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_223") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_224") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_218") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_225") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_226") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_218") }} />
                </tr>
                <tr>
                  <td dangerouslySetInnerHTML={{ __html: t("t_227") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_228") }} />
                  <td dangerouslySetInnerHTML={{ __html: t("t_218") }} />
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_229") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_230") }} />
          <div
            className="compare-grid"
            style={{"gridTemplateColumns":"repeat(2, 1fr)"}}
          >
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_231") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_232") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_233") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_234") }} />
            </div>
          </div>
          <p dangerouslySetInnerHTML={{ __html: t("t_235") }} />
          <div className="matrix-wrap">
            <div className="matrix">
              <div className="corner"></div>
              <div className="head">Active (กำลังรัน)</div>
              <div className="head">Inactive (ไม่ได้รัน)</div>
              <div className="rowlabel">Enabled</div>
              <button className="cell" data-key="ea">enabled<br />+ active</button>
              <button className="cell" data-key="ei">
                enabled<br />+ inactive
              </button>
              <div className="rowlabel">Disabled</div>
              <button className="cell" data-key="da">disabled<br />+ active</button>
              <button className="cell" data-key="di">
                disabled<br />+ inactive
              </button>
            </div>
            <div className="matrix-detail" id="matrixDetail">
              <i data-lucide="mouse-pointer-click" className="icon-sm"></i>
              ลองกดช่องในตารางเพื่อดูว่าแต่ละสถานการณ์เกิดขึ้นตอนไหน
            </div>
          </div>

          <div className="reveal-box">
            <p style={{"marginBottom":"12px"}} dangerouslySetInnerHTML={{ __html: t("t_236") }} />
            <button
              className="reveal-btn"
              onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('show')}
              dangerouslySetInnerHTML={{ __html: t("t_69") }}
             />
            <div className="reveal-content" dangerouslySetInnerHTML={{ __html: t("t_237") }} />
          </div>

          <h3 className="sub-title" dangerouslySetInnerHTML={{ __html: t("t_238") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_239") }} />
          <div
            className="compare-grid"
            style={{"gridTemplateColumns":"repeat(2, 1fr)"}}
          >
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_240") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_241") }} />
            </div>
            <div className="compare-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_242") }} />
              <p dangerouslySetInnerHTML={{ __html: t("t_243") }} />
            </div>
          </div>
        </section>

        {/* ============ QUIZ ============ */}
        <section className="lesson" id="quiz">
          <div className="section-kicker">
            <span className="num">✓</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_244") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_245") }} />

          <div id="quizContainer"></div>
          <div className="quiz-score">
            <span>คะแนนของคุณ</span>
            <b id="scoreText">0 / 6</b>
          </div>
        </section>

        {/* ============ CHEATSHEET ============ */}
        <section className="lesson" id="cheatsheet">
          <div className="section-kicker">
            <span className="num">📋</span><span className="line"></span>
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t("t_20") }} />
          <p dangerouslySetInnerHTML={{ __html: t("t_246") }} />
          <div className="cheat-grid">
            <div className="cheat-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_247") }} />
              <ul>
                <li>
                  <code>!!</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_248") }} />
                </li>
                <li>
                  <code>!N</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_249") }} />
                </li>
                <li>
                  <code>!$</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_250") }}
                     />
                </li>
                <li>
                  <code>Ctrl+R</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_251") }} />
                </li>
                <li>
                  <code>Ctrl+_</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_252") }} />
                </li>
                <li>
                  <code>source ~/.bashrc</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_253") }}
                     />
                </li>
              </ul>
            </div>
            <div className="cheat-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_254") }} />
              <ul>
                <li>
                  <code>sudo cmd</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_255") }}
                     />
                </li>
                <li>
                  <code>su user</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_256") }}
                     />
                </li>
                <li>
                  <code>id</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_257") }} />
                </li>
                <li>
                  <code>who am i</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_258") }} />
                </li>
                <li>
                  <code>useradd -m -s /bin/bash x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_259") }} />
                </li>
                <li>
                  <code>usermod -aG group user</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_260") }}
                     />
                </li>
                <li>
                  <code>chown user:group path</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_261") }} />
                </li>
              </ul>
            </div>
            <div className="cheat-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_262") }} />
              <ul>
                <li>
                  <code>apt update</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_263") }}
                     />
                </li>
                <li>
                  <code>apt upgrade</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_264") }} />
                </li>
                <li>
                  <code>apt install x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_196") }}
                     />
                </li>
                <li>
                  <code>apt install x=1.0</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_265") }}
                     />
                </li>
                <li>
                  <code>apt list --installed</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_266") }} />
                </li>
                <li>
                  <code>apt remove x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_267") }} />
                </li>
                <li>
                  <code>apt purge x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_268") }} />
                </li>
              </ul>
            </div>
            <div className="cheat-card">
              <h4 dangerouslySetInnerHTML={{ __html: t("t_269") }} />
              <ul>
                <li>
                  <code>systemctl status x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_270") }} />
                </li>
                <li>
                  <code>systemctl start/stop x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_271") }} />
                </li>
                <li>
                  <code>systemctl enable/disable x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_272") }} />
                </li>
                <li>
                  <code>systemctl reload x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_273") }}
                     />
                </li>
                <li>
                  <code>systemctl restart x</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_274") }}
                     />
                </li>
                <li>
                  <code>ps 1</code
                  ><span className="d" dangerouslySetInnerHTML={{ __html: t("t_275") }}
                     />
                </li>
              </ul>
            </div>
          </div>
          <div className="callout tip" style={{"marginTop":"24px"}} dangerouslySetInnerHTML={{ __html: t("t_276") }} />
        </section>

        <div className="foot" dangerouslySetInnerHTML={{ __html: t("t_278") }} />
    </main>
  );
});

export default Class1;
