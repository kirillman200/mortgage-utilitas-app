import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";

export default defineConfig({
  site: "https://mortgage.utilitas.app",
  integrations: [vue()],
  output: "static",
  build: {
    format: "directory"
  },
  vite: {
    build: {
      sourcemap: false
    }
  }
});
