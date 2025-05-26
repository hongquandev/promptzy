#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ASCII Art Banner
const banner = `
\x1b[35m╔═══════════════════════════════════════════════════════════════╗\x1b[0m
\x1b[35m║\x1b[0m \x1b[36m🚀 AI Prompt Dashboard\x1b[0m                                    \x1b[35m║\x1b[0m
\x1b[35m║\x1b[0m \x1b[32mManage and organize your AI prompts with style!\x1b[0m             \x1b[35m║\x1b[0m
\x1b[35m║\x1b[0m                                                             \x1b[35m║\x1b[0m
\x1b[35m║\x1b[0m \x1b[33mMade with ❤️  by Pink Pixel\x1b[0m                              \x1b[35m║\x1b[0m
\x1b[35m╚═══════════════════════════════════════════════════════════════╝\x1b[0m
`;

console.log(banner);

// Find the package root directory
const packageRoot = join(__dirname, '..');

// Check if we're in development or installed globally
const distPath = join(packageRoot, 'dist');
const isBuilt = existsSync(distPath);

if (!isBuilt) {
  console.log('\x1b[31m❌ Error: Built files not found!\x1b[0m');
  console.log('\x1b[33m💡 This package needs to be built before running.\x1b[0m');
  console.log('\x1b[36mℹ️  If you\'re developing locally, run: npm run build\x1b[0m');
  process.exit(1);
}

console.log('\x1b[32m🎯 Starting AI Prompt Dashboard...\x1b[0m');
console.log('\x1b[36m📂 Serving from:\x1b[0m', distPath);

// Start the preview server
const vitePreview = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', '4173'], {
  cwd: packageRoot,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\x1b[33m🛑 Shutting down AI Prompt Dashboard...\x1b[0m');
  vitePreview.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\x1b[33m🛑 Shutting down AI Prompt Dashboard...\x1b[0m');
  vitePreview.kill('SIGTERM');
  process.exit(0);
});

vitePreview.on('error', (error) => {
  console.error('\x1b[31m❌ Error starting server:\x1b[0m', error.message);
  process.exit(1);
});

vitePreview.on('close', (code) => {
  if (code !== 0) {
    console.log(`\x1b[31m❌ Server exited with code ${code}\x1b[0m`);
  } else {
    console.log('\x1b[32m✅ AI Prompt Dashboard stopped successfully\x1b[0m');
  }
  process.exit(code);
});

// Show startup info
setTimeout(() => {
  console.log('\n\x1b[32m🎉 AI Prompt Dashboard is running!\x1b[0m');
  console.log('\x1b[36m🌐 Open your browser to:\x1b[0m \x1b[4mhttp://localhost:4173\x1b[0m');
  console.log('\x1b[33m⚡ Press Ctrl+C to stop the server\x1b[0m\n');
}, 2000);
