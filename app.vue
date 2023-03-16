<template lang="pug">
v-app
  v-main
    v-container
      ui-header
      ui-hero
      ui-chat
</template>

<script setup lang="ts">
const title = 'Replicate SupportGPT'
const description = 'Get support, in seconds.'
const image = 'https://replicate-support-gpt.vercel.app/cover.jpg'

useServerSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
  ogSiteName: title,
  ogImage: image,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
  twitterCreator: 'pontusaurdal'
})
</script>

<style lang="stylus" scoped>
.v-application
  background radial-gradient(80% 130% at 50% -30%, rgba(250, 213, 0, .15) 0, rgba(0, 0, 0, 0) 100%)

  .v-container
    max-width 1000px
</style>
