"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Reveal from "./Reveal";

export default function FAQSection({ faqs }: { faqs: string[][] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-sand-100/80">
      <div className="section-shell">
        <Reveal className="section-heading">
          <p className="section-kicker">Sık sorulan sorular</p>
          <h2 className="section-title">Etkinlik öncesi net bilgiler</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;

            return (
              <Reveal className="faq-card" delay={index * 0.04} key={question}>
                <button
                  aria-expanded={isOpen}
                  className="faq-trigger"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  type="button"
                >
                  <span>{question}</span>
                  <ChevronDown className={isOpen ? "rotate-180" : ""} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <p>{answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
