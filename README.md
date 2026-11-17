# Cognify AI Chatbot

A full-stack conversational AI web app built with **Next.js**, **React** and the **Vercel AI SDK**. Users can chat with a large language model, see responses stream in real time, and keep multiple conversations that are saved in a **PostgreSQL** database.

Built as a university project to practise LLM integration, API design and full-stack application architecture.

**Live demo:** [cognify-ai-chatbot.vercel.app](https://cognify-ai-chatbot.vercel.app/)

## Features

- **Streaming responses**: AI replies appear token by token instead of after a long wait
- **Persistent conversation history**: every conversation and message is stored in PostgreSQL via Prisma ORM
- **Multiple conversations**: create, rename and delete chats from the sidebar
- **REST API** for conversations and messages, built with Next.js route handlers
- **Client-side data caching** with TanStack Query
- **Code quality checks**: GitHub Actions CI runs Prettier and ESLint on every pull request

## Tech Stack

| Area     | Technologies                                              |
| -------- | --------------------------------------------------------- |
| Frontend | Next.js (App Router), React, Tailwind CSS, TanStack Query |
| Backend  | Next.js route handlers, Vercel AI SDK                     |
| AI       | LLM via OpenRouter (OpenAI-compatible API)                |
| Database | PostgreSQL, Prisma ORM, Docker Compose                    |
| Tooling  | TypeScript/JavaScript, ESLint, Prettier, GitHub Actions   |

## Architecture

```
Browser (React + TanStack Query)
        │
        ▼
Next.js route handlers (/api/...)
        │                 │
        ▼                 ▼
OpenRouter LLM API    PostgreSQL (Prisma)
 (streamed reply)     (conversations + messages)
```

1. The user sends a message from the chat panel.
2. `/api/chat/stream` saves the user message, sends the conversation to the LLM and streams the answer back.
3. When the stream finishes, the assistant's reply is saved to the database.
4. The sidebar loads saved conversations from `/api/conversations`.

## API Endpoints

| Method   | Endpoint                           | Description                         |
| -------- | ---------------------------------- | ----------------------------------- |
| `GET`    | `/api/conversations`               | List all conversations              |
| `POST`   | `/api/conversations`               | Create a new conversation           |
| `PATCH`  | `/api/conversations/[id]`          | Rename a conversation               |
| `DELETE` | `/api/conversations/[id]`          | Delete a conversation               |
| `GET`    | `/api/conversations/[id]/messages` | Get the messages of a conversation  |
| `POST`   | `/api/conversations/[id]/messages` | Add a message to a conversation     |
| `POST`   | `/api/chat/stream`                 | Send a message and stream the reply |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for the local PostgreSQL database)
- An [OpenRouter](https://openrouter.ai) API key

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/raufmmdly87/cognify-ai-chatbot.git
cd cognify-ai-chatbot

# 2. Install dependencies
npm install

# 3. Create your environment file and add your keys
cp .env.example .env

# 4. Start PostgreSQL
docker compose up -d

# 5. Apply database migrations
npx prisma migrate deploy

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  api/                 # REST API route handlers
  conversations/[id]/  # Conversation page
components/
  chat/                # Chat panel, message list, input
  sidebar/             # Conversation list and actions
lib/
  ai.js                # LLM provider configuration
  data/chat.js         # Database access functions
prisma/
  schema.prisma        # Database models
```

## Author

**Rauf Mammadli**: M.Sc. Data Science student at FAU Erlangen-Nürnberg

[GitHub](https://github.com/raufmmdly87)
