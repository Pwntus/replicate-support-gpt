import { Configuration, OpenAIApi } from 'openai'
import { createClient } from '@supabase/supabase-js'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { OpenAI } from 'openai-streams/node'
import { sendStream } from 'h3'

export default defineEventHandler(async (event) => {
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
  try {
    const { query } = await readBody(event)

    // OpenAI recommends replacing newlines with spaces for best results
    const input = query.replace(/\n/g, ' ')

    // Generate a one-time embedding for the query itself
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input
    })

    const [{ embedding }] = embeddingResponse.data.data

    const { error, data: documents } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      similarity_threshold: 0.5,
      match_count: 10
    })

    if (error) return { error: error.message }

    // Create context
    let tokenCount = 0
    let contextText = ''

    // Concat matched documents
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i]
      const content = document.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      // Limit context to max 1500 tokens (configurable)
      if (tokenCount > 8192) {
        break
      }

      contextText += `${content.trim()}\n---\n`
    }

    const systemContent = `You are a very enthusiastic Replicate representative who loves to help people! Given the following sections from the Replicate documentation, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that.".

Context sections:
${contextText}`

    const userMessage = `Question:
${query}`

    const messages: any[] = [
      {
        role: 'system',
        content: systemContent
      },
      {
        role: 'user',
        content: userMessage
      }
    ]

    const stream = await OpenAI(
      'chat',
      {
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1
      },
      { apiKey: useRuntimeConfig().openaiApiKey }
    )

    return sendStream(event, stream)
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
