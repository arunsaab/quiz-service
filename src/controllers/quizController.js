const quizzes = require("../models/quizModel");

exports.createQuiz = (req, res) => {
  const { title, questions } = req.body;

  // Validate title and questions
  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Title and questions are required." });
  }

  // Validate that each question has exactly 4 options
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    if (
      !question.text ||
      !Array.isArray(question.options) ||
      question.options.length !== 4
    ) {
      return res.status(400).json({
        error: `Question ${i + 1} must have exactly 4 options.`
      });
    }

    // Validate that correct_option is within the range of the options array
    if (
      question.correct_option < 0 ||
      question.correct_option >= question.options.length
    ) {
      return res.status(400).json({
        error: `Question ${i + 1}: The correct_option index is out of range.`
      });
    }
  }

  // Create the quiz
  const quizId = quizzes.length + 1;
  const quiz = {
    id: quizId,
    title,
    questions: questions.map((q, index) => ({
      id: index + 1,
      text: q.text,
      options: q.options,
      correct_option: q.correct_option
    }))
  };

  quizzes.push(quiz);
  res.status(201).json({ message: "Quiz created successfully.", quiz });
};

exports.getQuiz = (req, res) => {
  const quizId = parseInt(req.params.id);
  const quiz = quizzes.find((q) => q.id === quizId);

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found." });
  }

  const questionsWithoutAnswers = quiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options
  }));

  res.status(200).json({
    id: quiz.id,
    title: quiz.title,
    questions: questionsWithoutAnswers
  });
};

exports.getAllQuizzes = (req, res) => {
  if (quizzes.length === 0) {
    return res.status(404).json({ message: "No quizzes found." });
  }

  const quizzesWithoutAnswers = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options
    }))
  }));

  res.status(200).json(quizzesWithoutAnswers);
};
