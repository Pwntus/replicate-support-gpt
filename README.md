# SupportGPT

Documentation WIP.

## Supabase

Deploy secrets:

Rename `supabase/.example.env` to `supabase/.env`.

```
supabase secrets set --env-file ./supabase/.env
```

Deploy function:

```
supabase functions deploy match_documents
```
