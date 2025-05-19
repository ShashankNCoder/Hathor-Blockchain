# HathorChat Reference Guide

## Documentation Links

### Telegram Resources
- [Full-screen Mini Apps](https://telegram.org/blog/fullscreen-miniapps-and-more#full-screen-mode)
- [Initializing Mini Apps](https://core.telegram.org/bots/webapps#initializing-mini-apps)
- [Secure Storage](https://core.telegram.org/bots/webapps#securestorage)

### Hathor Resources
- [Testnet Faucet](https://faucet.nano-testnet.hathor.network) - Claim testnet tokens
- [HathorChat GitHub](https://github.com/SomehowLiving/HathorChat) - Original project repository
- [Nano-Blueprint Tutorial](https://youtu.be/gmPQgtBxNiA?si=isimITr5IxvA7LXC) - Video guide
- [Blueprint Creator](https://blueprint-creator.hackathon.hathor.network/) - Submit nano-contract blueprints
- [Reference Nano-contracts](https://explorer.hackaton.hathor.network/blueprint/detail/000001624120d1a0271d823d8f05117f85edb24715259cad32837e34f5db7e7a) - Example implementation
- [Recorded Session](https://p7tn464j.r.ap-south-1.awstrack.me/L0/https:%2F%2Fhackerearth.zoom.us%2Fclips%2Fshare%2FfqlbSgoKR_yC7WeI1HcJsA%3Futm_source=sprint_admin%26utm_medium=sprint_email%26utm_campaign=nano-contracts-hackathon-unleashing-the-power-of-hathor-network%26utm_content=2409739/1/01090196c4882c14-4cf15b55-6c69-49a8-8399-8aab745461d2-000000/YC2Rf-JDuQ-SrICEQMVTypVxO8o=206) - Hackathon meeting recording

## Running the Application

### Start Commands
```bash
# Start Backend
cd backend
npm run dev

# Start Bot
cd bot
npm run dev

# Start Frontend
cd frontend
npm run dev
```

#Docker Running
```docker run -d --name hathor-wallet-headless -p 8000:8000 -e HEADLESS_NETWORK=testnet -e HEADLESS_SEED_DEFAULT="Enter your 24 seed phrase of hathornetwork" -e HEADLESS_SERVER=https://node1.testnet.hathor.network/v1a/ -e HEADLESS_TX_MINING_URL=https://txmining.testnet.hathor.network/ hathornetwork/hathor-wallet-headless```

### API Test Commands
```bash
# Check wallet status
curl -X GET "http://localhost:5000/api/status/5735812274"

# Get transaction history
curl -X GET "http://localhost:5000/api/tx-history/5735812274"
```

## Docker Commands
nano-testnet:
docker run -d --name hathor-wallet-headless -p 8000:8000 -e HEADLESS_NETWORK=testnet -e HEADLESS_SEED_DEFAULT="Enter your 24 seed phrase of hathornetwork" -e HEADLESS_SERVER=https://node1.nano-testnet.hathor.network/v1a/ -e HEADLESS_TX_MINING_URL=https://txmining.testnet.hathor.network/ hathornetwork/hathor-wallet-headless

image-container:
docker pull hathornetwork/hathor-wallet-headless

cmd to remove image-container:
docker rmi hathornetwork/hathor-wallet-headless

### Hathor Wallet Headless Setup

#### Recommended Format
```bash
docker run -d --name hathor-wallet-headless -p 8000:8000 \
  -e HEADLESS_NETWORK=testnet \
  -e HEADLESS_SEED_DEFAULT="YOUR_SEED_PHRASE" \
  -e HEADLESS_SERVER=https://node1.testnet.hathor.network/v1a/ \
  -e HEADLESS_TX_MINING_URL=https://txmining.testnet.hathor.network/ \
  hathornetwork/hathor-wallet-headless
```

#### Pull Docker Image
```bash
docker pull hathornetwork/hathor-wallet-headless
```

### Network Configuration Options

#### Mainnet
```bash
docker run -p 8000:8000 hathornetwork/hathor-wallet-headless \
  --api_key "MYSECRETKEY" \
  --seed_default "YOUR_SEED_PHRASE"
```

#### Testnet
```bash
docker run -p 8000:8000 hathornetwork/hathor-wallet-headless \
  --api_key "MYSECRETKEY" \
  --network "testnet" \
  --server "https://node1.testnet.hathor.network/v1a/" \
  --seed_default "YOUR_SEED_PHRASE"
```

#### Nano-Testnet
```bash
docker run -p 8000:8000 hathornetwork/hathor-wallet-headless \
  --api_key "MYSECRETKEY" \
  --network "testnet" \
  --server "https://node1.nano-testnet.hathor.network/v1a/" \
  --seed_default "YOUR_SEED_PHRASE"
```

## Wallet API Usage

### Initialize Wallet
```bash
curl -X POST http://localhost:8000/start \
  -H "X-API-KEY: MYSECRETKEY" \
  -H "Content-Type: application/json" \
  -d '{"wallet-id": "mywallet", "seedKey": "default"}'
```

### Get Wallet Address
```bash
curl -H "X-API-KEY: MYSECRETKEY" -H "X-Wallet-Id: mywallet" \
  http://localhost:8000/wallet/address
```

### Check Wallet Balance
```bash
curl -H "X-API-KEY: MYSECRETKEY" -H "X-Wallet-Id: mywallet" \
  http://localhost:8000/wallet/balance
```

### List Wallet Addresses
```bash
curl -H "X-API-KEY: MYSECRETKEY" -H "X-Wallet-Id: mywallet" \
  http://localhost:8000/wallet/addresses
```

## Security Note
**IMPORTANT**: For security reasons, do not use the seed phrases shown in this reference file. They are included only as examples.

- Example seed (DO NOT USE): "crop trumpet calm beef cloud little culture attitude stick recycle loyal pipe train steel expire shiver never crack excess prefer fossil copy warm goat"


-testnet-
docker run -p 8000:8000 hathornetwork/hathor-wallet-headless --api_key "MYSECRETKEY" --network "testnet" --server "https://node1.testnet.hathor.network/v1a/" --seed_default "crop trumpet calm beef cloud little culture attitude stick recycle loyal pipe train steel expire shiver never crack excess prefer fossil copy warm goat"

----------
-nano-testnet'
docker run -p 8000:8000 hathornetwork/hathor-wallet-headless --api_key "MYSECRETKEY" --network "testnet" --server "https://node1.nano-testnet.hathor.network/v1a/" --seed_default "crop trumpet calm beef cloud little culture attitude stick recycle loyal pipe train steel expire shiver never crack excess prefer fossil copy warm goat"

-----------------

Docker running in proper format:
docker run -d --name hathor-wallet-headless -p 8000:8000 -e HEADLESS_NETWORK=testnet -e HEADLESS_SEED_DEFAULT="crop trumpet calm beef cloud little culture attitude stick recycle loyal pipe train steel expire shiver never crack excess prefer fossil copy warm goat" -e HEADLESS_SERVER=https://node1.testnet.hathor.network/v1a/ -e HEADLESS_TX_MINING_URL=https://txmining.testnet.hathor.network/ hathornetwork/hathor-wallet-headless
