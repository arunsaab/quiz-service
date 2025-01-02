const request = require("supertest");
const express = require("express");
const answerController = require("../src/controllers/answerController");

const app = express();
app.use(express.json());

// Mock in-memory data
const quizzes = [];
const results = [];
jest.mock("../src/models/quizModel", () => quizzes);
jest.mock("../src/models/resultModel", () => results);

// Routes
app.post(
  "/api/quizzes/:quizId/questions/:questionId/answer",
  answerController.submitAnswer
);

describe("Submit Answer API", () => {
  beforeEach(() => {
    // Reset in-memory data before each test
    quizzes.length = 0;
    results.length = 0;

    // Add a sample quiz
    quizzes.push({
      id: 1,
      title: "Cricket Quiz",
      questions: [
        {
          id: 1,
          text: "Who won the 2011 World Cup?",
          options: ["India", "Australia", "Pakistan", "Sri Lanka"],
          correct_option: 0
        },
        {
          id: 2,
          text: "Who scored the most runs in ODI cricket?",
          options: [
            "Virat Kohli",
            "Ricky Ponting",
            "Sachin Tendulkar",
            "Jacques Kallis"
          ],
          correct_option: 2
        }
      ]
    });
  });

  it("should submit a correct answer successfully", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/questions/1/answer")
      .send({
        selected_option: 0,
        user_id: "user123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("is_correct", true);
    expect(res.body).not.toHaveProperty("correct_option"); // Correct answer not returned
    expect(results.length).toBe(1);
    expect(results[0]).toMatchObject({
      quiz_id: 1,
      user_id: "user123",
      score: 1,
      answers: [{ question_id: 1, selected_option: 0, is_correct: true }]
    });
  });

  it("should submit an incorrect answer and return the correct answer", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/questions/1/answer")
      .send({
        selected_option: 1,
        user_id: "user123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("is_correct", false);
    expect(res.body).toHaveProperty("correct_option", 0); // Correct answer returned
    expect(results.length).toBe(1);
    expect(results[0]).toMatchObject({
      quiz_id: 1,
      user_id: "user123",
      score: 0,
      answers: [{ question_id: 1, selected_option: 1, is_correct: false }]
    });
  });

  it("should return 400 if selected_option or user_id is missing", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/questions/1/answer")
      .send({
        selected_option: 1
      }); // Missing user_id

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Selected option and user ID are required."
    );
  });

  it("should return 404 if quiz is not found", async () => {
    const res = await request(app)
      .post("/api/quizzes/99/questions/1/answer")
      .send({
        selected_option: 0,
        user_id: "user123"
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Quiz not found.");
  });

  it("should return 404 if question is not found", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/questions/99/answer")
      .send({
        selected_option: 0,
        user_id: "user123"
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Question not found.");
  });

  it("should not allow duplicate submissions for the same question", async () => {
    // First submission
    await request(app).post("/api/quizzes/1/questions/1/answer").send({
      selected_option: 0,
      user_id: "user123"
    });

    // Duplicate submission
    const res = await request(app)
      .post("/api/quizzes/1/questions/1/answer")
      .send({
        selected_option: 1,
        user_id: "user123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("is_correct", true); // Original answer was correct
    expect(results.length).toBe(1);
    expect(results[0].score).toBe(1); // Score remains unaffected
    expect(results[0].answers.length).toBe(1); // No duplicate entries
  });
});
