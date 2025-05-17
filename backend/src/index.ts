import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import walletRoutes from './routes/wallet';
import { hasRequiredAccess } from './nanocontracts/accessRules';
import { getUserByTelegramId, saveUser } from './utils/userStore';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const WALLET_API = process.env.WALLET_API || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

// Mount wallet routes
app.use('/api', walletRoutes);

// ✅ POST /api/createWallet
app.post('/api/createWallet', async (req, res) => {
  try {
    const { telegramId, seed } = req.body;
    if (!telegramId) {
      return res.status(400).json({ success: false, message: 'Missing Telegram ID' });
    }

    const existing = getUserByTelegramId(telegramId);
    if (existing) {
      // Try to get wallet address too
      try {
        const addressResponse = await axios.get(`${WALLET_API}/wallet/address`, {
          headers: { 'X-Wallet-Id': existing.walletId }
        });
        return res.json({
          success: true,
          walletId: existing.walletId,
          address: addressResponse.data.address
        });
      } catch (err) {
        return res.json({ success: true, walletId: existing.walletId, address: null });
      }
    }

    const walletId = uuidv4();
    const walletSeed = seed || "default";

    const startResponse = await axios.post(`${WALLET_API}/start`, {
      "wallet-id": walletId,
      seed: walletSeed,
      passphrase: ""
    });

    if (startResponse.data.success) {
      saveUser({ telegramId, walletId, seed: walletSeed });

      // Wait a little or try fetching the address
      const addressResponse = await axios.get(`${WALLET_API}/wallet/address`, {
        headers: { 'X-Wallet-Id': walletId }
      });

      return res.json({
        walletId,
        success: true,
        address: addressResponse.data.address
      });
    } else {
      return res.status(400).json({ success: false, message: startResponse.data.message });
    }
  } catch (err: any) {
    console.error('❌ Error in /createWallet:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ POST /api/wallet
app.post('/api/wallet', (req, res) => {
  const { telegramId } = req.body;
  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing Telegram ID' });
  }

  const existing = getUserByTelegramId(telegramId);
  if (existing) {
    return res.json({ success: true, wallet: existing.wallet });
  }

  const wallet = {
    address: `wallet-${telegramId}`,
    publicKey: `pub-${telegramId}`,
    encryptedPrivateKey: `encrypted-${telegramId}`
  };

  saveUser({ telegramId, wallet });
  console.log(`📥 Wallet created for ${telegramId}:`, wallet);

  return res.json({ success: true, wallet });
});

// ✅ GET /api/balance/:telegramId
app.get('/api/balance/:telegramId', async (req, res) => {
  const { telegramId } = req.params;
  const user = getUserByTelegramId(telegramId);

  if (!user || !user.walletId) {
    return res.status(404).json({ success: false, message: 'User not found or wallet not created' });
  }

  try {
    // First try to get wallet status
    try {
      const statusResponse = await axios.get(`${WALLET_API}/wallet/status`, {
        headers: { 'x-wallet-id': user.walletId }
      });
      
      // If wallet is not ready, start it
      if (statusResponse.data.statusCode !== 3) { // 3 means Ready
        await axios.post(`${WALLET_API}/start`, {
          "wallet-id": user.walletId,
          seed: user.seed || "default",
          passphrase: ""
        });
      }
    } catch (err) {
      // If status check fails, try to start the wallet
      await axios.post(`${WALLET_API}/start`, {
        "wallet-id": user.walletId,
        seed: user.seed || "default",
        passphrase: ""
      });
    }

    // Get HTR balance
    const htrResponse = await axios.get(`${WALLET_API}/wallet/balance`, {
      headers: {
        'x-wallet-id': user.walletId
      }
    });

    const balances: { [key: string]: { available: number, locked: number, total: number } } = {};

    // Add HTR balance - converting from atomic units to HTR (divide by 100)
    if (htrResponse.data && typeof htrResponse.data.available !== 'undefined') {
      const available = htrResponse.data.available / 100;
      const locked = htrResponse.data.locked / 100;
      balances['HTR'] = {
        available,
        locked,
        total: available + locked
      };
    }

    return res.json({ success: true, balances });
  } catch (err: any) {
    console.error('❌ Error fetching wallet balance:', err.message);
    return res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.response?.data || 'Failed to fetch wallet balance'
    });
  }
});

// ✅ GET /api/status
app.get('/api/status/:telegramId', async (req, res) => {
  const { telegramId } = req.params;
  const user = getUserByTelegramId(telegramId);

  if (!user || !user.walletId) {
    return res.status(404).json({ success: false, message: 'User not found or wallet not created' });
  }

  try {
    const statusResponse = await axios.get(`${WALLET_API}/wallet/status`, {
      headers: { 'x-wallet-id': user.walletId }
    });
    
    
    return res.json({
      success: true,
      statusMessage: statusResponse.data.statusMessage,
      network: statusResponse.data.network,
      serverUrl: statusResponse.data.serverUrl
    });
    
  } catch (err) {
    console.error('❌ Error fetching wallet status:', err instanceof Error ? err.message : 'Unknown error');
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet status',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// Helper function to get wallet addresses - simplified since we don't need it anymore
async function getWalletAddresses(walletId: string): Promise<string[]> {
  return [];
}

// Transaction endpoint - Get specific transaction details by ID
app.get('/api/transaction/:telegramId/:txId', async (req, res) => {
  try {
    const { telegramId, txId } = req.params;
    if (!telegramId || !txId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }
    
    const user = getUserByTelegramId(telegramId);
    if (!user || !user.walletId) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found or wallet not created' 
      });
    }

    // Fetch transaction from wallet API
    const response = await axios.get(`${WALLET_API}/wallet/transaction`, {
      headers: { 'X-Wallet-Id': user.walletId },
      params: { id: txId }
    });

    if (!response.data) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    return res.json({
      success: true,
      transaction: response.data
    });
  } catch (err) {
    console.error('[Backend] Error fetching transaction:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transaction details' 
    });
  }
});

