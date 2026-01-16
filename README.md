# SahiHai - Your All-in-One Assistant

**SahiHai** is a powerful mobile application designed to be your everyday assistant, helping you with a variety of tasks, from checking vehicle challans to identifying product manufacturing dates.

## Features

*   **Vehicle Challan Check**: Instantly check for traffic challans for any vehicle.
*   **Product Age Scan**: Scan barcodes to determine the manufacturing date of a product.
*   **AI-Powered Chat**: Get answers and assistance from a cutting-edge AI.
*   **And more!**

## Project Structure

The project is divided into two main parts:

*   `client/`: A React Native (Expo) mobile application.
*   `server/`: A Node.js (Express) backend that powers the app.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm
*   Expo CLI
*   MongoDB (optional, for local database)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd SahiHai
    ```

2.  **Install server dependencies:**
    ```bash
    npm install --prefix server
    ```

3.  **Install client dependencies:**
    ```bash
    npm install --prefix client
    ```

### Configuration

#### Server

1.  Create a `.env` file in the `server` directory by copying the example file:
    ```bash
    cp server/.env.example server/.env
    ```

2.  Edit `server/.env` and fill in the required environment variables:
    *   `GEMINI_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`: API keys for the AI services.
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `CHALLAN_API_ENDPOINT`, `CHALLAN_API_KEY`: To enable the challan checking feature, you need to subscribe to a commercial challan API provider and enter the details here. If you leave these blank, the app will return mock data for the challan check.

#### Client

1.  Create a `.env` file in the `client` directory:
    ```bash
    cp client/.env.example client/.env
    ```

2.  Edit `client/.env` and set `EXPO_PUBLIC_API_URL` to the IP address and port of your running backend server (e.g., `http://192.168.1.100:5051`).

### Running the Application

1.  **Start the server:**
    ```bash
    npm start --prefix server
    ```

2.  **Start the client:**
    ```bash
    npm start --prefix client
    ```

    This will open the Expo developer tools in your browser. You can then run the app on a physical device using the Expo Go app or in an emulator.

---

For more detailed information, please refer to the `README.md` files within the `client` and `server` directories.