const request = require("supertest");
const express = require("express");
const resultController = require("../src/controllers/resultController");
const app = require("../src/app");

app.use(express.json());

// Mock in-memory quizzes array
const results = [];
jest.mock("../src/models/resultModel", () => results);

// Routes

app.get("/api/:quizId/results/:userId", resultController.getResults);

describe("Get Results API", () => {
  beforeEach(() => {
    results.length = 0;
    results.push({
      quiz_id: 1,
      user_id: 123,
      score: 3,
      answers: [
        { question_id: 1, selected_option: 0, is_correct: true },
        { question_id: 2, selected_option: 1, is_correct: false },
        { question_id: 3, selected_option: 2, is_correct: true }
      ]
    });
  });

  it("should return the results for a valid quiz and user", async () => {
    const res = await request(app).get("/api/1/results/123");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("quiz_id", 1);
    expect(res.body).toHaveProperty("user_id", 123);
    expect(res.body).toHaveProperty("score", 3);
    expect(res.body.answers.length).toBe(3);
  });

  it("should return 404 if the user result is not found", async () => {
    const res = await request(app).get("/api/1/results/456");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "Results not found for this user and quiz."
    );
  });

  it("should return 404 if the quiz ID is not found", async () => {
    const res = await request(app).get("/api/999/results/123");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "Results not found for this user and quiz."
    );
  });

  it("should return 404 if the user ID is not found", async () => {
    const res = await request(app).get("/api/1/results/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "Results not found for this user and quiz."
    );
  });
});
