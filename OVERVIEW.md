# 🚀 Prompt Dashboard

## Project Overview

The Prompt Dashboard is a modern web application designed for managing, organizing, and utilizing AI prompts. It serves as a centralized repository where users can create, edit, and categorize their collection of prompts for various AI interactions.

## ✨ Key Features

- **Prompt Management**: Create, edit, view, and delete AI prompts
- **Tagging System**: Organize prompts with customizable tags
- **Search & Filter**: Easily find prompts using text search and tag filters
- **Dual Storage Options**: 
  - Local storage (browser-based)
  - Cloud storage (Supabase)
  - Hybrid mode with synchronization
- **AI Assistant**: Get help generating new prompts
- **User Authentication**: Supabase-powered login for cloud storage

## 🛠️ Technical Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React Hooks and Context
- **Routing**: React Router
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Backend/Cloud Storage**: Supabase

## 📁 Project Structure

- `src/`: Main source code
  - `components/`: UI components
    - `ui/`: Shadcn UI components
  - `hooks/`: Custom React hooks
  - `integrations/`: Third-party integrations
    - `supabase/`: Supabase client and types
  - `lib/`: Utility functions and core logic
  - `pages/`: Application pages
  - `types/`: TypeScript type definitions
- `public/`: Static assets
- `supabase/`: Supabase configuration

## 🔄 Data Flow

1. **Local Storage**: Prompts are stored in the browser's localStorage
2. **Supabase Storage**: Cloud storage option for persistence across devices
3. **Dual Mode**: Can synchronize between local and cloud storage

## 💻 Getting Started

1. Clone the repository
2. Install dependencies: `npm install` or `bun install`
3. Start the development server: `npm run dev` or `bun run dev`
4. Access the application at http://localhost:5173

## 🔒 Authentication

The application uses Supabase authentication for cloud storage features. Users can:
- Create an account or log in to access cloud storage
- Use the application without authentication for local-only storage

## 🔮 Recent Improvements

- Enhanced UI with improved styling and icon-based send button
- Automatic API key configuration
- Workspace context in prompts
- Integration with embedding search functionality

## 🚧 Future Development

- Enhanced AI assistance features
- More storage backend options
- Team collaboration features
- Prompt version history
- Extended tagging and categorization options 