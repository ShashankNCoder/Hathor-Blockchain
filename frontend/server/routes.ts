import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import * as walletService from "./services/wallet";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Check if wallet exists for the current Telegram user
  app.get("/api/wallet/exists", async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = req.query.telegram_id || "123456789";
      
      // TEMPORARILY FORCE false for testing wallet creation flow
      res.json({
        exists: false,
        address: ""
      });
      return;
      
      // The below code is temporarily disabled to force showing the create/import screens
      /*
      if (process.env.DEMO_MODE === 'true') {
        res.json({
          exists: true,
          address: "HTRxk2T39XFd7LJ51mDECJWbMDvqQu98D9"
        });
        return;
      }
      
      const wallet = await walletService.getWalletByTelegramId(telegramId.toString());
      
      res.json({
        exists: !!wallet,
        address: wallet?.address
      });
      */
    } catch (error) {
      console.error("Error checking wallet existence:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check wallet existence"
      });
    }
  });

  // Create a new wallet
  app.post("/api/wallet/create", async (req: Request, res: Response) => {
    try {
      // Validate request
      const schema = z.object({
        pin: z.string().optional()
      });
      
      const { pin } = schema.parse(req.body);
      
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = "123456789";
      
      const wallet = await walletService.createWallet(telegramId, pin);
      
      res.json({
        success: true,
        address: wallet.address
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create wallet"
      });
    }
  });

  // Import an existing wallet
  app.post("/api/wallet/import", async (req: Request, res: Response) => {
    try {
      // Validate request
      const schema = z.object({
        seedPhrase: z.string(),
        pin: z.string().optional()
      });
      
      const { seedPhrase, pin } = schema.parse(req.body);
      
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = "123456789";
      
      const wallet = await walletService.importWallet(telegramId, seedPhrase, pin);
      
      res.json({
        success: true,
        address: wallet.address
      });
    } catch (error) {
      console.error("Error importing wallet:", error);
      res.status(500).json({
        success: false,
        error: "Failed to import wallet"
      });
    }
  });

  // Get wallet balance
  app.get("/api/wallet/balance", async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = req.query.telegram_id || "123456789";
      
      const balance = await walletService.getWalletBalance(telegramId.toString());
      
      res.json({
        success: true,
        balance
      });
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get wallet balance"
      });
    }
  });

  // Get transaction history
  app.get("/api/wallet/transactions", async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = req.query.telegram_id || "123456789";
      
      const transactions = await walletService.getTransactionHistory(telegramId.toString());
      
      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      console.error("Error getting transaction history:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get transaction history"
      });
    }
  });

  // Get NFT badges
  app.get("/api/wallet/nft-badges", async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = req.query.telegram_id || "123456789";
      
      const badges = await walletService.getNFTBadges(telegramId.toString());
      
      res.json({
        success: true,
        badges
      });
    } catch (error) {
      console.error("Error getting NFT badges:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get NFT badges"
      });
    }
  });

  // Create a new token
  app.post("/api/token/create", async (req: Request, res: Response) => {
    try {
      // Validate request
      const schema = z.object({
        name: z.string(),
        symbol: z.string(),
        supply: z.number().min(1),
        imageUrl: z.string().optional()
      });
      
      const { name, symbol, supply, imageUrl } = schema.parse(req.body);
      
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = "123456789";
      
      const token = await walletService.createToken(telegramId, name, symbol, supply, imageUrl);
      
      res.json({
        success: true,
        token
      });
    } catch (error) {
      console.error("Error creating token:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create token"
      });
    }
  });

  // Send tokens
  app.post("/api/wallet/send", async (req: Request, res: Response) => {
    try {
      // Validate request
      const schema = z.object({
        recipient: z.string(),
        amount: z.number().min(0.000001),
        tokenSymbol: z.string()
      });
      
      const { recipient, amount, tokenSymbol } = schema.parse(req.body);
      
      // In a real implementation, we would get the Telegram user ID from the request
      // For now, we'll use a mock ID
      const telegramId = "123456789";
      
      const transaction = await walletService.sendTokens(telegramId, recipient, amount, tokenSymbol);
      
      res.json({
        success: true,
        transaction
      });
    } catch (error) {
      console.error("Error sending tokens:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send tokens"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
