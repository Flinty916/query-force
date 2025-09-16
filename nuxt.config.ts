// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  devServer: {
    host: "0",
  },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    clearScreen: false,
    envPrefix: ["VITE_", "TAURI_"],
    server: {
      strictPort: true,
    },
  },

  modules: [
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classPrefix: "",
    classSuffix: "",
  },
});