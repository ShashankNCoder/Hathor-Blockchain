# HathorChat Telegram Bot

## Overview

HathorChat Telegram Bot is the user interface component of the HathorChat ecosystem, providing a seamless way for Telegram users to interact with the Hathor blockchain. The bot enables users to manage wallets, send/receive tokens, view transaction history, and access token-gated content directly within Telegram.

## Tech Stack

- **Node.js**: JavaScript runtime
- **Telegraf**: Modern Telegram Bot framework
- **Axios**: HTTP client for API calls
- **Dotenv**: Environment variable management
- **Chalk**: Terminal styling for better logging

## Features

### Core Wallet Functionality
- **Wallet Creation**: Automatically create Hathor wallets for users
- **Wallet Import**: Allow users to import existing wallets
- **Balance Checking**: View HTR and custom token balances
- **Transaction History**: Review past transactions
- **Wallet Status**: Check wallet connection status

### Token Features
- **Tipping**: Send tokens to other users with `/tip @username amount token`
- **Token Transfer**: Send tokens to specific addresses
- **Custom Token Creation**: Create your own tokens on the Hathor network

### Community Features
- **Token Gating**: Access exclusive content based on token holdings
- **Badges & Rewards**: Earn NFT badges for community participation
- **Quizzes & Raffles**: Interactive ways to earn tokens

### Admin Tools
- **Dashboard Access**: Manage community settings
- **Threshold Setting**: Configure token requirements for access
- **Analytics**: View token usage statistics

## Commands

### Basic Commands
- `/start` - Initialize the bot and see welcome message
- `/help` - Display help menu with all available commands
- `/contact` - Get support contact information

### Wallet Commands
- `/wallet` - Create or view your wallet
- `/import_wallet` - Import an existing wallet
- `/balance` - Check your token balances
- `/status` - Check wallet connection status
- `/history` - View transaction history
- `/tx [txid]` - View details of a specific transaction

### Token Commands
- `/tip @username amount token` - Send tokens to another user
- `/send amount token @username` - Alternative way to send tokens
- `/create_token` - Start the token creation process

### Community Commands
- `/my_badges` - View your earned badges
- `/claim_badge` - Claim eligible badges
- `/unlock` - Access token-gated content
- `/access` - See what your tokens unlock

### Admin Commands
- `/dashboard` - Access admin dashboard
- `/set_threshold` - Configure token thresholds
- `/analytics` - View token statistics

### Fun Commands
- `/play_quiz` - Play a quiz to earn tokens
- `/raffle` - Join a token raffle

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- Telegram Bot Token (from @BotFather)
- Running instance of HathorChat Backend

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   BOT_TOKEN=your_telegram_bot_token
   API_BASE=http://localhost:5000/api
   API_URL=http://localhost:3000
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Development

- Run in development mode: `npm run dev`
- The bot uses nodemon for automatic restarting during development

## Integration with HathorChat Backend

The bot communicates with the HathorChat backend API to perform wallet operations, token transfers, and other blockchain interactions. Make sure the backend is running and accessible at the URL specified in the `.env` file.

## Security Considerations

- The bot handles sensitive information like wallet addresses and seed phrases
- Seed phrases are only displayed temporarily and with explicit user confirmation
- Messages containing sensitive information are automatically deleted after a timeout
- Users are warned about the importance of securing their seed phrases

## Mini App Integration

The bot includes integration with Telegram Mini Apps, allowing for a richer user experience with web-based interfaces for:
- Wallet management
- Token creation
- Advanced features

## License

This project is proprietary software.
