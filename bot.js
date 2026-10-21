// Load local .env file if available (harmless in production)
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Read Environment Variables
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

// Startup Checks
if (!DISCORD_BOT_TOKEN) {
  console.error("❌ CRITICAL ERROR: DISCORD_BOT_TOKEN environment variable is missing!");
  process.exit(1);
}

if (!MAKE_WEBHOOK_URL) {
  console.error("❌ CRITICAL ERROR: MAKE_WEBHOOK_URL environment variable is missing!");
  process.exit(1);
}

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Logged in successfully as ${client.user.tag}!`);
  console.log("Listening for messages starting with !mybot ...");
});

// Handle incoming messages
client.on('messageCreate', async (message) => {
  // Ignore messages from bots to prevent infinite loops
  if (message.author.bot) return;

  // Trigger on !mybot
  if (message.content.startsWith('!mybot')) {
    console.log(`📩 Received trigger from ${message.author.tag}: ${message.content}`);

    // Extract message content without the prefix
    const cleanContent = message.content.replace('!mybot', '').trim();

    // Send payload to Make Custom Webhook
    try {
      await axios.post(MAKE_WEBHOOK_URL, {
        content: cleanContent || message.content,
        author: {
          id: message.author.id,
          username: message.author.username,
        },
        channelId: message.channel.id,
        messageId: message.id,
        timestamp: new Date().toISOString(),
      });

      console.log('🚀 Payload successfully sent to Make webhook!');
    } catch (error) {
      console.error('❌ Failed to send payload to Make webhook:', error.message);
    }
  }
});

// Login to Discord
client.login(DISCORD_BOT_TOKEN).catch((err) => {
  console.error('❌ Discord login failed:', err.message);
  process.exit(1);
});