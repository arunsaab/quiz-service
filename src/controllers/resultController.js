const results = require("../models/resultModel");

exports.getResults = (req, res) => {
  const quizId = parseInt(req.params.quizId, 10); // Ensure integer comparison
  const userId = parseInt(req.params.userId, 10); // Ensure integer comparison

  const userResult = results.find(
    (r) => r.quiz_id === quizId && r.user_id === userId
  );

  if (!userResult) {
    return res
      .status(404)
      .json({ error: "Results not found for this user and quiz." });
  }

  res.status(200).json({
    quiz_id: userResult.quiz_id,
    user_id: userResult.user_id,
    score: userResult.score,
    answers: userResult.answers
  });
};
