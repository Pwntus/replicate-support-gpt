import { Configuration, OpenAIApi } from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: useRuntimeConfig().openaiApiKey
  })
)

const supabase = createClient(
  useRuntimeConfig().supabaseUrl,
  useRuntimeConfig().supabaseKey
)

export default defineEventHandler(async (event) => {
  if (event.node.req.url !== '/api/chat') return

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
    similarity_threshold: 0.8,
    match_count: 10
  })

  if (error) return { error: error.message }

  event.context.documents = documents
})
