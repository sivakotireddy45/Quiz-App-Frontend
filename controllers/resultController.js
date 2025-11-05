import Result from "../models/resultModel.js";

// Create new result
export async function createResult(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { title, technology, level, totalQuestions, correct, wrong } = req.body;

    if (!title || !technology || !level || totalQuestions === undefined || correct === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const computedWrong =
      wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));

    const payload = {
      title: String(title).trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong: computedWrong,
      user: req.user.id
    };

    const created = await Result.create(payload);

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      result: created
    });

  } catch (err) {
    console.error("Error creating result:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to create result"
    });
  }
}

// List results of a user
export async function listResults(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { technology } = req.query;
    const query = { user: req.user.id };

    if (technology && technology.toLowerCase() !== 'all') {
      query.technology = technology;
    }

    const items = await Result.find(query).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: items.length,
      results: items
    });

  } catch (err) {
    console.error("ListResults Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch results"
    });
  }
}
