"use client";

import { motion } from "framer-motion";

const heroForms = [
  { label: "Kap", delay: 0, shape: "pot" },
  { label: "Yıldız", delay: 1.6, shape: "star" },
  { label: "Vazo", delay: 3.2, shape: "vase" },
  { label: "Çiçek", delay: 4.8, shape: "flower" },
] as const;

type HeroFormShape = (typeof heroForms)[number]["shape"];

function ClayForm({ shape }: { shape: HeroFormShape }) {
  if (shape === "pot") {
    return (
      <>
        <path d="M-42-32c4 34 10 58 42 58s38-24 42-58Z" fill="url(#heroClay)" stroke="#d6c8b8" strokeWidth="3" />
        <ellipse cx="0" cy="-32" fill="#fffdf8" rx="44" ry="14" stroke="#d6c8b8" strokeWidth="3" />
        <path d="M-28-4c18 8 38 8 56 0" fill="none" stroke="#f7efe5" strokeLinecap="round" strokeWidth="6" />
      </>
    );
  }

  if (shape === "star") {
    return (
      <>
        <path
          d="M0-58l15 31 34 5-25 24 6 34L0 20l-30 16 6-34-25-24 34-5Z"
          fill="url(#heroClay)"
          stroke="#d6c8b8"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path d="M-18-18L0-47l18 29" fill="none" stroke="#fffdf8" strokeLinecap="round" strokeWidth="5" />
      </>
    );
  }

  if (shape === "vase") {
    return (
      <>
        <path
          d="M-18-64c13 16 12 34 2 55-13 26-30 58 16 58s29-32 16-58c-10-21-11-39 2-55Z"
          fill="url(#heroClay)"
          stroke="#d6c8b8"
          strokeWidth="3"
        />
        <ellipse cx="0" cy="-64" fill="#fffdf8" rx="22" ry="7" stroke="#d6c8b8" strokeWidth="2.5" />
        <path d="M-23 8c15 9 31 9 46 0" fill="none" stroke="#f7efe5" strokeLinecap="round" strokeWidth="6" />
      </>
    );
  }

  return (
    <>
      {[0, 60, 120, 180, 240, 300].map((rotate) => (
        <ellipse
          cx="0"
          cy="-28"
          fill="url(#heroClayPetal)"
          key={rotate}
          rx="15"
          ry="30"
          stroke="#d6c8b8"
          strokeWidth="2.25"
          transform={`rotate(${rotate} 0 0)`}
        />
      ))}
      <circle cx="0" cy="0" fill="#f2eadf" r="18" stroke="#d6c8b8" strokeWidth="3" />
      <circle cx="0" cy="0" fill="#fffdf8" opacity="0.78" r="8" />
    </>
  );
}

export default function AnimatedHero() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="hero-art"
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      <svg aria-label="Seramik tornasında dönüşen beyaz çamur formları" className="hero-svg" role="img" viewBox="0 0 760 620">
        <defs>
          <linearGradient id="heroClay" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#fffdf8" />
            <stop offset="0.58" stopColor="#f5eee5" />
            <stop offset="1" stopColor="#dfd2c4" />
          </linearGradient>
          <linearGradient id="heroClayPetal" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#fffdf8" />
            <stop offset="1" stopColor="#eee4d8" />
          </linearGradient>
          <linearGradient id="wheelBase" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#f3e8dc" />
            <stop offset="1" stopColor="#d8c4b0" />
          </linearGradient>
          <radialGradient id="wheelTop" cx="50%" cy="36%" r="68%">
            <stop stopColor="#fffdf8" />
            <stop offset="0.62" stopColor="#efe4d8" />
            <stop offset="1" stopColor="#cdb9a5" />
          </radialGradient>
        </defs>

        <ellipse cx="380" cy="520" fill="#e5d2bf" opacity="0.42" rx="250" ry="34" />
        <path d="M154 500c106-17 210-18 312-3 54 8 106 7 158-4" fill="none" stroke="#e2c8ad" strokeLinecap="round" strokeOpacity="0.52" strokeWidth="5" />

        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}>
          <g transform="translate(380 344) rotate(-10)">
            <path d="M-132 88h264l-26 104H-106Z" fill="url(#wheelBase)" stroke="#d7c2ad" strokeLinejoin="round" strokeWidth="3" />
            <path d="M-105 124h210" stroke="#fff8ef" strokeLinecap="round" strokeOpacity="0.65" strokeWidth="6" />
            <ellipse cx="0" cy="86" fill="#d8c4b0" opacity="0.58" rx="136" ry="39" />
            <ellipse cx="0" cy="72" fill="url(#wheelTop)" rx="150" ry="48" stroke="#d4c0ac" strokeWidth="3" />

            <motion.g
              animate={{ rotate: 360 }}
              style={{ originX: "0px", originY: "72px" }}
              transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
            >
              <ellipse cx="0" cy="72" fill="none" rx="112" ry="34" stroke="#fffaf3" strokeOpacity="0.74" strokeWidth="5" />
              <ellipse cx="0" cy="72" fill="none" rx="66" ry="20" stroke="#d8c8b8" strokeOpacity="0.52" strokeWidth="3" />
              <path d="M-88 72h176M0 43v58M-60 52l120 40M60 52l-120 40" stroke="#eadbcb" strokeLinecap="round" strokeOpacity="0.42" strokeWidth="4" />
            </motion.g>

            <ellipse cx="0" cy="-6" fill="#efe2d5" opacity="0.52" rx="70" ry="18" />
          </g>

          <g transform="translate(380 282)">
            {heroForms.map((item) => (
              <motion.g
                animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1.02, 1, 0.96], y: [10, 0, -3, -12] }}
                initial={{ opacity: 0 }}
                key={item.label}
                transition={{ duration: 6.4, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
              >
                <ClayForm shape={item.shape} />
              </motion.g>
            ))}
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
}
