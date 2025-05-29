# Changelog

All notable changes to Promptzy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1]

### Added
- **🔄 Refresh Prompts Button:** Added manual refresh button in header for both web and mobile PWA
- **📱 Mobile PWA Sync:** Refresh button specifically addresses mobile PWA prompt loading after Supabase configuration
- **🔄 Smart Connection Check:** Refresh function re-validates Supabase connection before loading prompts
- **✨ Loading States:** Visual feedback with spinning icon and disabled button during refresh operation
- **📢 User Feedback:** Toast notifications for refresh success, failure, and connection issues
- **🤖 Animated Robot Logo:** Added cute hover animation and robot sound effect to the Promptzy logo
- **🎵 Interactive Sound:** Robot logo plays a fun sound effect when hovered for enhanced user experience
- **✨ Bouncy Animation:** Logo bounces, rotates, and glows with purple shadow on hover

### Changed
- **🎨 Header Layout:** Refresh button positioned between logo and settings for easy access
- **📱 Responsive Design:** Refresh button adapts to mobile with proper touch targets and responsive text
- **⚡ Performance:** Extracted prompt loading logic into reusable function for better code organization

### Fixed
- **📱 Mobile PWA Issue:** Prompts now properly load after entering Supabase credentials on mobile app
- **🔄 Cross-Device Sync:** Manual refresh ensures prompts appear when switching devices or browsers
- **🔗 Connection Reliability:** Refresh validates connection before attempting to load data

## [1.3.0] - 2025-05-28

### Added
- **📱 Progressive Web App (PWA):** Complete PWA implementation with service worker and offline functionality
- **🏠 Mobile App Installation:** Users can now install Promptzy as a mobile app directly from their browser
- **📲 Native App Experience:** PWA provides native app-like experience with no browser UI when installed
- **🔄 Auto-Updates:** Service worker automatically updates the app when new versions are deployed
- **💾 Offline Functionality:** Basic app functionality works offline with intelligent caching
- **🎨 App Manifest:** Professional app manifest with proper branding and icons
- **📱 Mobile Responsive Design:** Complete mobile layout optimization for all screen sizes
- **🎯 Touch-Optimized UI:** Improved touch targets and mobile-friendly interactions

### Changed
- **📱 Header Layout:** Mobile header now stacks vertically with full-width responsive buttons
- **🤖 AI Assistant Panel:** Optimized for mobile with proper sizing and responsive content
- **🔘 Button Responsiveness:** Buttons now hide text on very small screens while keeping icons
- **📐 Custom Breakpoints:** Added `xs: 475px` Tailwind breakpoint for better mobile control
- **⚙️ Settings Form:** Removed pre-filled default Supabase credentials - now starts completely blank
- **🎨 Mobile Typography:** Responsive text sizing throughout the application

### Fixed
- **📱 Mobile Header Overlap:** Settings button no longer covers title text on mobile
- **🔘 Button Sizing:** Add Prompt button now fits properly on mobile screens
- **🤖 AI Assistant Mobile:** Panel now fits correctly on mobile devices
- **📝 Form Defaults:** Settings form no longer shows old database info by default
- **🎯 Touch Targets:** All interactive elements now have proper touch target sizes

### Technical
- **🔧 Vite PWA Plugin:** Added vite-plugin-pwa with Workbox for service worker generation
- **📦 Build Process:** Enhanced build process to generate PWA assets automatically
- **🎨 Tailwind Config:** Extended with custom breakpoints and responsive utilities
- **📱 Manifest Generation:** Automatic web app manifest generation with proper metadata

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