import 'dotenv/config';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { Markup } from 'telegraf';
import chalk from 'chalk';

const bot = new Telegraf(process.env.BOT_TOKEN);
const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';
const API_URL = process.env.API_URL || 'http://localhost:3000';

const userTokenCreationState = {};

// --- COMMAND HANDLERS ---

// /start command
bot.start((ctx) => {
  console.log('[Bot] /start command triggered');
  const name = ctx.from.first_name || ctx.from.username || 'there';
  console.log(chalk.green(`User started bot: ${ctx.from.username} (${ctx.from.id})`));

  ctx.reply(
`👋 Hello *${name}*, welcome to *HathorChat*!

🚀 We turn any Telegram group into a token-powered community-no crypto expertise needed.

Here's what you can do:
* /import\\_wallet - Import your own wallet
* /wallet - View your wallet
* /tip @user 5 VIBE - Tip someone
* /create\\_token - Create your own token
* /my\\_badges - Earn badges & rewards
* /unlock - Unlock content

💡 Type /help to see the full list of commands.

\\_You're ready to explore tokenized chat magic!\\_`,
    { parse_mode: 'Markdown' }
  );

  ctx.reply("🚀 Launch Mini App", Markup.inlineKeyboard([
    Markup.button.webApp("Open Wallet", "https://your-miniapp-url.com")
  ]));
});

// /help command
bot.help((ctx) => {
  console.log('[Bot] /help command triggered');
  ctx.reply(
`🪙 *HathorChat Bot Help Menu*

Welcome to HathorChat – where tokenized communities come alive! Here's what I can do for you:

⚙️ *Core Commands*
/start – Start the bot  
/help – Show this help menu
/contact – Contact support
/wallet – View your auto-provisioned HTR wallet  
/import\\_wallet – Import your own wallet
/balance – Check your token + NFT balances  
/status – check your wallet status
/history – View your transaction history 

💸 *Token Features*
\`/tip @username amount token\` – Tip someone (e.g. \`/tip @alice 10 COFFEE\`)  
\`/create\\_token\` – Create your own custom token  
\`/send amount token @username\` – Send tokens directly  

🏆 *Rewards & Badges*
/my\\_badges – View your earned NFT badges  
/claim\\_badge – Manually claim badge if eligible  

🔒 *Token Gating*
/unlock – Unlock premium content  
/access – See what your tokens unlock  

📊 *Admin Tools* (Admins only)
/dashboard – Open Admin Dashboard  
/set\\_threshold – Set token thresholds  
/analytics – View token stats  

🎮 *Bonus Features*
/play\\_quiz – Play a quiz to earn tokens  
/raffle – Join a raffle  

\\_Questions? Ask @HathorOfficial\\_`,
    { parse_mode: 'Markdown' }
  );
});

// /contact command
bot.command('contact', (ctx) => {
  console.log('[Bot] /contact command triggered');
  ctx.reply(
    `👥 *Contact Support*\n\n` +
    `*Official Channels:*\n` +
    `Email: contact@hathor.network\n` +
    `Telegram: @HathorOfficial\n\n` +
    `Website: hathor.network\n\n` +
    `*Social Media:*\n` +
    `🐦 Twitter: [HathorNetwork](https://twitter.com/HathorNetwork)\n` +
    `📘 Facebook: [Hathor Network](https://facebook.com/HathorNetwork)\n` +
    `📸 Instagram: [hathornetwork](https://instagram.com/hathornetworkofficial)\n` +
    `💼 LinkedIn: [Hathor Network](https://linkedin.com/company/hathornetwork)\n` +
    `🔧 GitHub: [HathorNetwork](https://github.com/HathorNetwork)\n` +
    `💬 Discord: [Join our server](https://discord.gg/Eq6wcTkTGs)`,
    { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true 
    }
  );
});

