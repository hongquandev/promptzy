# 🚀 Prompt Dashboard

A modern web application for managing and organizing your AI prompts, with tagging, search, and cloud synchronization.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)

## ✨ Features

- **Organize AI Prompts**: Store, edit, and categorize prompts for various AI models
- **Custom Tagging**: Organize prompts with custom tags for easy retrieval
- **Powerful Search**: Find the perfect prompt with full-text search and tag filtering
- **Dual Storage**: 
  - Store prompts locally in your browser
  - Cloud sync with Supabase for cross-device access
  - Optional hybrid mode to sync between both
- **AI Assistant**: Generate new prompt ideas with AI help
- **Modern UI**: Clean, responsive interface built with Shadcn/UI and Tailwind

## 🖥️ Screenshots

*Coming soon*

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-dashboard.git

# Navigate to the project directory
cd prompt-dashboard

# Install dependencies (choose one)
npm install
# or
bun install
# or
yarn install

# Start the development server
npm run dev
# or 
bun run dev
# or
yarn dev
```

## 🔧 Configuration

### Local Storage
By default, the application uses browser localStorage - no configuration needed!

### Supabase Configuration
To use cloud storage features:

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Configure your database with the following schema:
   ```sql
   -- Prompts table
   create table public.prompts (
     id text primary key,
     text text not null,
     tags jsonb,
     type text,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Set up row-level security
   alter table public.prompts enable row level security;

   create policy "Users can view own prompts" on public.prompts
     for select using (auth.uid() = user_id);

   create policy "Users can insert own prompts" on public.prompts
     for insert with check (auth.uid() = user_id);

   create policy "Users can update own prompts" on public.prompts
     for update using (auth.uid() = user_id);

   create policy "Users can delete own prompts" on public.prompts
     for delete using (auth.uid() = user_id);
   ```

3. Add your Supabase URL and anon key to the application:
   - Update `/src/integrations/supabase/client.ts` with your project URL and anon key

## 📖 Usage

1. Launch the application
2. Choose your storage preference (local, Supabase, or both)
3. Add prompts with the "+" button
4. Assign tags to organize your prompts
5. Use the search box and tag filters to find prompts
6. Select a prompt to copy it or edit its details

## 🧩 Tech Stack

- React 18.3 with TypeScript
- Vite for fast builds
- Tailwind CSS
- Shadcn/UI components
- TanStack Query
- React Hook Form with Zod
- Supabase for auth and storage

## 📋 Roadmap

- [ ] Prompt version history
- [ ] AI prompt templates
- [ ] Shared prompt libraries
- [ ] Additional storage backends
- [ ] Advanced tagging with hierarchies

## 🤝 Contributing

Contributions are welcome! See the [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) for authentication and cloud storage

---

Made with ❤️ by [Pink Pixel](https://pinkpixel.dev) 