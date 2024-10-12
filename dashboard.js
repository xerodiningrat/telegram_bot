// dashboard.js
module.exports = function setupDashboard(bot, adminChatId, stokProduk) {
    // Command untuk mengakses dashboard admin
    bot.onText(/\/dashboard/, (msg) => {
        const chatId = msg.chat.id;

        if (chatId === adminChatId) {
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'AI ChatGPT+', callback_data: 'edit_stok_ai_chatgpt' },
                            { text: 'AI Claude', callback_data: 'edit_stok_ai_claude' }
                        ],
                        [
                            { text: 'AI Perplexity', callback_data: 'edit_stok_ai_perplexity' },
                            { text: 'AI You', callback_data: 'edit_stok_ai_you' }
                        ],
                        [
                            { text: 'Alight Motion', callback_data: 'edit_stok_alight_motion' }
                        ]
                    ]
                }
            };

            bot.sendMessage(chatId, 'Selamat datang di Dashboard Admin. Pilih produk untuk mengedit stok:', options);
        } else {
            bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk mengakses dashboard.');
        }
    });

    // Handler untuk mengedit stok produk
    bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        if (chatId === adminChatId) {
            let produkDipilih;

            switch (data) {
                case 'edit_stok_ai_chatgpt':
                    produkDipilih = 'ai_chatgpt';
                    break;
                case 'edit_stok_ai_claude':
                    produkDipilih = 'ai_claude';
                    break;
                case 'edit_stok_ai_perplexity':
                    produkDipilih = 'ai_perplexity';
                    break;
                case 'edit_stok_ai_you':
                    produkDipilih = 'ai_you';
                    break;
                case 'edit_stok_alight_motion':
                    produkDipilih = 'alight_motion';
                    break;
                default:
                    produkDipilih = null;
            }

            if (produkDipilih) {
                const stokSaatIni = stokProduk[produkDipilih];

                const message = `Produk: ${produkDipilih}\n` +
                                `Stok saat ini: ${stokSaatIni}\n` +
                                `Silakan tambahkan atau kurangi stok.`;

                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '➕ Tambah Stok', callback_data: `tambah_stok_${produkDipilih}` },
                                { text: '➖ Kurangi Stok', callback_data: `kurangi_stok_${produkDipilih}` }
                            ],
                            [
                                { text: 'Kembali ke Dashboard', callback_data: 'back_to_dashboard' }
                            ]
                        ]
                    }
                };

                bot.editMessageText(message, { chat_id: chatId, message_id: messageId, ...options });
            }
        }
    });

    // Handler untuk menambah atau mengurangi stok produk
    bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        if (chatId === adminChatId) {
            let produkDipilih;

            if (data.startsWith('tambah_stok_')) {
                produkDipilih = data.replace('tambah_stok_', '');
                stokProduk[produkDipilih]++;
            } else if (data.startsWith('kurangi_stok_')) {
                produkDipilih = data.replace('kurangi_stok_', '');
                if (stokProduk[produkDipilih] > 0) {
                    stokProduk[produkDipilih]--;
                }
            }

            if (produkDipilih) {
                const stokBaru = stokProduk[produkDipilih];

                const message = `Produk: ${produkDipilih}\n` +
                                `Stok baru: ${stokBaru}\n` +
                                `Stok berhasil diperbarui.`;

                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Kembali ke Dashboard', callback_data: 'back_to_dashboard' }
                            ]
                        ]
                    }
                };

                bot.editMessageText(message, { chat_id: chatId, message_id: messageId, ...options });
            }
        }
    });
};
