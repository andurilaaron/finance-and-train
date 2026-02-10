# Environment Variables Setup

Copy this file to `.env.local` and fill in your credentials:

```bash
# Gmail OAuth (Create in Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# TfNSW Transport API
TFNSW_API_TOKEN=your_tfnsw_api_token_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
```

## ANZ Bank API
Credentials are stored in `lib/bank-config.js`
