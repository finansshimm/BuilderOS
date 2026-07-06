/* eslint-disable react-refresh/only-export-components -- context module exports both provider and hook by design */
import { createContext, useContext, useState, useEffect } from "react";
import { STRINGS } from "./strings";

const LanguageContext = createContext(null);

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("builderos-lang") || "tr"; } catch (_) { return "tr"; }
  });

  useEffect(() => {
    try { localStorage.setItem("builderos-lang", lang); } catch (_) {}
  }, [lang]);

  const t = (key) => getPath(STRINGS[lang], key) ?? getPath(STRINGS.tr, key) ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
