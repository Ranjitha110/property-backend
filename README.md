# Property Backend API

A RESTful backend service for managing property listings with user authentication, built using **Node.js**, **TypeScript**, **Express**, **MongoDB**, and **Redis** for caching.

---

## Features

- User registration and login with JWT authentication
- CRUD operations for property listings
- Secure endpoints with token-based authorization
- Advanced filtering and search capabilities
- Redis caching for faster responses on frequently requested data
- Data validation and error handling
- Written fully in TypeScript for better type safety
- MongoDB as the primary database

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB & Mongoose
- Redis for caching
- JSON Web Tokens (JWT)
- dotenv for environment variables

---

## Getting Started

### Prerequisites

- Node.js installed (v14+ recommended)
- MongoDB instance (local or cloud e.g., MongoDB Atlas)
- Redis server installed and running locally or accessible remotely
- Git installed

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Ranjitha110/property-backend.git
   cd property-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server (if you have a build step, run `npm run build` first)

   ```bash
   npm start
   ```

5. The backend will run at `http://localhost:5000`

---

## API Endpoints

### Authentication

- **POST** `/api/auth/register` — Register a new user  
- **POST** `/api/auth/login` — Login and receive a JWT token

### Properties

- **GET** `/api/properties` — Get all properties (with caching)  
- **POST** `/api/properties` — Add a new property (Authenticated)  
- **GET** `/api/properties/:id` — Get property details by ID  
- **PUT** `/api/properties/:id` — Update property by ID (Authenticated)  
- **DELETE** `/api/properties/:id` — Delete property by ID (Authenticated)

---

## Testing the API

You can use tools like [Postman](https://www.postman.com/) to send HTTP requests and test the API endpoints.

---

## Deployment

This project can be deployed on platforms like [Render](https://render.com), Heroku, or any other cloud provider supporting Node.js and Redis.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

Created by [Ranjitha Karnadi](https://github.com/Ranjitha110)  
Email: karnadiranjitha@gmail.com
