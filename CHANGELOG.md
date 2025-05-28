# Changelog

All notable changes to Promptzy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-05-26

### Added
- **🎯 Rebranded to Promptzy:** Complete rebrand from "AI Prompt Dashboard" to "Promptzy"
- **✨ New Cute Logo:** Added adorable mascot-style logo for better brand recognition
- **🚀 Enhanced CLI:** Primary CLI command is now `promptzy` (legacy commands still work)
- **📦 New Package Name:** Published as `@pinkpixel/promptzy` on npm

### Changed
- Updated all documentation to reflect Promptzy branding
- Enhanced package.json with new repository URLs and package name
- Improved CLI banner with Promptzy branding
- Updated README with new installation instructions

### Fixed
- All references to old package name updated
- Repository URLs updated to new GitHub location

## [1.1.0] - 2025-05-26

### Added
- System prompt configuration for the AI Assistant
- Option to use default or custom system prompt in settings
- Enhanced Supabase integration with user-configurable credentials
- Better connection testing and error handling for Supabase
- Comprehensive manual table setup guide with SQL code
- Direct link to Supabase SQL Editor based on project URL
- Step-by-step instructions for database setup
- Copy-to-clipboard functionality for SQL setup code
- Automatic synchronization when switching storage types
- Integration with vector embeddings search
- Workspace context in prompts
- Delete confirmation dialog for prompt deletions, with "Don't show this again" option
- Cloudflare Pages deployment configuration with wrangler.toml
- GitHub Actions workflow for automated deployment
- Comprehensive deployment guide (DEPLOYMENT.md)
- SPA routing configuration for Cloudflare Pages with _routes.json
- Improved bidirectional sync between local storage and Supabase
- Better logging for troubleshooting sync issues
- Detailed documentation on synchronization behavior in README
- Updated OVERVIEW.md with latest project information and deployment details
- Browser refresh notification for new Supabase connections
- Enhanced AI system prompt with detailed category-specific guidelines
- Auto-update mechanism for outdated AI system prompts in settings
- Global CLI installation support with `prompt-dashboard` and `ai-prompt-dashboard` commands
- Beautiful ASCII banner and colored output for CLI
- NPX support for running without installation

### Changed
- Improved Supabase client to dynamically use user-provided credentials
- More robust error handling for cloud storage operations
- Better fallback to local storage when cloud operations fail
- Enhanced feedback during connection testing and table setup
- Updated table creation flow to focus on manual setup via SQL Editor
- Prompt card list switched from CSS grid to responsive Masonry-style flex columns to isolate vertical expansion
- Updated _routes.json to properly handle SPA routing in Cloudflare Pages
- Enhanced storage type persistence between sessions
- Improved authentication detection for anonymous Supabase usage
- Verified Cloudflare Pages deployment configuration with proper SPA routing
- "Test Connection" button renamed to "Connect" for better UX
- AI system prompt completely rewritten for better prompt generation quality
- Removed non-functional "Create Table" button and improved manual setup flow

### Fixed
- Table access error handling for Supabase environments
- Permissions issues with automatic table creation
- `.btn-hover-effect` overlay no longer blocks pointer events on card controls
- Expand/collapse toggle now only affects individual cards, not all cards
- Cloudflare Pages SPA routing issues by adding proper "serve" configuration
- Storage preference not persisting between page reloads
- Supabase synchronization not working correctly between devices
- Fixed bugs in prompt import/export between storage types
- Improved handling of Supabase connection failures
- User-specific data filtering to prevent mixing prompts between users
- Misleading "Create Table" button that couldn't actually create tables
- Better error handling and messaging for Supabase connection failures
- Automatic update of outdated AI system prompts for existing users

## [0.1.0] - 2025-05-19

### Added
- Initial release of the Prompt Dashboard
- Create, edit, and delete AI prompts
- Organize prompts with custom tags
- Search functionality with text and tag filtering
- Dual storage options (local and Supabase)
- AI Assistant for generating prompt ideas
- User authentication with Supabase
- Responsive UI with Shadcn/UI components and Tailwind CSS

### Changed
- Enhanced UI with improved styling
- Icon-based send button
- Automatic API key configuration

### Fixed
- Storage synchronization issues
- Tag management bugs
- Form validation errors