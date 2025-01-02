const quizzes = require("../models/quizModel");
const results = require("../models/resultModel");

exports.submitAnswer = (req, res) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { selected_option, user_id } = req.body;

  if (selected_option === undefined || user_id === undefined) {
    return res
      .status(400)
      .json({ error: "Selected option and user ID are required." });
  }

  const quiz = quizzes.find((q) => q.id === quizId);

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found." });
  }

  const question = quiz.questions.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).json({ error: "Question not found." });
  }

  let userResult = results.find(
    (r) => r.quiz_id === quizId && r.user_id === user_id
  );
  if (!userResult) {
    userResult = {
      quiz_id: quizId,
      user_id: user_id,
      score: 0,
      answers: []
    };
    results.push(userResult);
  }

  // Check if the answer already exists for the question
  const existingAnswer = userResult.answers.find(
    (a) => a.question_id === questionId
  );

  if (existingAnswer) {
    // Return the original response for the existing submission
    return res.status(200).json({
      is_correct: existingAnswer.is_correct,
      correct_option: existingAnswer.is_correct
        ? undefined
        : question.correct_option
    });
  }

  const is_correct = question.correct_option === selected_option;

  userResult.answers.push({
    question_id: questionId,
    selected_option,
    is_correct
  });
  if (is_correct) {
    userResult.score++;
  }

  res.status(200).json({
    is_correct,
    correct_option: is_correct ? undefined : question.correct_option
  });
};
