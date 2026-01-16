# SahiHai Backend

This directory contains the Node.js (Express) backend for the SahiHai application.

## Features

The backend provides a range of APIs, including:

-   **Authentication**: User signup and login.
-   **AI Chat**: Real-time chat with AI models.
-   **Challan Check**: Check for vehicle challans.
-   **Scan & Analyze**: Analyze images and audio for information.
-   **And more...**

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in this directory by copying the example:

```bash
cp .env.example .env
```

Now, open `.env` and fill in the following variables:

-   `PORT`: The port for the server to run on (e.g., `5051`).
-   `NODE_ENV`: Set to `development` for local development.
-   `MONGO_URI`: (Optional) Your MongoDB connection string.
-   `GEMINI_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`: API keys for the various AI services used in the app.
-   `CORS_ORIGIN`: The origin URLs to allow for CORS, typically your client's address.

#### Challan Check API

To enable the real-time challan checking feature, you must subscribe to a commercial challan API provider. Once you have an API endpoint and key, add them to your `.env` file:

-   `CHALLAN_API_ENDPOINT`: The endpoint URL provided by your challan API service.
-   `CHALLAN_API_KEY`: Your API key for the challan service.

If these variables are not provided, the server will return mock data for the challan check feature, allowing for development without an active subscription.

### 3. Start the Server

```bash
npm start
```

The server will transpile the TypeScript code and start the application.

## Project Structure

The source code is located in the `src` directory and follows a standard Express application structure:

-   `src/controllers/`: Handles the logic for each API route.
-   `src/models/`: Defines the Mongoose schemas for the database.
-   `src/middleware/`: Contains middleware functions (e.g., for authentication).
-   `src/services/`: Houses services that interact with external APIs (like AI services).
-   `src/utils/`: Utility functions.
-   `src/index.ts`: The main entry point for the application.
