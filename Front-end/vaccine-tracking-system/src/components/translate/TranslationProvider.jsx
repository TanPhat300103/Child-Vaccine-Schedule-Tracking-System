import { createContext, useContext, useEffect, useState } from "react";

// Tạo context để quản lý ngôn ngữ
const TranslationContext = createContext();

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("vi");
  const [isLoaded, setIsLoaded] = useState(false);

  // goi script google translate api
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "vi",
            includedLanguages: "en,vi,ja", // Thêm các ngôn ngữ khác nếu cần
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      };
    };

    if (!window.googleTranslateElementInit) {
      addGoogleTranslateScript();
    }

    // CSS để ẩn các phần tử UI của Google Translate
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .goog-te-banner-frame,
      .goog-te-gadget,
      .goog-te-menu-frame,
      #google_translate_element {
        display: none !important;
      }
      .skiptranslate {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const changeLanguage = (lang) => {
    const translateElement = document.querySelector(".goog-te-combo");
    if (translateElement) {
      translateElement.value = lang;
      translateElement.dispatchEvent(new Event("change"));
    }
    setLanguage(lang);
  };

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, isLoaded }}>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      {children}
    </TranslationContext.Provider>
  );
};