// /wallet Command
bot.command('wallet', async (ctx) => {
  try {
    console.log('[Bot] /wallet command triggered');
    const telegramId = ctx.from.id;
    const res = await axios.post(`${API_BASE}/createWallet`, { telegramId });
    const walletId = res.data.walletId;
    const isNewWallet = res.data.message === 'New wallet created successfully';
    
    ctx.reply(`🪪 ${isNewWallet ? 'Wallet created!' : 'Your existing wallet:'}\n\n🧾 Wallet ID: ${walletId}`);

    const addressRes = await axios.get(`${API_BASE}/wallet/${walletId}/address`);
    const address = addressRes.data.address;
    ctx.reply(`📬 Your wallet address: ${address}`);

    // Only show seed phrase if this is a new wallet and seed exists
    if (isNewWallet && res.data.seed) {
      // First warn the user about seed security
      await ctx.reply(
        `⚠️ *IMPORTANT SECURITY WARNING* ⚠️\n\nI'm about to show your wallet seed phrase. This is like a master key to your wallet.\n\n*NEVER share this with anyone!*\n\n*SAVE IT SOMEWHERE SAFE - Write it down somewhere safe, we are not storing it* - if you lose it, you can't recover your wallet.\n\nReply with "SHOW ME" to view your seed phrase.`, 
        { parse_mode: 'Markdown' }
      );
      
      // Set up one-time handler for the confirmation
      const handleConfirmation = async (confirmCtx) => {
        // Remove this handler after it's used
        bot.telegram.removeListener('text', handleConfirmation);
        
        if (confirmCtx.message.text === 'SHOW ME' && confirmCtx.from.id === telegramId) {
          // Show the seed with additional warnings
          await confirmCtx.reply(
            `🔒 *YOUR SEED PHRASE - STORE SAFELY* 🔒\n\n\`${res.data.seed}\`\n\n⚠️ *SCREENSHOT AND SAVE THIS NOW* ⚠️\n\nThis message will disappear in 5 minutes for security.`,
            { parse_mode: 'Markdown' }
          );
          
          // Notify after 4 minutes
          setTimeout(() => {
            ctx.reply(`⚠️ *WARNING:* Your seed phrase message will be deleted in 1 minute!`, { parse_mode: 'Markdown' });
          }, 480000); // 8 minutes
          
          // Delete after 5 minutes
          setTimeout(() => {
            ctx.reply(`🔐 Your seed phrase has been hidden for security. Remember to keep it saved in a safe place. It cannot be recovered if lost!`, { parse_mode: 'Markdown' });
          }, 600000); // 10 minutes
        } else if (confirmCtx.from.id === telegramId) {
          confirmCtx.reply('❌ Seed phrase display cancelled. Your seed is not shown for security.');
        }
      };
      
      // Add the one-time handler
      bot.on('text', handleConfirmation);
    }
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Could not create your wallet.');
  }
});

// /import_wallet Command
bot.command('import_wallet', async (ctx) => {
  console.log('[Bot] /import_wallet command triggered');
  ctx.reply("🚀 Launch Mini App To Import Your Wallet", Markup.inlineKeyboard([
    Markup.button.webApp("Open Wallet", "https://your-miniapp-url.com")
  ]));
  // TODO: Implement wallet import functionality
  repl
});

// /balance Command
bot.command('balance', async (ctx) => {
  try {
    console.log('[Bot] /balance command triggered');
    const telegramId = ctx.from.id;
    const res = await axios.get(`${API_BASE}/balance/${telegramId}`);
    const balances = res.data.balances;

    let reply = '💰 *Your Balances:*\n';
    for (const [token, amount] of Object.entries(balances)) {
      reply += `\n*${token}*\n`;
      reply += `• Available: ${amount.available}\n`;
      reply += `• Locked: ${amount.locked}\n`;
      reply += `• Total: ${amount.total}\n`;
    }
    ctx.replyWithMarkdown(reply);
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Could not fetch your balance.');
  }
});

// /status Command 
bot.command('status', async (ctx) => {
  console.log('[Bot] /status command triggered');
  try {
    const telegramId = ctx.from.id;
    const res = await axios.get(`${API_BASE}/status/${telegramId}`);
    const status = res.data;

    if (!status.success) {
      return ctx.reply('❌ ' + (status.message || 'Could not fetch wallet status.'));
    }

    let reply = '📊 *Wallet Status:*\n';
    reply += `• Telegram ID: ${telegramId}\n`;
    reply += `• Status: ${status.statusMessage}\n`;
    reply += `• Network: ${status.network}\n`;
    reply += `• Server: ${status.serverUrl}\n`;

    ctx.replyWithMarkdown(reply);
  } catch (err) {
    console.error('[Bot] Error in /status:', err);
    ctx.reply('❌ Could not fetch wallet status.');
  }
});

// /history Command
bot.command('history', async (ctx) => {
  console.log('[Bot] /history command triggered');
  try {
    const telegramId = ctx.from.id;
    const res = await axios.get(`${API_BASE}/tx-history/${telegramId}`);
    
    const history = res.data;

    if (!history.success) {
      return ctx.reply('❌ ' + (history.message || 'Could not fetch wallet history.'));
    }

    let reply = '📊 *Wallet History:*\n';
    reply += `• Telegram ID: ${telegramId}\n\n`;
    
    if (history.history && history.history.length > 0) {
      // Get the last 10 transactions (or all if less than 10)
      const lastTransactions = history.history.slice(0, 10);
      
      reply += '*Last 10 Transactions:*\n\n';
      
      lastTransactions.forEach((tx, index) => {
        // Format date properly
        const date = new Date(tx.timestamp * 1000).toLocaleString();
        
        // Always show as received with proper amount formatting
        const typeEmoji = '📥';
        const typeDisplay = `TRANSACTION ${index + 1}`;
        const amount = (tx.amount || 1.0).toFixed(2); // Format with 2 decimal places
        
        reply += `${index + 1}. ${typeEmoji} *${typeDisplay}*\n`;
        reply += `   • Date: ${date}\n`;
        reply += `   • Amount: ${amount} ${tx.token}\n`;
        reply += `   • Status: ${tx.status}\n`;
        reply += `   • [View on Explorer](${tx.explorerUrl})\n\n`;
      });
      
      // Add instruction for viewing detailed transaction info
      reply += "To view detailed transaction info, use:\n`/tx [transaction_id]`\n";
      if (lastTransactions[0] && lastTransactions[0].txId) {
        reply += `Example: \`/tx ${lastTransactions[0].txId}\``;
      }
    } else {
      reply += "No transaction history found.";
    }

    ctx.replyWithMarkdown(reply);
  } catch (err) {
    console.error('[Bot] Error in /history:', err);
    ctx.reply('❌ Could not fetch wallet history.');
  }
});

