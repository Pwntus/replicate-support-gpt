import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || ''
  },
  supabase: {
    url: process.env.NUXT_SUPABASE_URL || '',
    key: process.env.NUXT_SUPABASE_KEY || ''
  },
  nitro: {
    preset: 'vercel-edge'
  },
  build: {
    transpile: ['vuetify']
  },
  sourcemap: {
    server: false,
    client: false
  },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  modules: ['@nuxtjs/supabase'],
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins?.push(
        vuetify({
          autoImport: true,
          styles: { configFile: './assets/style/vuetify.scss' }
        })
      )
    }
  }
})
