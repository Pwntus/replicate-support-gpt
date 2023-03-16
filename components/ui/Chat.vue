<template lang="pug">
main
  v-container
    v-text-field(
      @keydown.enter="onChat"
      @click:appendInner="onChat"
      v-model="query"
      variant="outlined"
      density="comfortable"
      append-inner-icon="mdi-send"
      placeholder="What is your question?"
      autofocus
    )
    .answers
      .answer(
        v-for="[key, value] of Object.entries(answers).reverse()"
        v-html="formatAnswer(value)"
      )
</template>

<script setup lang="ts">
// @ts-ignore
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

// State
const query = ref<string | null>(null)
const answers = ref<any>({})
let answers_n = 0

const formatAnswer = (text: string) => md.render(text)

// Methods
const onChat = async () => {
  const q = query.value

  query.value = ''

  try {
    const key = answers_n
    answers_n += 1
    answers.value[key] = 'Loading...'

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

    answers.value[key] = ''

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
      answers.value[key] += text
    }
  } catch (e) {
    console.log(e)
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

      :deep(ul), :deep(ol)
        padding 16px 0 0 32px

      :deep(pre)
        white-space pre-wrap
        word-wrap break-word
</style>