// /tx Command - Get detailed transaction info
bot.command('tx', async (ctx) => {
  console.log('[Bot] /tx command triggered');
  try {
    const message = ctx.message.text.trim();
    const parts = message.split(' ');
    
    if (parts.length !== 2) {
      return ctx.reply(
        '❌ *Invalid usage!*\n\nPlease provide a transaction ID.\nExample: `/tx 0000340349f9342c4e5eda6f818697f6c1748a81e2ff4b67bc2211d7f8761b11`',
        { parse_mode: 'Markdown' }
      );
    }
    
    const txId = parts[1].trim();
    const telegramId = ctx.from.id;
    
    const statusMsg = await ctx.reply(`🔍 Fetching transaction details for: \`${txId}\`...`, { parse_mode: 'Markdown' });
    
    // Make API call to get transaction details
    const res = await axios.get(`${API_BASE}/transaction/${telegramId}/${txId}`);
    
    if (!res.data.success || !res.data.transaction) {
      return ctx.reply('❌ Transaction not found or couldn\'t be retrieved.');
    }
    
    const tx = res.data.transaction;
    
    // Format the timestamp properly - ensure it displays correctly
    const txDate = tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleString() : 'Unknown';

    const explorerUrl = `https://explorer.alpha.nano-testnet.hathor.network/transaction/${tx.tx_id}`;
    
    // Format transaction details
    let reply = `🧾 *Transaction Details:*\n\n`;
    reply += `• *Transaction ID:* \`${tx.tx_id || txId}\`\n`;
    reply += `• *Address:* ${tx.outputs?.[0]?.decoded?.address || 'N/A'}\n`;
    reply += `• *Timestamp:* ${txDate}\n`;
    reply += `• *Status:* Confirmed\n`;
    reply += `• *Voided:* ${tx.is_voided ? 'true' : 'false'}\n\n`;


    reply += `• *Explorer:* [View on Explorer](${explorerUrl})\n\n`;
    
    ctx.replyWithMarkdown(reply);
  } catch (err) {
    console.error('[Bot] Error in /tx:', err);
    ctx.reply('❌ Could not fetch transaction details. Check if the transaction ID is correct.');
  }
});

// /tip Command
bot.command('tip', async (ctx) => {
  try {
    console.log('[Bot] /tip command triggered');
    const message = ctx.message.text.trim();
    const parts = message.split(' ');

    if (parts.length !== 4) {
      return ctx.reply(
        `🚫 *Invalid usage!*\n\nTry:\n/tip @username 10 VIBE\n\n_Example:_ /tip @alice 5 HTR`,
        { parse_mode: 'Markdown' }
      );
    }

    const [_, mention, amountStr, tokenSymbol] = parts;

    if (!mention.startsWith('@')) {
      return ctx.reply(`❗ Please mention a user with @username.`);
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      return ctx.reply(`💡 Please enter a valid number greater than 0 for amount.`);
    }

    const recipient = mention.replace('@', '');
    const sender = ctx.from.username || ctx.from.id;

    await ctx.reply(`💸 Sending *${amount} ${tokenSymbol}* from @${sender} to @${recipient}...`, {
      parse_mode: 'Markdown',
    });

    await new Promise((r) => setTimeout(r, 1000));

    await ctx.reply(
      `✅ Tip sent!\n@${sender} just sent *${amount} ${tokenSymbol}* to @${recipient} 🎉`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error(err);
    ctx.reply(`😓 Something went wrong. Try again later.`);
  }
});

// /send Command just like tipping tokens or sending HTR using the wallet address
bot.command('send', async (ctx) => {
  console.log('[Bot] /send command triggered');
  const message = ctx.message.text.trim();
  const parts = message.split(' ');

  if (parts.length !== 4) { 
    return ctx.reply(
      `🚫 *Invalid usage!*\n\nTry:\n/send 10 VIBE @username\n\n_Example:_ /send 5 HTR @alice`,
      { parse_mode: 'Markdown' }
    );
  }

  const [_, amountStr, tokenSymbol, mention] = parts;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return ctx.reply(`💡 Please enter a valid number greater than 0 for amount.`);
  }

  const recipient = mention.replace('@', '');
  const sender = ctx.from.username || ctx.from.id;  

  await ctx.reply(`💸 Sending *${amount} ${tokenSymbol}* from @${sender} to @${recipient}...`, {
    parse_mode: 'Markdown',
  });

  await new Promise((r) => setTimeout(r, 1000));  

  await ctx.reply(
    `✅ HTR sent!\n@${sender} just sent *${amount} ${tokenSymbol}* to @${recipient} 🎉`,
    { parse_mode: 'Markdown' }
  );
});


// --- START THE BOT ---

bot.launch();
console.log(chalk.cyan('🤖 HathorChat bot is up and running!'));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
