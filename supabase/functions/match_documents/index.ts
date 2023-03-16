import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { OpenAI } from 'https://deno.land/x/openai/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openai = new OpenAI(Deno.env.get('OPENAI_API_KEY'))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_KEY')
)

serve(async (req) => {
  const { query } = await req.json()

  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, ' ')

  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbeddings({
    model: 'text-embedding-ada-002',
    input
  })

  const [{ embedding }] = embeddingResponse.data

  const { error, data: documents } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    similarity_threshold: 0.8,
    match_count: 10
  })

  return new Response(JSON.stringify({ error: error.message, documents }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
