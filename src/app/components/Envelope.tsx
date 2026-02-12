"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./Envelope.module.css";
import LoveLetter from "./LoveLetter";
import QuizCard from "./QuizCard";
import { QUIZ_QUESTIONS, TOTAL_QUESTIONS } from "../data/quizQuestions";

type EnvelopePhase =
  | "idle"
  | "envelopeFading"
  | "opening"
  | "showQuestion"
  | "closing"
  | "moving"
  | "transitionMessage"
  | "transitionMessageOut"
  | "finalOpening"
  | "finalReveal";

const TRANSITION_MESSAGES = [
  "You\u2019re the light of my life and I want you to know ...",
  "You are the wind beneath my wings...",
  "You are such a special person that deserves all the love in the world...",
  "All I want to know is ...",
];

function getRandomPosition() {
  return {
    x: 15 + Math.random() * 70,
    y: 15 + Math.random() * 70,
  };
}

export default function Envelope() {
  const [phase, setPhase] = useState<EnvelopePhase>("idle");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [transitionIndex, setTransitionIndex] = useState(0);
  const isAnimating = useRef(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [bgMusicStarted, setBgMusicStarted] = useState(false);

  // Start background music immediately on page load
  useEffect(() => {
    if (bgMusicStarted) return;

    const audio = new Audio("/quiz/Elevator Music - So Chill.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    bgMusicRef.current = audio;

    // Try to play immediately
    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => setBgMusicStarted(true))
        .catch(() => {
          // Browser blocked autoplay — play on first interaction instead
          const startOnClick = () => {
            audio.play().catch(() => {});
            setBgMusicStarted(true);
          };
          document.addEventListener("click", startOnClick, { once: true });
          return () => document.removeEventListener("click", startOnClick);
        });
    }
  }, [bgMusicStarted]);

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "idle" || isAnimating.current) return;
    isAnimating.current = true;

    // Move envelope to center
    setPosition({ x: 50, y: 50 });

    // After centering, fade out envelope
    setTimeout(() => {
      setPhase("envelopeFading");
    }, 800);

    // After envelope fades, show quiz card
    setTimeout(() => {
      setPhase("opening");
    }, 1200);

    setTimeout(() => {
      setPhase("showQuestion");
      isAnimating.current = false;
    }, 1700);
  }, [phase]);

  const handleCorrectAnswer = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    if (currentQuestion >= TOTAL_QUESTIONS - 1) {
      // Last question: hide quiz, cycle through transition messages, then final reveal
      setPhase("closing");

      let t = 500;
      for (let i = 0; i < TRANSITION_MESSAGES.length; i++) {
        const showAt = t;
        const hideAt = t + 3000;
        setTimeout(() => {
          setTransitionIndex(i);
          setPhase("transitionMessage");
        }, showAt);
        setTimeout(() => {
          setPhase("transitionMessageOut");
        }, hideAt);
        t = hideAt + 800; // wait for fade-out before next message
      }

      setTimeout(() => {
        setPhase("finalOpening");
      }, t);

      setTimeout(() => {
        setPhase("finalReveal");
        isAnimating.current = false;
      }, t + 1400);
      return;
    }

    // Not last question: hide quiz, show envelope at center, move to random spot
    setPhase("closing");

    setTimeout(() => {
      setCurrentQuestion((prev) => prev + 1);
      setPosition(getRandomPosition());
      setPhase("moving");
    }, 500);

    setTimeout(() => {
      setPhase("idle");
      isAnimating.current = false;
    }, 1300);
  }, [currentQuestion]);

  const showQuizOverlay = phase === "opening" || phase === "showQuestion";
  const showQuizOverlayOut = phase === "closing";

  const envelopeClasses = [
    styles.envelope,
    // Hide envelope during quiz and transition message phases
    phase === "envelopeFading" ||
    phase === "opening" ||
    phase === "showQuestion" ||
    phase === "closing" ||
    phase === "transitionMessage" ||
    phase === "transitionMessageOut"
      ? styles.envelopeHidden
      : "",
    // Final reveal uses flap animation
    phase === "finalOpening" || phase === "finalReveal"
      ? styles.flapOpening
      : "",
    phase === "finalOpening" || phase === "finalReveal"
      ? styles.letterReveal
      : "",
    // Pulse when idle
    phase === "idle" ? styles.pulse : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Quiz card as fixed-center overlay */}
      {showQuizOverlay && (
        <div className={styles.quizOverlay}>
          <QuizCard
            question={QUIZ_QUESTIONS[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={TOTAL_QUESTIONS}
            onCorrectAnswer={handleCorrectAnswer}
            disabled={phase !== "showQuestion"}
          />
        </div>
      )}
      {showQuizOverlayOut && (
        <div className={styles.quizOverlayOut}>
          <QuizCard
            question={QUIZ_QUESTIONS[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={TOTAL_QUESTIONS}
            onCorrectAnswer={handleCorrectAnswer}
            disabled={true}
          />
        </div>
      )}

      {/* Transition messages */}
      {phase === "transitionMessage" && (
        <div key={transitionIndex} className={styles.transitionMessage}>
          {TRANSITION_MESSAGES[transitionIndex]}
        </div>
      )}
      {phase === "transitionMessageOut" && (
        <div key={transitionIndex} className={styles.transitionMessageOut}>
          {TRANSITION_MESSAGES[transitionIndex]}
        </div>
      )}

      {/* Envelope */}
      <div
        className={styles.envelopeWrapper}
        style={{
          transform: `translate(calc(${position.x}vw - 50%), calc(${position.y}vh - 50%))`,
        }}
      >
        <div className={envelopeClasses} onClick={handleClick}>
          <div className={styles.flapContainer}>
            <div className={styles.flap} />
          </div>

          <div className={styles.envelopeBody}>
            <div className={styles.envelopeInner} />
          </div>

          <div className={styles.letterContainer}>
            <LoveLetter onYes={stopBgMusic} />
          </div>
        </div>
      </div>
    </>
  );
}
