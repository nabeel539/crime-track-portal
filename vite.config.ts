
// This file is a bridge for TypeScript configuration
// It directly defines the same config as vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ConfigEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add build configuration to ensure compatibility
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // Properly set esbuild config with correct TypeScript types
  esbuild: {
    jsxInject: `import React from 'react'`,
    jsx: 'transform' as const,  // Use 'as const' to ensure the literal type is preserved
  },
}));
