# HathorChat

**Tokenized Communities in Telegram**

</div>

## Overview

HathorChat is a comprehensive platform that integrates Telegram communities with the Hathor blockchain, enabling tokenized interactions, rewards, and content access. The platform consists of three main components:

1. **Frontend**: A React-based web application for wallet management and token interactions
2. **Backend**: A Node.js/Express server that interfaces with the Hathor blockchain
3. **Bot**: A Telegram bot that provides the user interface within Telegram

## Features

### Core Features
- **Wallet Management**: Create, import, and manage Hathor wallets
- **Token Transfers**: Send and receive HTR and custom tokens
- **Custom Token Creation**: Create your own tokens on the Hathor network
- **Transaction History**: View past transactions and balances

### Community Features
- **Token Gating**: Access exclusive content based on token holdings
- **Tipping**: Send tokens to other users with simple commands
- **Badges & Rewards**: Earn NFT badges for community participation
- **Quizzes & Raffles**: Interactive ways to earn tokens

### Admin Tools
- **Dashboard**: Manage community settings and token thresholds
- **Analytics**: View token usage statistics
- **Content Management**: Configure token-gated content

## Architecture

```
HathorChat/
├── frontend/           # React web application
├── backend/            # Express API server
├── bot/                # Telegram bot
└── docker-compose.yml  # Docker configuration
```

### Component Interaction

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Telegram  │      │  HathorChat │      │   Hathor    │
│     User    │<─────│     Bot     │<─────│   Backend   │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                 │
                                          ┌──────┴──────┐
                                          │   Wallet    │
                                          │  Headless   │
                                          └─────────────┘
```

## Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- Telegram Bot Token (from @BotFather)
- Hathor Wallet Headless

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/HathorChat.git
cd HathorChat
```

### Environment Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Bot Setup**
   ```bash
   cd ../bot
   npm install
   cp .env.example .env
   # Add your Telegram Bot Token to .env
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Configure frontend environment variables
   ```

### Running with Docker

The easiest way to run the entire stack is using Docker Compose:

```bash
docker-compose up -d
```

This will start the following services:
- Backend API on port 5000
- Hathor Wallet Headless on port 8000
- Telegram Bot connected to the backend

### Running Locally (Development)

1. **Start Hathor Wallet Headless**
   ```bash
   docker run -d --name hathor-wallet-headless -p 8000:8000 \
     -e HEADLESS_NETWORK=testnet \
     -e HEADLESS_SERVER=https://node1.nano-testnet.hathor.network/v1a/ \
     -e HEADLESS_TX_MINING_URL=https://txmining.testnet.hathor.network/ \
     hathornetwork/hathor-wallet-headless
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Bot**
   ```bash
   cd bot
   npm run dev
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## Component Documentation

For detailed documentation on each component, please refer to their respective README files:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Bot Documentation](./bot/README.md)

## Security Considerations

- **Wallet Security**: Seed phrases should be encrypted or stored securely
- **API Authentication**: Implement proper authentication for production use
- **Environment Variables**: Keep sensitive information in environment variables
- **HTTPS**: Use HTTPS for all API communications in production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software.

## Acknowledgements

- [Hathor Network](https://hathor.network/) - The blockchain platform powering HathorChat
- [Telegraf](https://telegraf.js.org/) - Framework for Telegram bot development
- [React](https://reactjs.org/) - UI library for the frontend
- [Express](https://expressjs.com/) - Web framework for the backend API

# Drive Link

```
https://drive.google.com/drive/folders/19SHzhH-PvPX_64dAotD4yLapQWMHXGBz?usp=sharing
```
