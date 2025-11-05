// 📄 src/pages/Quiz.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fallback question set
  const fallbackQuestions = {
    java: [
      {
        question: "Which method is the entry point for a Java program?",
        options: ["start()", "main()", "run()", "execute()"],
        correct: "main()",
      },
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["this", "extends", "super", "implements"],
        correct: "extends",
      },
    ],
    python: [
      {
        question: "Which keyword defines a function in Python?",
        options: ["function", "def", "lambda", "define"],
        correct: "def",
      },
      {
        question: "Which data type is immutable in Python?",
        options: ["List", "Tuple", "Dictionary", "Set"],
        correct: "Tuple",
      },
    ],
  };

  const generateFallback = (topic) => {
    const t = topic.toLowerCase();
    return fallbackQuestions[t] || fallbackQuestions["java"];
  };

  const generateQuestions = async () => {
    if (!topic.trim()) return alert("Please enter a topic!");
    setLoading(true);
    setQuestions([]);
    setFinished(false);
    setScore(0);
    setCurrent(0);

    try {
      const res = await fetch("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: 5, difficulty: "basic" }),
      });
      const data = await res.json();

      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setQuestions(generateFallback(topic));
      }
    } catch (err) {
      console.error(err);
      setQuestions(generateFallback(topic));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (selected === questions[current].correct) setScore((prev) => prev + 1);
    setSelected(null);

    if (current + 1 === questions.length) {
      setFinished(true);
      await API.post("/results", {
        title: `${topic} Quiz`,
        technology: topic.toLowerCase(),
        level: "basic",
        totalQuestions: questions.length,
        correct: score + (selected === questions[current].correct ? 1 : 0),
      });
    } else {
      setCurrent(current + 1);
    }
  };

  const restart = () => {
    setTopic("");
    setQuestions([]);
    setFinished(false);
    setScore(0);
    setCurrent(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex justify-center items-center p-4">
      <motion.div
        className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-2xl w-full text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!questions.length && !finished && (
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-center mb-4">
              ⚡ Generate Your Quiz
            </h1>
            <input
              type="text"
              placeholder="Enter a topic (e.g. Java, Python, AI)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/80"
            />
            <button
              onClick={generateQuestions}
              disabled={loading}
              className="bg-gradient-to-r from-green-400 to-blue-500 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              {loading ? "Generating..." : "Start Quiz"}
            </button>
          </div>
        )}

        {/* QUIZ SECTION */}
        {!finished && questions.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-6 text-center">
                {questions[current].question}
              </h2>

              <div className="flex flex-col gap-3">
                {questions[current].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelected(opt)}
                    className={`p-3 rounded-xl text-left font-medium transition-all ${
                      selected === opt
                        ? "bg-blue-500 text-white"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!selected}
                className="w-full mt-6 bg-gradient-to-r from-indigo-400 to-blue-500 py-3 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50"
              >
                {current + 1 === questions.length ? "Finish" : "Next"}
              </button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* RESULT SECTION */}
        {finished && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-2 text-green-300">
              🎉 Quiz Completed!
            </h2>
            <p className="text-xl mb-4">
              You scored <span className="font-bold">{score}</span> out of{" "}
              {questions.length}
            </p>
            <p className="text-white/80 mb-6">
              Accuracy:{" "}
              <span className="font-semibold">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </p>
            <button
              onClick={restart}
              className="bg-gradient-to-r from-green-400 to-blue-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Try Another Quiz
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
