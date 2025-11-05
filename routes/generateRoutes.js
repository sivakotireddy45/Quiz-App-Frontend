// 📄 backend/routes/generateRoutes.js
import express from "express";
import OpenAI from "openai";

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Fallback questions in case AI fails
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
    {
      question: "What is the size of int in Java?",
      options: ["16 bits", "32 bits", "64 bits", "Depends on system"],
      correct: "32 bits",
    },
  ],
  python: [
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["func", "define", "def", "lambda"],
      correct: "def",
    },
    {
      question: "Which data type is immutable in Python?",
      options: ["List", "Set", "Tuple", "Dictionary"],
      correct: "Tuple",
    },
    {
      question: "What library is commonly used for data analysis in Python?",
      options: ["Pandas", "TensorFlow", "NumPy", "Matplotlib"],
      correct: "Pandas",
    },
  ],
  civil: [
    {
      question: "What is the most common material used for building foundations?",
      options: ["Steel", "Concrete", "Wood", "Brick"],
      correct: "Concrete",
    },
    {
      question: "Which test is used to determine the strength of concrete?",
      options: ["Slump test", "Compression test", "Tensile test", "Flexural test"],
      correct: "Compression test",
    },
  ],
  ai: [
    {
      question: "What does AI stand for?",
      options: ["Artificial Integration", "Artificial Intelligence", "Automated Input", "Active Interface"],
      correct: "Artificial Intelligence",
    },
    {
      question: "Which algorithm is used for decision trees?",
      options: ["ID3", "SVM", "CNN", "KNN"],
      correct: "ID3",
    },
    {
      question: "Who is considered the father of AI?",
      options: ["Alan Turing", "Geoffrey Hinton", "John McCarthy", "Andrew Ng"],
      correct: "John McCarthy",
    },
  ],
  gk: [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Venus", "Mars", "Jupiter"],
      correct: "Mars",
    },
    {
      question: "Who wrote the Indian National Anthem?",
      options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Mahatma Gandhi", "Jawaharlal Nehru"],
      correct: "Rabindranath Tagore",
    },
  ],
};

// ✅ Utility to get random fallback questions
function getFallbackQuestions(topic, count) {
  const key = topic.toLowerCase();
  const set = fallbackQuestions[key];
  if (!set) {
    // If topic not found, return some general questions
    return fallbackQuestions["gk"].slice(0, count);
  }
  return set.slice(0, count);
}

// ✅ Main route
router.post("/", async (req, res) => {
  const { topic, count = 5, difficulty = "basic" } = req.body;

  if (!topic) {
    return res.status(400).json({ success: false, message: "Topic is required" });
  }

  try {
    const prompt = `
      Generate ${count} unique multiple-choice quiz questions on the topic "${topic}".
      Each question must have 4 distinct options and mark the correct one clearly.
      Questions should not repeat across calls.
      Vary the style, difficulty, and phrasing each time.
      Return ONLY valid JSON array in this format:
      [
        { "question": "string", "options": ["A","B","C","D"], "correct": "A" }
      ]
      `;


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const output = completion.choices[0].message.content.trim();

    let questions;
    try {
      questions = JSON.parse(output);
    } catch (err) {
      console.warn("⚠️ AI returned non-JSON output. Falling back to default.");
      questions = getFallbackQuestions(topic, count);
    }

    res.status(200).json({ success: true, topic, questions });
  } catch (error) {
    console.error("❌ AI Generation Error:", error.message);
    const fallback = getFallbackQuestions(topic, count);
    res.status(200).json({
      success: true,
      topic,
      source: "fallback",
      questions: fallback,
    });
  }
});

export default router;
