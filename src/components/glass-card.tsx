"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({
  children,
  className = "",
}: Props) {
  return (
    <motion.div
      className={`
        premium-card
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-[0_0_30px_rgba(255,255,255,0.03)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}