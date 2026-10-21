const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Configuration
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // Required to read message text
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Listening for messages...`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages sent by bots (to prevent infinite loops)
  if (message.author.bot) return;

  // Check if message starts with your prefix
  if (message.content.startsWith('!Make')) {
    try {
      console.log(`Forwarding message to Make: "${message.content}"`);
      
      // Post message data directly to Make Webhook
      await axios.post(MAKE_WEBHOOK_URL, {
        content: message.content,
        author: message.author.username,
        channelId: message.channel.id
      });
    } catch (error) {
      console.error('Error forwarding message to Make:', error.message);
    }
  }
});

client.login(DISCORD_BOT_TOKEN);