# Quiz Application

A RESTful API for managing quizzes, allowing users to create quizzes, submit answers, and fetch results.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone git@github.com:arunsaab/quiz-service.git
   cd quiz-service
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

**POST** `api/quizzes`

### Get Quiz

**GET** `/api/quizzes/:id`

### Get All Quizzes

**GET** `/api/quizzes/`

### Submit Answer

**POST** `/api/quizzes/:quizId/questions/:questionId/answer`

### Get Results

**GET** `/api/:quizId/results/:userId`

## API Endpoints and Sample Payloads

### 1. **Create Quiz**

- **Endpoint**: `POST /api/quizzes`
- **Description**: This endpoint allows users to create a new quiz.
- **Request Payload**:

```json
{
  "title": "Cricket Quiz - Set 1",
  "questions": [
    {
      "text": "Who won the first-ever Cricket World Cup?",
      "options": ["West Indies", "Australia", "England", "India"],
      "correct_option": 0
    },
    {
      "text": "Which bowler has the most Test wickets?",
      "options": ["Muttiah Muralitharan", "Shane Warne", "James Anderson", "Anil Kumble"],
      "correct_option": 0
    }
  ]
}

```

### 2. **Create Quiz**

- **Endpoint**: `POST api/quizzes/1/questions/1/answer`
- **Description**: This endpoint allows submit answer.
- **Request Payload**:

```json

   {
      "selected_option": 0,
      "user_id": 12
   }


```

## Known Issues and Limitations

1. **Limited Validation on Input Data**:

   - **Issue**: While the API validates basic input (such as checking if the quiz title and questions are provided), it may not handle edge cases or complex data validation thoroughly.
   - **Impact**: This could lead to issues where users can submit incomplete or invalid data that isn’t caught by the system (e.g., empty questions or invalid formats).

2. **No Persistent Data Storage**:

   - **Issue**: The current implementation of the Quiz API stores quizzes in an in-memory array (e.g., `quizzes`), meaning all data will be lost when the application restarts.
   - **Impact**: This limitation makes the API unsuitable for production environments where persistent data storage (like a database) is required.
   - **Solution**: Integrate a database like MongoDB, PostgreSQL, or another suitable database system for persistent storage.

3. **Limited Authentication/Authorization**:

   - **Issue**: The API lacks authentication and authorization mechanisms. Anyone can create quizzes or access the API.
   - **Impact**: This may pose a security risk as there is no user authentication to control access to quiz creation or modification.
   - **Solution**: Add authentication (e.g., JWT, OAuth) to restrict access to specific endpoints, such as quiz creation or editing.

4. **Static Quiz Data (No Randomization)**:

   - **Issue**: The quizzes and questions are static and hardcoded. There’s no functionality for randomizing question order or options.
   - **Impact**: Users may encounter the same quiz in the same order, which could affect user experience, particularly in cases where quizzes are taken multiple times.
   - **Solution**: Implement randomization features for question and option order to enhance user interaction.

5. **Limited Scalability**:

   - **Issue**: Since the quiz data is stored in memory (in an array), the API does not scale well for handling large numbers of quizzes or users.
   - **Impact**: The system can crash or slow down significantly when many quizzes are created or accessed simultaneously.
   - **Solution**: Move to a database-backed approach to store quizzes and questions in a scalable way, and consider implementing pagination for quiz retrieval.

6. **No Error Handling for Server Failures**:

   - **Issue**: While basic validation is in place, there is no error handling for unexpected server failures, such as database connection issues or system crashes.
   - **Impact**: Users may encounter generic error messages without clear feedback when something goes wrong.
   - **Solution**: Implement centralized error handling (e.g., using middleware) to catch and return detailed error messages for users.

7. **No Validation for Duplicate Quiz Entries**:
   - **Issue**: The API does not check for or prevent the creation of duplicate quizzes. Users can create quizzes with identical titles, questions, and options.
   - **Impact**: This can lead to clutter and confusion, especially when users unintentionally create quizzes with the same content.
   - **Solution**: Implement a check to ensure that quizzes with identical titles or content are not duplicated, possibly by comparing quiz titles or content before creation.

---

# quiz-service
