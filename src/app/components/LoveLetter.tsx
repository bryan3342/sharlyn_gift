"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./LoveLetter.module.css";

function createFirework(container: HTMLDivElement) {
  const x = Math.random() * 100;
  const y = 20 + Math.random() * 60;
  const colors = ["#D4687A", "#E8A0BF", "#F2C4C4", "#FFD700", "#FF6B6B", "#FFF8F0"];

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.className = styles.fireworkParticle;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;

    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.backgroundColor = color;
    particle.style.setProperty("--dx", `${dx}px`);
    particle.style.setProperty("--dy", `${dy}px`);

    container.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
}

interface LoveLetterProps {
  onYes?: () => void;
}

export default function LoveLetter({ onYes }: LoveLetterProps) {
  const [answer, setAnswer] = useState<"ask" | "no" | "yes">("ask");
  const [fireworkContainer, setFireworkContainer] = useState<HTMLDivElement | null>(null);
  const odeToJoyRef = useRef<HTMLAudioElement | null>(null);

  const fireworkRef = useCallback((node: HTMLDivElement | null) => {
    setFireworkContainer(node);
  }, []);

  useEffect(() => {
    if (answer === "no") {
      const timer = setTimeout(() => {
        setAnswer("ask");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [answer]);

  useEffect(() => {
    if (answer === "yes") {
      // Play Ode to Joy
      const audio = new Audio("/quiz/Ode to Joy (Short version found in Peggle).mp3");
      audio.volume = 0.7;
      audio.play().catch(() => {});
      odeToJoyRef.current = audio;

      // Notify parent to stop background music
      onYes?.();

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [answer, onYes]);

  useEffect(() => {
    if (answer === "yes" && fireworkContainer) {
      // Launch fireworks in bursts
      const intervals = [0, 300, 700, 1200, 1800, 2500, 3200];
      const timers = intervals.map((delay) =>
        setTimeout(() => createFirework(fireworkContainer), delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [answer, fireworkContainer]);

  return (
    <>
      {/* Fireworks layer */}
      {answer === "yes" && (
        <div ref={fireworkRef} className={styles.fireworksContainer} />
      )}

      <div
        className="rounded-lg p-6 text-center"
        style={{
          backgroundColor: "#FFF8F0",
          color: "#6B3A3A",
          fontFamily: "var(--font-dancing-script)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          zIndex: 30,
        }}
      >
        {answer === "yes" ? (
          <>
            <video
              autoPlay
              loop
              playsInline
              muted
              style={{
                maxWidth: "380px",
                width: "100%",
                maxHeight: "60vh",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            >
              <source src="/quiz/yippee.mp4" type="video/mp4" />
            </video>
            <p className="text-2xl" style={{ fontFamily: "var(--font-dancing-script)" }}>
              I knew you would! Happy Valentine&apos;s Day! ❤️
            </p>
          </>
        ) : (
          <>
            <Image
              src={answer === "no" ? "/quiz/angry_cat.jpeg" : "/cat_rose.jpg"}
              alt={answer === "no" ? "No is not an option" : "A cat with a rose"}
              width={380}
              height={380}
              className="rounded-md"
              style={{ objectFit: "cover" }}
            />

            {answer === "ask" ? (
              <>
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-playfair-display)" }}
                >
                  Sharlyn, will you be my Valentine?
                </p>
                <div style={{ display: "flex", gap: "16px" }}>
                  <button
                    onClick={() => setAnswer("yes")}
                    style={{
                      backgroundColor: "#D4687A",
                      color: "#FFF8F0",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 32px",
                      fontFamily: "var(--font-playfair-display)",
                      fontSize: "1.15rem",
                      cursor: "pointer",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setAnswer("no")}
                    style={{
                      backgroundColor: "#e8d5c0",
                      color: "#6B3A3A",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 32px",
                      fontFamily: "var(--font-playfair-display)",
                      fontSize: "1.15rem",
                      cursor: "pointer",
                    }}
                  >
                    No
                  </button>
                </div>
              </>
            ) : (
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair-display)" }}
              >
                No is not an option.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
