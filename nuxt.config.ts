// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  css: ["~/assets/css/velo.css"],
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt','@vueuse/nuxt'],
  colorMode: {
    preference : 'light'
  }
})
