import React from 'react';

const Terminal = ({ title, children }) => {
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span></span><span></span><span></span>
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
};

export default Terminal;
