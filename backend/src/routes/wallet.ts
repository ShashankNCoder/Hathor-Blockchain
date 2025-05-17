import { Router } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { walletUtils } from '@hathor/wallet-lib';

const router = Router();
const WALLET_API = 'http://localhost:8000'; // or docker IP if needed

// ✅ Create Wallet
import { saveUser, getUserByTelegramId } from '../utils/userStore';

router.post('/createWallet', async (req, res) => {
  try {
    const { telegramId, seed } = req.body;
    if (!telegramId) {
      return res.status(400).json({ success: false, message: 'Missing Telegram ID' });
    }

    const existing = getUserByTelegramId(telegramId);
    if (existing) {
      // First ensure the wallet is started
      try {
        await axios.post(`${WALLET_API}/start`, {
          "wallet-id": existing.walletId,
          seed: existing.seed,
          passphrase: "",
          network: "testnet"
        });
        
        // Wait for wallet to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Now try to get the address
        const addressResponse = await axios.get(`${WALLET_API}/wallet/address`, {
          headers: { 'X-Wallet-Id': existing.walletId }
        });
        
        if (addressResponse.data && addressResponse.data.address) {
          
          return res.json({
            success: true,
            walletId: existing.walletId,
            address: addressResponse.data.address,
            message: 'Using your existing wallet'
          });
        }
      } catch (err: any) {
        console.error('❌ Error with existing wallet:', err.message);
        // If there's an error with the existing wallet, try to restart it
        try {
          await axios.post(`${WALLET_API}/start`, {
            "wallet-id": existing.walletId,
            seed: existing.seed,
            passphrase: "",
            network: "testnet"
          });
          
          // Wait for wallet to initialize
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const addressResponse = await axios.get(`${WALLET_API}/wallet/address`, {
            headers: { 'X-Wallet-Id': existing.walletId }
          });
          
          if (addressResponse.data && addressResponse.data.address) {
            console.log(`✅ Retrieved address after wallet restart: ${addressResponse.data.address}`);
            return res.json({
              success: true,
              walletId: existing.walletId,
              address: addressResponse.data.address,
              message: 'Restarted your existing wallet'
            });
          }
        } catch (retryErr: any) {
          console.error('❌ Failed to restart existing wallet:', retryErr.message);
          return res.status(500).json({
            success: false,
            message: 'Could not access your existing wallet. Please try again later.',
            error: retryErr.message
          });
        }
      }
    }

    // Only create new wallet if user doesn't have one
    if (!existing) {
      const walletId = uuidv4();
      const walletSeed = seed || walletUtils.generateWalletWords();
      console.log(`🔑 Creating new wallet with ID: ${walletId}`);

      // Start the wallet
      const startResponse = await axios.post(`${WALLET_API}/start`, {
        "wallet-id": walletId,
        seed: walletSeed,
        passphrase: "",
        network: "testnet"
      });

      if (!startResponse.data.success) {
        console.error('❌ Failed to start wallet:', startResponse.data.message);
        return res.status(400).json({ success: false, message: startResponse.data.message });
      }

      console.log('✅ Wallet started successfully, waiting for initialization...');
      
      // Wait for wallet to initialize
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get the address
      const addressResponse = await axios.get(`${WALLET_API}/wallet/address`, {
        headers: { 'X-Wallet-Id': walletId }
      });

      if (!addressResponse.data || !addressResponse.data.address) {
        console.error('❌ Failed to get wallet address');
        return res.status(500).json({ 
          success: false, 
          message: 'Wallet created but failed to get address',
          walletId,
          seed: walletSeed
        });
      }

      saveUser({ telegramId, walletId, seed: walletSeed });
      console.log(`📥 Wallet created and saved for ${telegramId}`);

      return res.json({
        success: true,
        walletId,
        seed: walletSeed,
        address: addressResponse.data.address,
        message: 'New wallet created successfully'
      });
    }

  } catch (err: any) {
    console.error('❌ Error in /createWallet:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.response?.data || 'Failed to create wallet'
    });
  }
});

// ✅ Get Wallet by Telegram ID
router.get('/wallet', async (req, res) => {
  try {
    const { telegramId } = req.query;

    if (!telegramId) {
      console.log('[Backend] ❌ Wallet request missing telegramId');
      return res.status(400).json({ success: false, message: 'Missing Telegram ID' });
    }

    const user = getUserByTelegramId(telegramId as string);
    
    if (!user || !user.walletId) {
      console.log(`[Backend] ❌ No wallet found for ${telegramId}`);
      return res.status(404).json({ success: false, message: 'User not found or wallet not created' });
    }

    return res.json({
      success: true,
      wallet: {
        walletId: user.walletId,
        seed: user.seed
      }
    });

  } catch (err: any) {
    console.error(`[Backend] ❌ Error in /wallet:`, err.message);
    return res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.response?.data || 'Failed to fetch wallet'
    });
  }
});

