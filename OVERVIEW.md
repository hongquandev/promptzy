# 🚀 AI Prompt Dashboard

## Project Overview

The AI Prompt Dashboard is a modern web application designed for managing, organizing, and utilizing AI prompts. It serves as a centralized repository where users can create, edit, and categorize their collection of prompts for various AI models and use cases.

## ✨ Key Features

- **Prompt Management**: Create, edit, view, and delete AI prompts
- **Prompt Types**: Support for both system prompts and task prompts
- **Tagging System**: Organize prompts with customizable tags
- **Search & Filter**: Easily find prompts using full-text search and tag filtering
- **Dual Storage Options**:
  - Local storage (browser-based)
  - Cloud storage (Supabase)
  - Hybrid mode with synchronization between both
- **AI Assistant**: Generate new prompt ideas with AI help using Pollinations.ai API
- **User Authentication**: Supabase-powered login for cloud storage
- **Responsive Design**: Clean, modern UI that works on all devices

## 🛠️ Technical Stack

- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React Hooks
- **Routing**: React Router 6
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Backend/Cloud Storage**: Supabase
- **Toast Notifications**: Custom toast hook and Sonner

## 📁 Project Structure

- `src/`: Main source code
  - `components/`: UI components
    - `ui/`: Shadcn UI components
    - `AIAssistant.tsx`: AI-powered prompt generator
    - `PromptCard.tsx`: Display component for individual prompts
    - `PromptForm.tsx`: Form for adding/editing prompts
    - `TagInput.tsx`: Component for managing tags
  - `hooks/`: Custom React hooks
    - `use-toast.ts`: Hook for toast notifications
    - `use-mobile.tsx`: Hook for responsive design
  - `integrations/`: Third-party integrations
    - `supabase/`: Supabase client and types
  - `lib/`: Utility functions and core logic
    - `promptStore.ts`: Local storage operations
    - `supabasePromptStore.ts`: Supabase storage operations
    - `systemPromptStore.ts`: System prompt management
  - `pages/`: Application pages
    - `Index.tsx`: Main dashboard page
  - `types/`: TypeScript type definitions
- `public/`: Static assets
- `supabase/`: Supabase configuration

## 🔄 Data Flow

1. **Local Storage**: Prompts are stored in the browser's localStorage
   - Uses key-value pairs for prompts and tags
   - Automatically extracts and stores unique tags
2. **Supabase Storage**: Cloud storage option for persistence across devices
   - Custom table schema for prompts with additional metadata
   - User authentication for multi-user support
3. **Dual Mode**: Can synchronize between local and cloud storage
   - Fallback to local storage if cloud storage fails
   - Option to use both simultaneously

## 💻 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`, `bun install`, or `yarn install`
3. Start the development server: `npm run dev`, `bun run dev`, or `yarn dev`
4. Access the application at http://localhost:8080

## 🔒 Authentication

The application uses Supabase authentication for cloud storage features. Users can:
- Create an account or log in to access cloud storage
- Use the application without authentication for local-only storage
- Configure custom Supabase credentials in the settings

## 🧠 AI Assistant

The application includes an AI Assistant feature that:
- Helps users generate new prompt ideas
- Supports both system and task prompt generation
- Uses the Pollinations.ai API with streaming responses
- Allows customization of the system prompt used for generation

## 🔮 Recent Improvements

- Enhanced UI with improved styling and responsive design
- AI Assistant with streaming response support
- Prompt type categorization (system/task)
- Customizable system prompt for AI generation
- Improved Supabase integration with fallback mechanisms

## 🚧 Future Development

- Prompt version history
- AI prompt templates
- Shared prompt libraries
- Additional storage backends
- Advanced tagging with hierarchies
- Team collaboration features