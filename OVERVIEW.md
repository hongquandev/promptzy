# 🚀 AI Prompt Dashboard

**Last Updated:** 2025-05-19T21:24:10Z

## Project Overview

The AI Prompt Dashboard is a modern Vite-based React application for managing, organizing, and utilizing AI prompts. It serves as a centralized repository where users can create, edit, categorize, and quickly access their collection of prompts across devices.

## ✨ Key Features

- **Prompt Management:** Create, edit, view, and delete AI prompts
- **Prompt Types:** Support for both system prompts and task prompts
- **Tagging System:** Organize prompts with customizable tags
- **Search & Filter:** Full-text search and tag-based filtering
- **Command Palette:** Quickly navigate and execute actions via keyboard (powered by cmdk)
- **Dual Storage Options:**
  - LocalStorage (offline-first)  
  - Supabase (cloud persistence)  
  - Hybrid mode with automatic sync and fallback
- **AI Assistant:** Generate new prompt ideas using the Pollinations.ai API with streaming responses
- **User Authentication & Sync:** Supabase-powered login with local fallback
- **Theming & Responsive Design:** Dark/light mode toggles (Next-Themes) and mobile-friendly UI

## 🛠️ Technical Stack

- **Framework:** React 18.3 (TypeScript)
- **Bundler & Dev Server:** Vite 5.4
- **Styling:** Tailwind CSS + Radix UI primitives (via Shadcn UI)
- **Component Library:** Shadcn UI & Radix primitives
- **State Management:** React Hooks + TanStack Query
- **Routing:** React Router v6
- **Forms & Validation:** React Hook Form & Zod
- **Data Storage:** Supabase JS SDK + localStorage sync stores
- **Notifications:** Sonner + custom toast hook
- **Theming:** Next-Themes for dark/light mode
- **Carousel:** Embla Carousel React
- **Icons:** Lucide React
- **Command Palette:** cmdk
- **Date Handling:** date-fns

## ⚙️ Configuration & Tooling

- **TypeScript:** v5.5
- **Linting:** ESLint
- **Styling:** PostCSS & Tailwind CSS
- **Deployment:** Cloudflare Pages (wrangler.toml)
- **CI/CD:** GitHub Actions workflows (.github/workflows)

## 📁 Project Structure

```
prompt-dashboard/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # UI components
│   │   ├── AIAssistant.tsx
│   │   ├── PromptCard.tsx
│   │   ├── PromptForm.tsx
│   │   ├── TagInput.tsx
│   │   ├── SearchInput.tsx
│   │   ├── TagFilter.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Header.tsx
│   │   ├── SettingsDialog.tsx
│   │   └── ui/             # Shadcn UI & Radix primitives
│   ├── hooks/              # Custom React hooks (use-toast, use-mobile)
│   ├── integrations/       # Third-party SDKs
│   │   └── supabase/       # Supabase client & types
│   ├── lib/                # Business logic & stores (promptStore, supabasePromptStore, systemPromptStore)
│   ├── pages/              # Route pages (Index, NotFound)
│   └── types/              # TypeScript definitions
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

## 🔮 Future Enhancements

- Prompt version history & diff tracking
- AI prompt templates and presets
- Shared prompt libraries and team collaboration
- Advanced hierarchical tagging
- Additional storage backends (e.g., NeonDB)

---
*Made with ❤️ by Pink Pixel*