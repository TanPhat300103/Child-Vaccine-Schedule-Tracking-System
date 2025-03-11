import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "./TranslationProvider";
import "../translate/LanguageSwitcher.css";
const LanguageSwitcher = () => {
  const { language, changeLanguage, isLoaded } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // navItems ngon ngu
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "ja", name: "Tiếng Nhật", flag: "jp" },
    // Thêm ngôn ngữ khác nếu cần
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  if (!isLoaded) {
    return <div className="language-loading">...</div>;
  }

  return (
    <div className="language-switcher-container" ref={dropdownRef}>
      <button
        className="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-name">{currentLanguage.name}</span>
        <svg
          className="dropdown-arrow"
          viewBox="0 0 20 20"
          fill="currentColor"
          height="16"
          width="16"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <ul>
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  className={language === lang.code ? "active" : ""}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-name">{lang.name}</span>
                  {language === lang.code && (
                    <svg
                      className="check-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      height="16"
                      width="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
