import { defineConfig } from "tsup";

export default defineConfig({
  // Point to the dedicated client SDK entry point
  entry: ["src/sdk/index.ts"],
  // Build both ES Modules and CommonJS files for maximum runtime flexibility
  format: ["cjs", "esm"],
  // Automatically generate .d.ts TypeScript declarations
  dts: true,
  // Enable sourcemaps for runtime debugging
  sourcemap: true,
  // Clean the output directory before starting the build
  clean: true,
  // Minify production builds for lightning fast load times
  minify: true,
  // Target modern JS runtime capabilities
  target: "es2022",
  // Put package files in a separate directory so they don't impact the live App's dist/ static serving
  outDir: "dist-package"
});
