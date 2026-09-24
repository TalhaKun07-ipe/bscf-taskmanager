"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function RandomLetterSwap({
  label = "",
  className = "",
  staggerDuration = 0.025,
  transition = { duration: 0.5, type: "spring" },
  onClick
}) {
  const [displayText, setDisplayText] = useState(label);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        label
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return label[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= label.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setDisplayText(label);
  };

  return (
    <motion.span
      className={cn("inline-block select-none", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ scale: isHovered ? 1.02 : 1 }}
      transition={transition}
    >
      {displayText}
    </motion.span>
  );
}
