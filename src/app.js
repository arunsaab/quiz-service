const express = require("express");
const app = express();
const quizRoutes = require("./routes/quizRoutes");
const answerRoutes = require("./routes/answerRoutes");

app.use(express.json());

// Routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/quizzes", answerRoutes);

module.exports = app;