// ✅ POST /api/tip
app.post('/api/tip', async (req, res) => {
  const { senderTelegramId, recipientTelegramId, amount, tokenSymbol } = req.body;

  if (!senderTelegramId || !recipientTelegramId || !amount || !tokenSymbol) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sender = getUserByTelegramId(senderTelegramId);
  const recipient = getUserByTelegramId(recipientTelegramId);

  if (!sender || !recipient) {
    return res.status(404).json({ success: false, message: 'User(s) not registered or wallet not found' });
  }

  try {
    // Get sender's wallet address
    const senderAddressResponse = await axios.get(`${WALLET_API}/wallet/address`, {
      headers: { 'x-wallet-id': sender.wallet.walletId }
    });

    // Get recipient's wallet address
    const recipientAddressResponse = await axios.get(`${WALLET_API}/wallet/address`, {
      headers: { 'x-wallet-id': recipient.wallet.walletId }
    });

    // Send transaction
    const txResponse = await axios.post(`${WALLET_API}/wallet/simple-send-tx`, {
      "wallet-id": sender.wallet.walletId,
      address: recipientAddressResponse.data.address,
      amount: amount,
      token: tokenSymbol !== 'HTR' ? tokenSymbol : undefined
    });

    console.log(`💸 Tipping ${amount} ${tokenSymbol} from ${senderAddressResponse.data.address} to ${recipientAddressResponse.data.address}`);
    return res.json({ success: true, message: 'Tip sent successfully', txId: txResponse.data.txId });
  } catch (err: any) {
    console.error('❌ Error in tip transaction:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ POST /api/send or sending HTR using the wallet address
app.post('/api/send', async (req, res) => {
  const { telegramId, amount, token, recipient } = req.body;
  if (!telegramId || !amount || !token || !recipient) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const user = getUserByTelegramId(telegramId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const response = await axios.post(`${WALLET_API}/wallet/simple-send-tx`, {
    headers: { 'X-Wallet-Id': user.walletId },
    data: { 
      to: recipient,
      amount,
      token 
    }

  });

  return res.json({ success: true, txId: response.data.txId }); 

});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('HathorChat backend is alive 🚀');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Global error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    details: err.response?.data || 'Unknown error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`🧠 Backend API running on http://localhost:${PORT}`);
  console.log(`🔗 Wallet API: ${WALLET_API}`);
});