// ✅ Get Wallet Address
router.get('/wallet/:walletId/address', async (req, res) => {
  try {
    const { walletId } = req.params;

    if (!walletId) {
      return res.status(400).json({ success: false, message: 'Missing Wallet ID' });
    }

    const response = await axios.get(`${WALLET_API}/wallet/address`, {
      headers: { 'X-Wallet-Id': walletId }
    });

    if (response.data && response.data.address) {
      return res.json({ success: true, address: response.data.address });
    }

    return res.status(400).json({ success: false, message: 'Failed to get wallet address' });

  } catch (err: any) {
    console.error('❌ Error in /wallet/:walletId/address:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
});

// ✅ Get Wallet Balance
router.get('/wallet/:walletId/balance', async (req, res) => {
  try {
    const { walletId } = req.params;

    if (!walletId) {
      return res.status(400).json({ success: false, message: 'Missing Wallet ID' });
    }

    // Get HTR balance
    const htrResponse = await axios.get(`${WALLET_API}/wallet/balance`, {
      headers: {
        'x-wallet-id': walletId
      }
    });

    // Get token balances
    const tokensResponse = await axios.get(`${WALLET_API}/wallet/tokens`, {
      headers: {
        'x-wallet-id': walletId
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

    // Add token balances - converting from atomic units as needed
    if (tokensResponse.data && Array.isArray(tokensResponse.data)) {
      for (const token of tokensResponse.data) {
        if (token.symbol && typeof token.available !== 'undefined') {
          const available = token.available / 100;
          const locked = (token.locked || 0) / 100;
          
          balances[token.symbol] = {
            available,
            locked,
            total: available + locked
          };
        }
      }
    }

    return res.json({
      success: true,
      balances,
      walletId
    });

  } catch (err: any) {
    console.error('❌ Error in /wallet/:walletId/balance:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.response?.data || 'Failed to fetch wallet balance'
    });
  }
});

// ✅ Get Wallet Status
router.get('/wallet/:walletId/status', async (req, res) => {
  try {
    const { walletId } = req.params;
    if (!walletId) return res.status(400).json({ success: false, message: 'Missing Wallet ID' });

    const response = await axios.get(`${WALLET_API}/wallet/status`, {
      headers: { 'X-Wallet-Id': walletId }
    });

    return res.json({ success: true, status: response.data });
  } catch (err: any) {
    console.error('[Backend] ❌ Error in /wallet/:walletId/status:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Helper function to get wallet addresses
async function getWalletAddresses(walletId: string): Promise<string[]> {
  try {
    const response = await axios.get(`${WALLET_API}/wallet/addresses`, {
      headers: { 'X-Wallet-Id': walletId }
    });
    
    return response.data.map((addressObj: { address: string }) => addressObj.address);
  } catch (err) {
    console.error('[Backend] Error fetching wallet addresses:', err);
    return [];
  }
}

// ✅ Transaction history endpoint
router.get('/tx-history/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    if (!telegramId) return res.status(400).json({ success: false, message: 'Missing Telegram ID' });
    
    const existing = getUserByTelegramId(telegramId);
    if (!existing) {
      console.log(`[Backend] ❌ No wallet found for ${telegramId}`);
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    const response = await axios.get(`${WALLET_API}/wallet/tx-history`, { 
      headers: { 'X-Wallet-Id': existing.walletId }
    });
    
    // Define transaction history type
    type TransactionItem = {
      amount: number;
      token: string;
      timestamp: number;
      txId: string;
      status: string;
      explorerUrl: string;  // Add explorer URL field
    };
    
    const history: TransactionItem[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      for (const tx of response.data) {
        // Create explorer URL for the transaction
        const explorerUrl = `https://explorer.alpha.nano-testnet.hathor.network/transaction/${tx.tx_id}`;
        
        history.push({
          amount: tx.value ? tx.value / 100 : 0, // Convert from atomic units
          token: tx.token || 'HTR',
          timestamp: tx.timestamp || Date.now(),
          txId: tx.tx_id || '',
          status: tx.status || 'confirmed',
          explorerUrl: explorerUrl
        });
      }
    }
    
    return res.json({ success: true, history });
  } catch (err: any) {
    console.error('[Backend] ❌ Error in /tx-history:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Send a transaction (/tip)
router.post('/tip', async (req, res) => {
  try {
    const { telegramId, amount, token, recipient } = req.body;
    
    if (!telegramId || !amount || !token || !recipient) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const user = getUserByTelegramId(telegramId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    } 

    const response = await axios.post(`${WALLET_API}/wallet/send`, {
      headers: { 'X-Wallet-Id': user.walletId },
      data: {
        to: recipient,
        amount,
        token 
      }
    });

    return res.json({ success: true, txId: response.data.tx_id });
  } catch (err: any) {
    console.error('[Backend] ❌ Error in /tip:', err.message);
    return res.status(500).json({ success: false, error: err.message });  
  }
});

// ✅ Send a transaction (/send) or sending HTR using the wallet address
router.post('/send', async (req, res) => {
  try {
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

    return res.json({ success: true, txId: response.data.tx_id });
  } catch (err: any) {
    console.error('[Backend] ❌ Error in /send:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;