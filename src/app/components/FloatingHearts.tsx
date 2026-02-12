"use client";

import { useState, useEffect } from "react";
import styles from "./FloatingHearts.module.css";

const HEART_COLORS = ["#E8A0BF", "#D4687A", "#F2C4C4", "#C97B84", "#F0B3C7"];

interface HeartConfig {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
  rotation: number;
  color: string;
}

function generateHearts(): HeartConfig[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 20 + Math.random() * 30,
    duration: 6 + Math.random() * 9,
    delay: Math.random() * 10,
    opacity: 0.15 + Math.random() * 0.25,
    driftX: -60 + Math.random() * 120,
    rotation: -30 + Math.random() * 60,
    color: HEART_COLORS[i % HEART_COLORS.length],
  }));
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<HeartConfig[]>([]);

  useEffect(() => {
    setHearts(generateHearts());
  }, []);

  if (hearts.length === 0) return null;

  return (
    <div className={styles.container}>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={styles.heart}
          style={
            {
              left: `${heart.left}%`,
              "--duration": `${heart.duration}s`,
              "--delay": `${heart.delay}s`,
              "--heart-opacity": heart.opacity,
              "--drift-x": `${heart.driftX}px`,
              "--rotation": `${heart.rotation}deg`,
            } as React.CSSProperties
          }
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill={heart.color}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
