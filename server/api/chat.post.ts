/*
import { Configuration, OpenAIApi } from 'openai'
import { createClient } from '@supabase/supabase-js'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { OpenAI } from 'openai-streams/node'
import { sendStream } from 'h3'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: useRuntimeConfig().openaiApiKey
  })
)

const supabase = createClient(
  useRuntimeConfig().supabaseUrl,
  useRuntimeConfig().supabaseKey
)

// @ts-ignore
const tokenizer = new GPT3Tokenizer.default({ type: 'gpt3' })
*/

export default defineEventHandler(async (event) => {
  try {
    return { api: 'OK' }
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
