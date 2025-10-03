import { QuizQuestion } from "@/types";

// Mock Vim quiz questions for development/testing
export const mockQuestions: QuizQuestion[] = [
  {
    question: "What is the command to save a file in Vim?",
    correct_answer: ":w",
    incorrect_answers: [":s", ":save", ":savefile"],
  },
  {
    question: "How do you exit Vim without saving?",
    correct_answer: ":q!",
    incorrect_answers: [":quit", ":exit", ":close"],
  },
  {
    question: "What key do you press to enter insert mode in Vim?",
    correct_answer: "i",
    incorrect_answers: ["a", "o", "I"],
  },
  {
    question: "How do you delete the current line in Vim?",
    correct_answer: "dd",
    incorrect_answers: ["dl", "D", "d$"],
  },
  {
    question: "What command moves the cursor to the beginning of the line?",
    correct_answer: "0",
    incorrect_answers: ["^", "$", "gg"],
  },
  {
    question: "How do you search for text in Vim?",
    correct_answer: "/text",
    incorrect_answers: ["?text", ":search text", "\\text"],
  },
  {
    question: "What command undoes the last change in Vim?",
    correct_answer: "u",
    incorrect_answers: ["U", "Ctrl+z", ":undo"],
  },
  {
    question: "How do you move to the end of the file in Vim?",
    correct_answer: "G",
    incorrect_answers: ["gg", ":$", ":end"],
  },
  {
    question: "What command replaces text in Vim?",
    correct_answer: ":%s/old/new/g",
    incorrect_answers: [
      ":replace old new",
      ":substitute old new",
      ":find old new",
    ],
  },
  {
    question: "How do you copy (yank) the current line in Vim?",
    correct_answer: "yy",
    incorrect_answers: ["cc", "dd", "pp"],
  },
  {
    question: "What command pastes text in Vim?",
    correct_answer: "p",
    incorrect_answers: ["P", "v", "y"],
  },
  {
    question: "How do you open a new file in Vim?",
    correct_answer: ":e filename",
    incorrect_answers: [":new filename", ":open filename", ":file filename"],
  },
  {
    question: "What command moves the cursor one word forward?",
    correct_answer: "w",
    incorrect_answers: ["f", "t", "e"],
  },
  {
    question: "How do you delete from cursor to end of line?",
    correct_answer: "D",
    incorrect_answers: ["d$", "dl", "dd"],
  },
  {
    question: "What command saves and exits Vim?",
    correct_answer: ":wq",
    incorrect_answers: [":x", ":w", ":q"],
  },
  {
    question: "In what year was Vim 8.0 released?",
    correct_answer: "2016",
    incorrect_answers: ["2014", "2018", "2020"],
  },
  {
    question: "In what year was the first version of Vi released?",
    correct_answer: "1976",
    incorrect_answers: ["1972", "1980", "1984"],
  },
];

// Function to get random questions
export function getRandomQuestions(count: number = 10): QuizQuestion[] {
  const shuffled = [...mockQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, mockQuestions.length));
}

