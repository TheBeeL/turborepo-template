import type { Options } from "tsup";
import { defineConfig } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*.tsx"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  ...options,
}));
