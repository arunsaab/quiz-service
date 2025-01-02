const express = require("express");
const { submitAnswer } = require("../controllers/answerController");
const { getResults } = require("../controllers/resultController");
const router = express.Router();

router.post("/:quizId/questions/:questionId/answer", submitAnswer);
router.get("/:quizId/results/:userId", getResults);

module.exports = router;
