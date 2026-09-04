import React, { useEffect, useState } from "react";
import gsap from "gsap";

const rawAsciiArtLines = [
  "                                .:xxxxxxxx:.",
  "                             .xxxxxxxxxxxxxxxx.",
  "                            :xxxxxxxxxxxxxxxxxxx:.",
  "                           .xxxxxxxxxxxxxxxxxxxxxxx:",
  "                          :xxxxxxxxxxxxxxxxxxxxxxxxx:",
  "                          xxxxxxxxxxxxxxxxxxxxxxxxxxX:",
  "                          xxx:::xxxxxxxx::::xxxxxxxxx:",
  "                         .xx:   ::xxxxx:     :xxxxxxxx",
  "                         :xx  x.  xxxx:  xx.  xxxxxxxx",
  "                         :xx xxx  xxxx: xxxx  :xxxxxxx",
  "                         'xx 'xx  xxxx:. xx'  xxxxxxxx",
  "                          xx ::::::xx:::::.   xxxxxxxx",
  "                          xx:::::.::::.:::::::xxxxxxxx",
  "                          :x'::::'::::':::::':xxxxxxxxx.",
  "                          :xx.::::::::::::'   xxxxxxxxxx",
  "                          :xx: '::::::::'     :xxxxxxxxxx.",
  "                         .xx     '::::'        'xxxxxxxxxx.",
  "                       .xxxx                     'xxxxxxxxx.",
  "                     .xxxx                         'xxxxxxxxx.",
  "                   .xxxxx:                          xxxxxxxxxx.",
  "                  .xxxxx:'                          xxxxxxxxxxx.",
  "                 .xxxxxx:::.           .       ..:::_xxxxxxxxxxx:.",
  "                .xxxxxxx''      ':::''            ''::xxxxxxxxxxxx.",
  "                xxxxxx            :                  '::xxxxxxxxxxxx",
  "               :xxxx:'            :                    'xxxxxxxxxxxx:",
  "              .xxxxx              :                     ::xxxxxxxxxxxx",
  "              xxxx:'                                    ::xxxxxxxxxxxx",
  "              xxxx               .                      ::xxxxxxxxxxxx.",
  "          .:xxxxxx               :                      ::xxxxxxxxxxxx::",
  "          xxxxxxxx               :                      ::xxxxxxxxxxxxx:",
  "          xxxxxxxx               :                      ::xxxxxxxxxxxxx:",
  "          ':xxxxxx               '                      ::xxxxxxxxxxxx:'",
  "            .:. xx:.                                   .:xxxxxxxxxxxxx'",
  "          ::::::.'xx:.            :                  .:: xxxxxxxxxxx':",
  "  .:::::::::::::::.'xxxx.                            ::::'xxxxxxxx':::.",
  "  ::::::::::::::::::.'xxxxx                          :::::.'.xx.'::::::.",
  "  ::::::::::::::::::::.'xxxx:.                       :::::::.'':::::::::",
  "  ':::::::::::::::::::::.'xx:'                     .'::::::::::::::::::::..",
  "    :::::::::::::::::::::.'xx                    .:: :::::::::::::::::::::::",
  "  .:::::::::::::::::::::::. xx               .::xxxx :::::::::::::::::::::::",
  "  :::::::::::::::::::::::::.'xxx..        .::xxxxxxx ::::::::::::::::::::'",
  "  '::::::::::::::::::::::::: xxxxxxxxxxxxxxxxxxxxxxx :::::::::::::::::'",
  "    '::::::::::::::::::::::: xxxxxxxxxxxxxxxxxxxxxxx :::::::::::::::'",
  "        ':::::::::::::::::::_xxxxxx::'''::xxxxxxxxxx '::::::::::::'",
  "             '':.::::::::::'                        `._'::::::'' ",
];

const maxLen = Math.max(...rawAsciiArtLines.map((line) => line.length));
const asciiArtLines = rawAsciiArtLines.map((line) => line.padEnd(maxLen, " "));

const LoadingScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";

    let currentLine = 0;
    // Calculate interval to make loading relatively fast but observable (e.g., total 2.5s)
    // 2500ms / 45 lines = ~55ms per line
    const intervalTime = 25;

    const interval = setInterval(() => {
      if (currentLine < asciiArtLines.length) {
        setLines((prev) => [...prev, asciiArtLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(".loading-screen-wrap", {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: onComplete,
          });
        }, 200);
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      className="loading-screen-wrap"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      <pre
        style={{
          fontFamily: "'Ubuntu Mono', monospace",
          lineHeight: "1.2",
          color: "#e5e7eb",
          margin: 0,
          fontWeight: "bold",
          whiteSpace: "pre",
          fontSize: "min(0.7vh, 0.4vw)",
          textAlign: "center",
        }}
      >
        {lines.join("\n")}
        {lines.length < asciiArtLines.length && (
          <span className="cursor-blink">_</span>
        )}
      </pre>
    </div>
  );
};

export default LoadingScreen;
