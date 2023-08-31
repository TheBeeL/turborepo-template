import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  content: ["./**/*.{ts,tsx}", "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
