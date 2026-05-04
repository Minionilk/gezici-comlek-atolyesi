"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

type FormCardsSectionProps = {
  forms: string[];
};

const illustrations = ["bowl", "cup", "star", "flower", "vase", "dream"] as const;
const descriptions = [
  "Geniş ağızlı, alçak ve beyaz çamur dokusunda çanak formu.",
  "Kulpsuz, küçük ve sade seramik kap çalışması.",
  "Kalınlığı hissedilen dekoratif beyaz seramik yıldız.",
  "Yumuşak yapraklı, elde şekillenmiş çiçek formu.",
  "Dengeli gövdeli, zarif boyunlu vazo denemesi.",
  "Kalp, mini figür ve soyut formlarla özgür üretim alanı.",
];

type IllustrationType = (typeof illustrations)[number];

function DetailLine({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#fffaf3" strokeLinecap="round" strokeOpacity="0.84" strokeWidth="5" />;
}

function FormIllustration({ type }: { type: IllustrationType }) {
  return (
    <svg className="form-illustration" viewBox="0 0 220 150" aria-hidden="true">
      <defs>
        <linearGradient id={`clay-${type}`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#fffdf8" />
          <stop offset="0.56" stopColor="#f7f0e7" />
          <stop offset="1" stopColor="#e3d7ca" />
        </linearGradient>
        <linearGradient id={`clayEdge-${type}`} x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#fffdf8" />
          <stop offset="1" stopColor="#eee5db" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="128" fill="#e4d1bf" opacity="0.46" rx="68" ry="11" />

      {type === "bowl" && (
        <g>
          <path d="M45 63c9 18 18 33 32 43 20 14 46 14 66 0 14-10 23-25 32-43Z" fill={`url(#clay-${type})`} stroke="#d8c9b9" strokeWidth="2.25" />
          <ellipse cx="110" cy="63" fill="#fffdf8" rx="66" ry="21" stroke="#d8c9b9" strokeWidth="2.25" />
          <ellipse cx="110" cy="63" fill="#f4eadf" opacity="0.62" rx="41" ry="10" />
          <DetailLine d="M66 84c25 12 63 12 88 0" />
          <path d="M82 100c18 7 38 7 56 0" fill="none" stroke="#e5d8cb" strokeLinecap="round" strokeWidth="3" />
        </g>
      )}

      {type === "cup" && (
        <g>
          <path d="M72 48c3 21 6 42 12 56 5 12 15 18 26 18s21-6 26-18c6-14 9-35 12-56Z" fill={`url(#clay-${type})`} stroke="#d8c9b9" strokeWidth="2.25" />
          <ellipse cx="110" cy="48" fill="#fffdf8" rx="42" ry="14" stroke="#d8c9b9" strokeWidth="2.25" />
          <ellipse cx="110" cy="48" fill="#f4eadf" opacity="0.58" rx="25" ry="6" />
          <DetailLine d="M82 80c18 8 38 8 56 0" />
          <path d="M91 103c12 5 26 5 38 0" fill="none" stroke="#e5d8cb" strokeLinecap="round" strokeWidth="3" />
        </g>
      )}

      {type === "star" && (
        <g>
          <path
            d="M110 19l18 36 39 6-28 27 7 39-36-19-36 19 7-39-28-27 39-6Z"
            fill={`url(#clay-${type})`}
            stroke="#d8c9b9"
            strokeLinejoin="round"
            strokeWidth="2.25"
          />
          <DetailLine d="M93 69l17-34 17 34" />
          <path d="M84 101l26-13 26 13" fill="none" stroke="#e5d8cb" strokeLinecap="round" strokeWidth="3" />
        </g>
      )}

      {type === "flower" && (
        <g>
          {[0, 60, 120, 180, 240, 300].map((rotate) => (
            <ellipse
              cx="110"
              cy="45"
              fill={`url(#clayEdge-${type})`}
              key={rotate}
              rx="16"
              ry="31"
              stroke="#d8c9b9"
              strokeWidth="1.9"
              transform={`rotate(${rotate} 110 75)`}
            />
          ))}
          <circle cx="110" cy="75" fill="#f0e6da" stroke="#d8c9b9" strokeWidth="2.25" r="18" />
          <circle cx="110" cy="75" fill="#fffdf8" opacity="0.74" r="8" />
          <path d="M91 93c12 8 26 8 38 0" fill="none" stroke="#e5d8cb" strokeLinecap="round" strokeWidth="3" />
        </g>
      )}

      {type === "vase" && (
        <g>
          <path
            d="M94 27c9 12 8 25 2 39-7 15-18 27-15 42 3 14 15 21 29 21s26-7 29-21c3-15-8-27-15-42-6-14-7-27 2-39Z"
            fill={`url(#clay-${type})`}
            stroke="#d8c9b9"
            strokeWidth="2.25"
          />
          <ellipse cx="110" cy="27" fill="#fffdf8" rx="18" ry="7" stroke="#d8c9b9" strokeWidth="2" />
          <ellipse cx="110" cy="27" fill="#f4eadf" opacity="0.6" rx="9" ry="3" />
          <DetailLine d="M89 82c13 9 29 9 42 0" />
          <path d="M86 105c16 8 32 8 48 0" fill="none" stroke="#e5d8cb" strokeLinecap="round" strokeWidth="3" />
        </g>
      )}

      {type === "dream" && (
        <g>
          <path d="M72 58c-13-16 1-35 20-21 18-14 32 5 19 21L92 80Z" fill={`url(#clay-${type})`} stroke="#d8c9b9" strokeLinejoin="round" strokeWidth="2.25" />
          <path d="M133 40c10-12 29-5 29 12 0 8-5 14-12 17v20h-31V69c-7-3-12-9-12-17 0-17 19-24 29-12Z" fill={`url(#clay-${type})`} stroke="#d8c9b9" strokeWidth="2.25" />
          <path d="M53 96c8-15 31-15 40 0 10-7 25-1 26 12 2 18-17 26-36 17-20 10-40 0-37-18 1-5 3-9 7-11Z" fill={`url(#clayEdge-${type})`} stroke="#d8c9b9" strokeWidth="2.25" />
          <path d="M145 49c5 5 5 11 0 17" fill="none" stroke="#eee4d8" strokeLinecap="round" strokeWidth="4" />
          <circle cx="136" cy="52" fill="#f6efe7" stroke="#d8c9b9" strokeWidth="1.5" r="4" />
          <DetailLine d="M62 111c13 5 28 5 41 0" />
          <path d="M75 68l17 12 16-13" fill="none" stroke="#e5d8cb" strokeLinecap="round" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}

export default function FormCardsSection({ forms }: FormCardsSectionProps) {
  return (
    <section className="section-shell">
      <Reveal className="section-heading">
        <p className="section-kicker">Ne yapıyoruz</p>
        <h2 className="section-title">Çarkta üretilebilen formlar</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((form, index) => (
          <motion.article
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            key={form}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.055 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.4 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FormIllustration type={illustrations[index] ?? "dream"} />
            </motion.div>
            <h3>{form}</h3>
            <p>{descriptions[index]}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
