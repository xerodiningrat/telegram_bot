const TelegramBot = require('node-telegram-bot-api');
const midtransClient = require('midtrans-client');
const path = require('path');
const setupDashboard = require('./dashboard');  
const botHandler = require('./utama'); 
const setupPromosiNotifikasi = require('./notifce');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const adminChatId = process.env.ADMIN_CHAT_ID;
let stokProduk = {
    ai_chatgpt: 38,
    ai_claude: 45,
    ai_perplexity: 38,
    ai_you: 45,
    alight_motion: 50
};

setupDashboard(bot, adminChatId, stokProduk);

botHandler(bot, stokProduk);  

setupPromosiNotifikasi(bot, adminChatId);


