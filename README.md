# SahiHai (2025 Refactor)

SahiHai is an advanced "Everyday Assistant" application designed for the Indian market, featuring an AI-powered chat interface, high-availability architecture, and localized utilities.

## Directory Structure

This project follows a monorepo-style structure:

- **client/**: The React Native (Expo) mobile application.
- **server/**: The Node.js backend API and AI agent.

---

## Client (React Native / Expo)

Built with Expo SDK 52, Expo Router, and Gluestack UI.

### Key Features:
- **Navigation**: File-based routing via `expo-router`.
- **UI**: NativeWind (Tailwind CSS) & Gluestack UI.
- **State**: TanStack Query (React Query) for optimistic updates.
- **Utilities**: UPI Intent, Gold Rates, PNR Status, Challan Check.
- **Gamification**: Scratch cards and confetti effects.

### Getting Started:
1. `cd client`
2. `npm install`
3. `npm start` (Run on iOS/Android simulator or generic Expo Go)

---

## Server (Node.js / Clean Architecture)

Built with Express, TypeScript, and LangGraph.

### Key Features:
- **Architecture**: Strict "Clean Architecture" (Domain, Use Cases, Infra, Interface Adapters).
- **AI**: LangGraph-based stateful agent with provider switching (OpenAI, Anthropic).
- **Scalability**: Sticky Sessions + Redis for clustering support on multi-core systems.
- **Database**: MongoDB (Mongoose) for long-term storage.

### Getting Started:
1. `cd server`
2. `npm install`
3. Set up `.env` (MongoDB URI, Redis URL, API Keys)
4. `npm run build`
5. `npm start`

---

## Environment Variables

Ensure you have `.env` files in both `client/` and `server/` with appropriate keys (OpenAI API Key, MongoDB URI, etc.).