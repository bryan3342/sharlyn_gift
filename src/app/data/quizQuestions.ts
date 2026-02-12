export interface QuizQuestion {
  id: number;
  question: string;
  image: string;
  options: string[];
  correctIndex: number;
  hint: string;
  imageHeight?: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Where did we go on our first date?",
    image: "/quiz/q1.png",
    options: ["Sugar Fish", "La Nolita", "Taco Joint", "Strand Bookstore"],
    correctIndex: 0,
    hint: "It was a 'birthday gift'",
    imageHeight: 340,
  },
  {
    id: 2,
    question: "Where was our first vacation together?",
    image: "/quiz/q2.png",
    options: ["Boston", "Vermont", "Italy", "London"],
    correctIndex: 1,
    hint: "Hallucination Tree",
  },
  {
    id: 3,
    question: "What was the restaurant I wanted to take you to for Valentine's Day in 2025?",
    image: "/quiz/q3.png",
    options: ["Tacombi", "El Torro", "The Oregano", "Pasta Fresca"],
    correctIndex: 2,
    hint: "It was Italian...",
    imageHeight: 400,
  },
  {
    id: 4,
    question: "Which song did we sing together at a concert?",
    image: "/quiz/q4.png",
    options: ["Mystical Magical", "Maple Syrup", "Like Him", "Kilby Girl"],
    correctIndex: 3,
    hint: "We sang along to it.",
  },
  {
    id: 5,
    question: "What is my favorite thing about you?",
    image: "/quiz/q5.png",
    options: ["Everything", "Todo", "Tout", "Tutti"],
    correctIndex: 0,
    hint: "Rhymes with chervything",
  },
];

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
