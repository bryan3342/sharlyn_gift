"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { QuizQuestion } from "../data/quizQuestions";
import styles from "./QuizCard.module.css";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  disabled: boolean;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onCorrectAnswer,
  onWrongAnswer,
  disabled,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setDisabledOptions([]);
    setShowHint(false);
    setIsCorrect(false);
  }, [question.id]);

  const handleOptionClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (disabled || isCorrect || disabledOptions.includes(index)) return;

    setSelectedOption(index);

    if (index === question.correctIndex) {
      setIsCorrect(true);
      setTimeout(() => {
        onCorrectAnswer();
      }, 800);
    } else {
      setDisabledOptions((prev) => [...prev, index]);
      setShowHint(true);
      onWrongAnswer();
      setTimeout(() => {
        setSelectedOption(null);
      }, 600);
    }
  };

  const getOptionClassName = (index: number) => {
    const classes = [styles.optionButton];
    if (selectedOption === index && isCorrect) classes.push(styles.optionCorrect);
    if (selectedOption === index && !isCorrect) classes.push(styles.optionWrong);
    return classes.join(" ");
  };

  return (
    <div className={styles.quizCard} onClick={(e) => e.stopPropagation()}>
      <div className={styles.progressDots}>
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${
              i < questionNumber - 1
                ? styles.dotCompleted
                : i === questionNumber - 1
                  ? styles.dotCurrent
                  : ""
            }`}
          />
        ))}
      </div>

      <Image
        src={question.image}
        alt="Quiz question"
        width={340}
        height={question.imageHeight ?? 220}
        className={styles.quizImage}
        style={{ objectFit: "cover", height: question.imageHeight ? `${question.imageHeight}px` : undefined }}
      />

      <p className={styles.questionText}>{question.question}</p>

      <div className={styles.optionsGrid}>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClassName(index)}
            onClick={(e) => handleOptionClick(e, index)}
            disabled={disabled || isCorrect || disabledOptions.includes(index)}
          >
            {option}
          </button>
        ))}
      </div>

      {showHint && !isCorrect && (
        <p className={styles.hintText}>Hint: {question.hint}</p>
      )}
      {isCorrect && <p className={styles.correctText}>Correct!</p>}
    </div>
  );
}
