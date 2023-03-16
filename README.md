# [Replicate SupportGPT](https://replicate-support-gpt.vercel.app/)

Make ChatGPT answer questions based on **your** documentation.

## How it works

The goal is to make ChatGPT answer questions within a limited context, where the context is a relevant secition of a larger documentation. To do this we use [embeddings](https://platform.openai.com/docs/guides/embeddings). In short, embeddings are tokens converted to vectors that can be used to calculate how closely related two strings are to each other. If we split the documentation into chunks and encode them as embeddings in a vector database, we can query relevant documentation chunks later if we use the same encoding on questions. The relevant documentation chunks will then be used as context for a ChatGPT session.

This app is powered by:

⚡️ [Supabase](https://supabase.com/), for vector based database.

▲ [Vercel](https://vercel.com/), a platform for running web apps.

⚡️ Nuxt.js [server-side API handlers](server/api), for talking to the Supabase database.

📦 [Vuetify](https://vuetifyjs.com/en/), a Vue.js component framework for the browser UI.

## Setup Supabase

Supabase supports vectors in their SQL database. Create an account and execute the following queries:

Enable the vector extension:

```sql
create extension vector;
```

Create a table for the documentation chunks:

```sql
create table documents (
  id bigserial primary key,
  content text,
  url text,
  embedding vector (1536)
);
```

Create a PostgreSQL function uses the `<==>` cosine distance operator to get similar documentation chunks.

```sql
create or replace function match_documents (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.url,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > similarity_threshold
  order by similarity desc
  limit match_count;
end;
$$;
```

## Run it locally

You need a [OpenAI API key](https://platform.openai.com/account/api-keys) and a Supabase URL and Supabase API key (you can find these in the Supabase web portal under Project → API). Copy the contents of [.example.env](.example.env) into a new file in the root of your directory called `.env` and insert the API key(s) there, like this:

```bash
NUXT_OPENAI_API_KEY=<your OpenAI API key here>
NUXT_SUPABASE_URL=<your Supabase URL here>
NUXT_SUPABASE_KEY=<your Supabase API key here>
```

Then, install the dependencies and run the local development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your web browser. Done!

## Populate vector database with embeddings

Modify the [scripts/create-embeddings.js](./scripts/create-embeddings.js) script to include URLs of the documentation to create embeddings of:

```js
// Add documentation URLs to be fetched here
const urls = [
  'https://replicate.com/home',
  'https://replicate.com/docs',
  'https://replicate.com/docs/get-started/python'
  // ...
]
```

And run it:

```bash
node scripts/create-embeddings.js
```

## One-click deploy

Deploy this project using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=replicate-support-gpt):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pwntus/replicate-support-gpt&env=NUXT_OPENAI_API_KEY&env=NUXT_SUPABASE_URL&env=NUXT_SUPABASE_KEY&project-name=replicate-support-gpt&repo-name=replicate-support-gpt)
