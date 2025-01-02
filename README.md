# Quiz Application

A RESTful API for managing quizzes, allowing users to create quizzes, submit answers, and fetch results.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd quiz-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm start
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Docker Setup

Use the following command to start the application using Docker Compose:

```bash
docker-compose up --build
```

## API Endpoints

### Create Quiz

**POST** `/api/quiz`

### Get Quiz

**GET** `/api/quiz/:id`

### Submit Answer

**POST** `/api/quiz/:id/answer`

### Get Results

**GET** `/api/quiz/:id/results`

## Known Issues

- Results endpoint logic is a placeholder and needs implementation.

---
# quiz-service
