import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || '',
    supabaseUrl: process.env.NUXT_SUPABASE_URL || '',
    supabaseKey: process.env.NUXT_SUPABASE_KEY || ''
  },
  // Vercel edge functions are incompatible with supabase
  // nitro: { preset: 'vercel-edge' },
  build: {
    transpile: ['vuetify']
  },
  sourcemap: {
    server: false,
    client: false
  },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
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
