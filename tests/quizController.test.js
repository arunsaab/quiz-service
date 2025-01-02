const request = require("supertest");
const express = require("express");
const quizController = require("../src/controllers/quizController");

const app = express();
app.use(express.json());

// Mock in-memory quizzes array
const quizzes = [];
jest.mock("../src/models/quizModel", () => quizzes);

// Routes
app.post("/api/quizzes", quizController.createQuiz);
app.get("/api/quizzes/:id", quizController.getQuiz);

describe("Quiz API", () => {
  // Reset quizzes array before each test
  beforeEach(() => {
    quizzes.length = 0;
  });

  describe("POST /api/quizzes", () => {
    it("should create a quiz successfully", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .send({
          title: "Cricket Quiz",
          questions: [
            {
              text: "Who won the 2011 World Cup?",
              options: ["India", "Australia", "Pakistan", "Sri Lanka"],
              correct_option: 0
            }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Quiz created successfully.");
      expect(res.body.quiz).toHaveProperty("id", 1);
      expect(quizzes.length).toBe(1);
    });

    it("should return 400 if title is missing", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .send({
          questions: [
            {
              text: "Who won the 2011 World Cup?",
              options: ["India", "Australia", "Pakistan", "Sri Lanka"],
              correct_option: 0
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Title and questions are required."
      );
    });

    it("should return 400 if questions are not an array", async () => {
      const res = await request(app).post("/api/quizzes").send({
        title: "Invalid Quiz",
        questions: "Not an array"
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Title and questions are required."
      );
    });

    it("should return 400 if a question has fewer than 4 options", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .send({
          title: "Cricket Quiz",
          questions: [
            {
              text: "Who won the 2011 World Cup?",
              options: ["India", "Australia"], // Only 2 options
              correct_option: 0
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Question 1 must have exactly 4 options."
      );
    });

    it("should return 400 if correct_option index is out of bounds", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .send({
          title: "Cricket Quiz",
          questions: [
            {
              text: "Who won the 2011 World Cup?",
              options: ["India", "Australia", "Pakistan", "Sri Lanka"],
              correct_option: 5 // Out of bounds
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Question 1: The correct_option index is out of range."
      );
    });
  });

  describe("GET /api/quizzes/:id", () => {
    it("should fetch a quiz by ID", async () => {
      quizzes.push({
        id: 1,
        title: "Cricket Quiz",
        questions: [
          {
            id: 1,
            text: "Who won the 2011 World Cup?",
            options: ["India", "Australia", "Pakistan", "Sri Lanka"],
            correct_option: 0
          }
        ]
      });

      const res = await request(app).get("/api/quizzes/1");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "Cricket Quiz");
      expect(res.body.questions[0]).not.toHaveProperty("correct_option"); // Correct answer hidden
    });

    it("should return 404 if quiz is not found", async () => {
      const res = await request(app).get("/api/quizzes/99");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Quiz not found.");
    });
  });
});
