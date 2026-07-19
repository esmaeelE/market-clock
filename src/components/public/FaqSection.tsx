"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguageStore } from "@/store/language.store";
import { texts } from "@/data/texts";

const FaqSection = () => {
  const { language } = useLanguageStore();
  const isRTL = language === "fa";
  const t = texts.faq[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={`space-y-12 ${isRTL ? "text-right" : "text-left"}`}>
      <section className="max-w-4xl animate-fadeIn space-y-6">
        <h2 className="text-4xl md:text-5xl font-black text-text-main leading-tight">
          {t.title}
        </h2>
        <p className="text-xl text-text-muted leading-relaxed font-medium border-s-4 border-brand-primary ps-6">
          {t.subtitle}
        </p>
      </section>

      <section className="max-w-4xl space-y-4">
        {t.items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-surface-border rounded-3xl overflow-hidden bg-surface-primary animate-slideUp"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between gap-4 p-6 md:p-8 cursor-pointer hover:bg-surface-soft transition-colors ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <span className="text-lg md:text-xl font-black text-text-main">
                  {item.question}
                </span>
                <ChevronDown
                  size={22}
                  className={`shrink-0 text-brand-primary transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <p className="text-text-muted leading-relaxed font-medium">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default FaqSection;
