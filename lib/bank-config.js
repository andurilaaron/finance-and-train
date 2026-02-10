/**
 * SECURITY WARNING: This file contains sensitive credentials
 * 
 * IMPORTANT:
 * 1. NEVER commit this file to git
 * 2. NEVER share this file
 * 3. Keep it on your local machine ONLY
 * 4. Add to .gitignore if not already there
 */

const BANK_CONFIG = {
    anz: {
        clientId: 'your_anz_client_id_here',
        apiKey: 'your_anz_api_key_here',
        privateKey: `-----BEGIN PRIVATE KEY-----
Your ANZ private key here
-----END PRIVATE KEY-----`,
        publicKey: `-----BEGIN PUBLIC KEY-----
Your ANZ public key here
-----END PUBLIC KEY-----`
    },

    openai: {
        apiKey: 'your_openai_api_key_here'
    }
};

// WARNING: DELETE THIS FILE BEFORE SHARING YOUR CODE!
// Add 'bank-config.js' to your .gitignore
