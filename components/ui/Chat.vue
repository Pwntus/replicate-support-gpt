<template lang="pug">
main
  v-container
    v-text-field(
      @keydown.enter="onChat"
      @click:appendInner="onChat"
      v-model="query"
      :loading="loading"
      variant="outlined"
      density="comfortable"
      append-inner-icon="mdi-send"
      placeholder="What is your question?"
      ref="input"
      autofocus
    )
    .answers
      .answer(
        v-for="(item, index) in answers.reverse()"
        v-html="formatAnswer(item)"
      )
</template>

<script setup lang="ts">
// @ts-ignore
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

// State
const loading = ref(false)
const input = ref<null | HTMLInputElement>(null)
const query = ref<string | null>(null)
const answers = ref<string[]>([])

const formatAnswer = (text: string) => md.render(text)

// Methods
const onChat = async () => {
  loading.value = true
  const q = query.value

  query.value = ''
  input.value?.blur()

  try {
    const response = await fetch('/api/chat', {
      method: 'post',
      body: JSON.stringify({
        query: q
      })
    })
    if (!response.ok) throw new Error(response.statusText)

    const data = response.body
    if (!data) return

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    const len = answers.value.push('')

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      let text = ''
      try {
        const items = chunkValue.match(/{.*?}/g) || []
        for (const item of items) {
          const json = JSON.parse(item)
          text += json?.content || ''
        }
      } catch (e) {
        console.log(e)
      }
      answers.value[len - 1] += text
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
    input.value?.focus()
  }
}
</script>

<style lang="stylus" scoped>
main
  .answers
    .answer
      margin-top 32px
      padding 16px
      background #fff
      border-radius 16px
      box-shadow 0 10px 35px -5px rgba(0, 0, 0, 16%) !important

      :deep(ul)
        padding 16px 0 0 32px
</style>
