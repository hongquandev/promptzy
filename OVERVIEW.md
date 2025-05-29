# ✨ Promptzy 🎯

**Last Updated:** 2025-05-29T03:05:39.954Z

## Project Overview

**Promptzy** is a modern Vite-based React application for managing, organizing, and utilizing AI prompts. It serves as a centralized repository where users can create, edit, categorize, and quickly access their collection of prompts across devices. The application supports global npm installation with CLI commands for easy deployment and usage.

## ✨ Key Features

- **Prompt Management:** Create, edit, view, and delete AI prompts with UUID support
- **Prompt Types:** Support for system, task, image, and video prompts with type-specific badges
- **Tagging System:** Organize prompts with customizable tags and visual tag chips
- **Search & Filter:** Full-text search and tag-based filtering with responsive masonry layout
- **Manual Refresh:** Dedicated refresh button in header for syncing prompts after configuration changes
- **AI Assistant:** Generate new prompt ideas using Pollinations.ai API with streaming responses and collapsible interface
- **Cloud Storage:**
  - Supabase-only storage for reliable cloud persistence
  - UUID validation and user management
  - Eliminated localStorage and sync functionality to prevent issues
  - Row Level Security (RLS) policies for data protection
- **Advanced UI/UX:**
  - Responsive masonry layout (1-3 columns based on screen size)
  - Expandable prompt cards with copy functionality
  - Delete confirmation dialogs with "don't show again" option
  - Empty state handling for filtered and unfiltered views
  - Mobile-optimized responsive design with proper touch targets
- **Progressive Web App (PWA):**
  - Installable as mobile app directly from browser
  - Service worker for offline functionality and caching
  - Native app experience with no browser UI
  - Auto-updates and home screen installation
  - Manual refresh button for mobile PWA sync after Supabase setup
- **Settings & Configuration:** Comprehensive settings dialog with Supabase connection testing and system prompt management
- **Theming & Responsive Design:** Custom purple theme with dark/light mode support and smooth animations
- **Global Installation:** npm global installation support with CLI commands (`promptzy`, `prompt-dashboard`, `ai-prompt-dashboard`)
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
  - Cloud-only storage for reliable data persistence
  - UUID validation and proper error handling
- **AI Integration:** Pollinations.ai API with streaming responses
- **PWA Features:** Vite PWA plugin with Workbox for service worker and caching
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
promptzy/
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
│   │   ├── Header.tsx           # App header with refresh, settings, and add buttons
│   │   ├── SettingsDialog.tsx   # Comprehensive settings modal
│   │   └── ui/                  # Shadcn UI & Radix primitives (40+ components)
│   ├── hooks/              # Custom React hooks (use-toast, use-mobile)
│   ├── integrations/       # Third-party SDKs
│   │   └── supabase/       # Supabase client with custom configuration
│   ├── lib/                # Business logic & data stores
│   │   ├── supabasePromptStore.ts # Supabase cloud storage with UUID validation
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

### Global Installation (Recommended)
```bash
# Install globally from npm
npm install -g @pinkpixel/promptzy

# Run Promptzy
promptzy
# or (legacy commands)
prompt-dashboard
ai-prompt-dashboard
```

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install | yarn install | bun install
   ```
3. Start development server:
   ```bash
   npm run dev | yarn dev | bun run dev
   ```
4. Open the app at http://localhost:5173

## 🌐 Deployment

The project is configured for deployment to Cloudflare Pages using Wrangler. The key configuration files are:

- **wrangler.toml**: Defines the project name, build output directory, and environment variables
- **_routes.json**: Handles SPA routing by serving index.html for all non-asset routes

For detailed deployment instructions, see the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

## ⚠️ Recent Changes & User Preferences

- **✅ Storage Simplified:** Removed localStorage and sync functionality - now uses Supabase-only storage for reliability
- **✅ Sync Issues Resolved:** Eliminated prompt duplication and cross-browser sync problems by removing hybrid storage
- **✅ Manual Refresh Button:** Added refresh button in header to solve mobile PWA sync issues after Supabase configuration
- **✅ Global CLI Support:** Added npm global installation with `promptzy`, `prompt-dashboard` and `ai-prompt-dashboard` commands
- **✅ Progressive Web App:** Added PWA functionality for mobile app installation directly from browser
- **✅ Mobile Responsive:** Fixed mobile layout issues with header, buttons, and AI assistant panel
- **✅ Clean Settings:** Removed default Supabase credentials - settings form now starts blank
- **Authentication:** User prefers login-based authentication system with multiple options (Google, GitHub, email/password) over anonymous user IDs
- **✅ Cloud Operations:** All CRUD operations now properly update Supabase database with proper error handling
- **✅ Rebranded to Promptzy:** Updated from "AI Prompt Dashboard" to "Promptzy" with cute new branding and logo
- **✅ Version Updated:** Current version 1.3.0+ with PWA functionality, mobile optimization, and refresh functionality

## 🔮 Future Enhancements

- **Authentication System:** Implement proper login-based authentication with multiple providers
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