import { createVuetify, ThemeDefinition } from 'vuetify'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#f6f6f6',
    surface: '#FFFFFF',
    primary: '#1d1d1f',
    secondary: '#e39200',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'lightTheme',
      themes: {
        lightTheme
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
