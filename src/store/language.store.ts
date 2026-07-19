import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "fa" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "fa",
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: "market-clock-language" }
  )
);
