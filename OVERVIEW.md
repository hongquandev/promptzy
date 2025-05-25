# 🚀 AI Prompt Dashboard

**Last Updated:** 2025-05-25T21:27:38.379Z

## Project Overview

The AI Prompt Dashboard is a modern Vite-based React application for managing, organizing, and utilizing AI prompts. It serves as a centralized repository where users can create, edit, categorize, and quickly access their collection of prompts across devices.

## ✨ Key Features

- **Prompt Management:** Create, edit, view, and delete AI prompts with UUID support
- **Prompt Types:** Support for system, task, image, and video prompts with type-specific badges
- **Tagging System:** Organize prompts with customizable tags and visual tag chips
- **Search & Filter:** Full-text search and tag-based filtering with responsive masonry layout
- **AI Assistant:** Generate new prompt ideas using Pollinations.ai API with streaming responses and collapsible interface
- **Dual Storage Options:**
  - LocalStorage (offline-first with automatic tag management)
  - Supabase (cloud persistence with UUID validation and user management)
  - Hybrid mode with intelligent bidirectional sync and conflict resolution
- **Advanced UI/UX:**
  - Responsive masonry layout (1-3 columns based on screen size)
  - Expandable prompt cards with copy functionality
  - Delete confirmation dialogs with "don't show again" option
  - Empty state handling for filtered and unfiltered views
- **Settings & Configuration:** Comprehensive settings dialog with Supabase connection testing and system prompt management
- **Theming & Responsive Design:** Custom purple theme with dark/light mode support and smooth animations
- **Production Ready:** Cloudflare Pages deployment with automated CI/CD and proper SPA routing

## 🛠️ Technical Stack

- **Framework:** React 19.1 (TypeScript)
- **Bundler & Dev Server:** Vite 5.4 with React SWC plugin
- **Styling:** Tailwind CSS with custom purple theme + Radix UI primitives (via Shadcn UI)
- **Component Library:** Shadcn UI & Radix primitives (40+ components)
- **State Management:** React Hooks with sophisticated local state management
- **Routing:** React Router v7 with SPA routing configuration
- **Forms & Validation:** React Hook Form & Zod for type-safe form handling
- **Data Storage:**
  - Supabase JS SDK with custom client configuration
  - localStorage with automatic tag management
  - Intelligent sync layer with conflict resolution
- **AI Integration:** Pollinations.ai API with streaming responses
- **Notifications:** Sonner + custom toast hook for user feedback
- **Theming:** Next-Themes for dark/light mode with custom animations
- **Icons:** Lucide React (consistent icon system)
- **Date Handling:** date-fns for relative timestamps
- **Development Tools:** Lovable-tagger for component development

## ⚙️ Configuration & Tooling

- **TypeScript:** v5.8 with relaxed strictness for rapid development
- **Linting:** ESLint v9 flat config with React hooks and TypeScript support
- **Styling:** PostCSS & Tailwind CSS with custom animations and purple theme
- **Deployment:** Cloudflare Pages with wrangler.toml configuration
- **SPA Routing:** _routes.json for proper client-side routing on Cloudflare Pages
- **CI/CD:** GitHub Actions workflow for automated deployment on main branch pushes
- **Package Management:** npm with lockfile for consistent dependencies

## 📁 Project Structure

```
prompt-dashboard/
├── public/                 # Static assets
│   └── _routes.json        # SPA routing configuration for Cloudflare Pages
├── src/                    # Source code
│   ├── components/         # UI components
│   │   ├── AIAssistant.tsx      # Collapsible AI prompt generator with streaming
│   │   ├── PromptCard.tsx       # Expandable prompt cards with type badges
│   │   ├── PromptForm.tsx       # Modal form for creating/editing prompts
│   │   ├── TagInput.tsx         # Tag management with keyboard support
│   │   ├── SearchInput.tsx      # Search input with icon
│   │   ├── TagFilter.tsx        # Tag filtering buttons
│   │   ├── EmptyState.tsx       # Contextual empty states
│   │   ├── Header.tsx           # App header with settings and sync
│   │   ├── SettingsDialog.tsx   # Comprehensive settings modal
│   │   └── ui/                  # Shadcn UI & Radix primitives (40+ components)
│   ├── hooks/              # Custom React hooks (use-toast, use-mobile)
│   ├── integrations/       # Third-party SDKs
│   │   └── supabase/       # Supabase client with custom configuration
│   ├── lib/                # Business logic & data stores
│   │   ├── promptStore.ts       # localStorage operations with tag management
│   │   ├── supabasePromptStore.ts # Supabase integration with UUID validation
│   │   ├── systemPromptStore.ts # AI assistant system prompt management
│   │   └── utils.ts             # Utility functions
│   ├── pages/              # Route pages (Index, NotFound)
│   └── types/              # TypeScript definitions
├── dist/                   # Build output directory
│   └── _routes.json        # Generated SPA routing configuration
├── .github/                # CI/CD workflows
├── wrangler.toml           # Cloudflare Pages config
├── tailwind.config.ts      # Tailwind config
├── vite.config.ts          # Vite config
└── tsconfig.json           # TypeScript config
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install | yarn install | bun install
   ```
3. Start development server:
   ```bash
   npm run dev | yarn dev | bun run dev
   ```
4. Open the app at http://localhost:8080

## 🌐 Deployment

The project is configured for deployment to Cloudflare Pages using Wrangler. The key configuration files are:

- **wrangler.toml**: Defines the project name, build output directory, and environment variables
- **_routes.json**: Handles SPA routing by serving index.html for all non-asset routes

For detailed deployment instructions, see the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

## 🔮 Future Enhancements

- **Version Control:** Prompt version history & diff tracking
- **Templates:** AI prompt templates and presets for common use cases
- **Collaboration:** Shared prompt libraries and team collaboration features
- **Advanced Tagging:** Hierarchical tagging system with categories
- **Storage Backends:** Additional storage options (NeonDB, Firebase, etc.)
- **Analytics:** Usage analytics and prompt performance tracking
- **Import/Export:** Bulk import/export functionality for prompt collections
- **Search Enhancement:** Semantic search with embedding-based similarity

---
*Made with ❤️ by Pink Pixel*