# Project Title

## Description

This project is a web application that provides a platform for users to subscribe and unsubscribe from courses. It is built using TypeScript and JavaScript, and follows Domain-Driven Design principles. The application is divided into several layers, including the application layer for use case-specific logic, the domain layer for business logic, and the infrastructure layer for database operations. The project uses Mongoose for object data modeling (ODM) and Express.js for building the API.

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/yourrepository.git`
2. Navigate to the project directory: `cd yourrepository`
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## Technologies Used

- TypeScript: Used for static typing and enhancing JavaScript code.
- JavaScript: The main programming language used.
- NPM: The package manager for managing dependencies.
- Express.js: The web application framework used for building the API.
- Mongoose: Used for object data modeling (ODM), managing relationships between data, and providing schema validation.

## Project Structure

- `src/`: This directory contains all the source code.
    - `Application/`: This directory contains application-specific logic.
    - `Domain/`: This directory contains all the domain entities and services.
    - `infrastructure/`: This directory contains all the infrastructure-specific code, such as database interaction.
    - `types/`: This directory contains custom TypeScript types used in the project.

## Design Considerations

The project follows Domain-Driven Design principles. The domain layer contains the business logic, the application layer contains use case-specific logic, and the infrastructure layer handles database operations. Mongoose is used for object data modeling (ODM), managing relationships between data, and providing schema validation.

## Use Cases

#### Use Case 1: Get One Course

- Description: This use case retrieves a single course based on the provided course ID and user ID.
- Endpoint: `/courses/:courseId`
- Method: `GET`
- Request Parameters: `courseId`, `userId`
- Response: `CourseDto` or `NotFoundError`

#### Use Case 2: Get All Courses

- Description: This use case retrieves all courses for a given user ID.
- Endpoint: `/courses`
- Method: `GET`
- Request Parameters: `userId`
- Response: Array of `CourseDto` or `NotFoundError`

#### Use Case 3: Subscribe to a Course

- Description: This use case allows a user to subscribe to a course.
- Endpoint: `/courses/:courseId/subscribe`
- Method: `POST`
- Request Parameters: `courseId`, `userId`
- Response: `void` or `NotFoundError` or `ConflictError`

#### Use Case 4: Unsubscribe from a Course

- Description: This use case allows a user to unsubscribe from a course.
- Endpoint: `/courses/:courseId/unsubscribe`
- Method: `POST`
- Request Parameters: `courseId`, `userId`
- Response: `void` or `NotFoundError` or `ConflictError`

## Contributing

Guidelines for contributing to your project.

## License

Information about the license.