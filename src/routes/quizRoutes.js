const express = require("express");
const {
  createQuiz,
  getQuiz,
  getAllQuizzes
} = require("../controllers/quizController");
const router = express.Router();

router.post("/", createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuiz);

module.exports = router;
