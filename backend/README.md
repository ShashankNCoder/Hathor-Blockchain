# HathorChat Backend

## Overview

HathorChat Backend is a Node.js/Express server that powers the HathorChat application, a tokenized community platform for Telegram. This backend provides wallet management, transaction handling, and other essential services for the HathorChat ecosystem.

## Tech Stack

- **Node.js & Express**: Server framework
- **TypeScript**: Programming language
- **Hathor Wallet Headless**: For wallet operations
- **Axios**: HTTP client for API calls
- **UUID**: For generating unique identifiers
- **Dotenv**: Environment variable management

## Project Structure

```
backend/
├── data/               # Data storage (users.json)
├── src/                # Source code
│   ├── nanocontracts/  # Smart contract logic
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.ts        # Main application entry point
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Key Features

- **Wallet Management**: Create, access, and manage Hathor wallets
- **Transaction Handling**: Send and receive HTR and custom tokens
- **Balance Tracking**: Monitor token balances
- **Transaction History**: View past transactions
- **User Management**: Associate wallets with Telegram users

## API Endpoints

### Wallet Management

- `POST /api/createWallet`: Create a new wallet or retrieve existing one
- `GET /api/wallet`: Get wallet information by Telegram ID
- `GET /api/wallet/:walletId/address`: Get wallet address
- `GET /api/wallet/:walletId/balance`: Get wallet balance (HTR and custom tokens)
- `GET /api/wallet/:walletId/status`: Check wallet status

### Transactions

- `GET /api/tx-history/:telegramId`: Get transaction history
- `GET /api/transaction/:telegramId/:txId`: Get specific transaction details
- `POST /api/tip`: Send tokens to another user
- `POST /api/send`: Send tokens to a specific address

### System

- `GET /api/status/:telegramId`: Get wallet status information
- `GET /`: Health check endpoint

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- Docker (for Hathor Wallet Headless)

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Hathor Wallet Headless service:
   ```
   docker run -d --name hathor-wallet-headless -p 8000:8000 \
     -e HEADLESS_NETWORK=testnet \
     -e HEADLESS_SEED_DEFAULT="your-24-word-seed-phrase" \
     -e HEADLESS_SERVER=https://node1.nano-testnet.hathor.network/v1a/ \
     -e HEADLESS_TX_MINING_URL=https://txmining.testnet.hathor.network/ \
     hathornetwork/hathor-wallet-headless
   ```
4. Create a `.env` file with the following variables:
   ```
   PORT=5000
   WALLET_API=http://localhost:8000
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Development

- Build the project: `npm run build`
- Run in development mode: `npm run dev`
- Start production server: `npm start`

## Data Storage

User data is stored in a JSON file at `data/users.json`. Each user record contains:
- Telegram ID
- Wallet ID
- Seed phrase (for wallet restoration)

## Nano Contracts

The backend implements simple "nano contracts" that handle:
- Access control based on token holdings
- Badge rules for user achievements
- Leaderboard logic for community engagement

## Security Considerations

- Seed phrases are stored in the users.json file - in a production environment, these should be encrypted
- The API does not implement authentication - in production, secure endpoints with proper authentication
- For production deployment, use HTTPS and proper security headers

## Integration with Telegram Bot

This backend is designed to work with the HathorChat Telegram bot, which provides the user interface for interacting with the Hathor blockchain.

## License

This project is proprietary software.
