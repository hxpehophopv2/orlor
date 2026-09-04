import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useI18n } from "../context/I18nContext";

const Header = () => {
  const { currentLang, changeLanguage, tHtml } = useI18n();
  const location = useLocation();

  return (
    <div className="topbar">
      <button
        className="menu-btn"
        id="menuBtn"
        aria-label="Toggle Menu"
      >
        <Menu size={20} />
      </button>
      <div className="brand">
        <span className="desktop-brand" dangerouslySetInnerHTML={tHtml("t_2")} />
        <span className="mobile-brand">OrLor</span>
      </div>
    </div>
  );
};

export default Header;
