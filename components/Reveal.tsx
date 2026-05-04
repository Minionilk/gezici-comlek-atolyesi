"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export default function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  id,
}: RevealProps) {
  const MotionTag = motion(as);

  return (
    <MotionTag
      className={className}
      id={id}
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once: true, amount: 0.18 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </MotionTag>
  );
}
