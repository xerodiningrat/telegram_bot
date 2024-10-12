const midtransClient = require('midtrans-client');

module.exports = (bot, stokProduk) => {
    let jumlahPesanan = 1;
    let hargaLangganan = 0;
    let deskripsiProduk = '';
    let transactionId = '';
    let paymentCheckInterval;
    const PAYMENT_TIMEOUT = 300000; 

    // Setup Midtrans Client
    const snap = new midtransClient.Snap({
        isProduction: true,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
    });
    

    // Function to generate a random transaction ID
    function generateTransactionId(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let transactionId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            transactionId += characters[randomIndex];
        }
        return transactionId;
    }

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'AI ChatGPT+', callback_data: 'ai_chatgpt' },
                        { text: 'AI Claude', callback_data: 'ai_claude' }
                    ],
                    [
                        { text: 'AI Perplexity', callback_data: 'ai_perplexity' },
                        { text: 'AI You', callback_data: 'ai_you' }
                    ],
                    [
                        { text: 'Alight Motion', callback_data: 'alight_motion' }
                    ]
                ]
            }
        };
        bot.sendMessage(chatId,
            ' CoinFireBoost Indonesia\n ' +
            '╭──────────────╮\n' +
            '│ Selamat datang di CoinImp Store Indonesia 🌟\n' +
            '│───────────────\n' +
            '│ Nikmati pengalaman berbelanja yang\n' +
            '│ lebih baik dengan produk AI terdepan!\n' +
            '│\n' +
            '│ 🎉 **Mengapa memilih kami?**\n' +
            '│ • Produk berkualitas tinggi dari AI terbaik.\n' +
            '│ • Jaminan kepuasan dengan dukungan penuh.\n' +
            '│ • Harga bersaing dan banyak pilihan!\n' +
            '│\n' +
            '│ 💬 **Silahkan pilih produk yang mau dibeli:**\n' +
            '╰──────────────╯', options);
    });

    function displaySubscriptionOptions(chatId, produk) {
        deskripsiProduk = produk;

        let harga7Hari, harga30Hari;
        switch (produk) {
            case 'ai_chatgpt':
                harga7Hari = 18000;
                harga30Hari = 68000;
                break;
            case 'ai_claude':
                harga7Hari = 20000;
                harga30Hari = 50000;
                break;
            case 'ai_perplexity':
                harga7Hari = 15000;
                harga30Hari = 40000;
                break;
            case 'ai_you':
                harga7Hari = 15000;
                harga30Hari = 60000;
                break;
            case 'alight_motion':
                harga7Hari = 12000;
                harga30Hari = 35000;
                break;
            default:
                harga7Hari = 0;
                harga30Hari = 0;
        }

        const currentTime = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });

        const message =
            'CoinFireBoost Indonesia 🔥\n' +
            '╭─────────────────✧\n' +
            `┊・ Produk: ${produk}\n` +
            `┊・ Stok Terjual: 11700\n` +
            `┊・ Desk: Sharing & Full Garansi.\n` +
            '╰─────────────────✧\n' +
            '╭─────────────────✧\n' +
            `┊ Variasi, Harga & Stok:\n` +
            `┊・ 1 Minggu: Rp. ${harga7Hari} - Stok: 38\n` +
            `┊・ 1 Bulan: Rp. ${harga30Hari} - Stok: 45\n` +
            '╰─────────────────✧\n' +
            `╰➤ Refresh at ${currentTime}`;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `1 Minggu - Rp. ${harga7Hari}`, callback_data: 'langganan_7_hari' },
                        { text: `1 Bulan - Rp. ${harga30Hari}`, callback_data: 'langganan_30_hari' }
                    ],
                    [
                        { text: 'Kembali', callback_data: 'back_to_menu' }
                    ]
                ]
            }
        };

        bot.sendMessage(chatId, message, options);
    }

    bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        switch (data) {
            case 'ai_chatgpt':
            case 'ai_claude':
            case 'ai_perplexity':
            case 'ai_you':
            case 'alight_motion':
                displaySubscriptionOptions(chatId, data);
                break;

            case 'langganan_7_hari':
                hargaLangganan = getHargaLangganan(deskripsiProduk, 7);
                showOrderConfirmation(chatId, messageId, deskripsiProduk, hargaLangganan, 38, 11700);
                break;

            case 'langganan_30_hari':
                hargaLangganan = getHargaLangganan(deskripsiProduk, 30);
                showOrderConfirmation(chatId, messageId, deskripsiProduk, hargaLangganan, 45, 11700);
                break;

            case 'increment_order':
                jumlahPesanan++;
                refreshOrder(chatId, messageId);
                break;

            case 'decrement_order':
                if (jumlahPesanan > 1) {
                    jumlahPesanan--;
                }
                refreshOrder(chatId, messageId);
                break;

            case 'confirm_order':
                showPaymentQRCode(chatId);
                break;

            case 'back_to_menu':
                showMainMenu(chatId);
                break;

            case 'cancel_order':
                cancelOrder(chatId);
                break;

            default:
                bot.sendMessage(chatId, 'Pilihan tidak dikenal.');
        }
    });

    function getHargaLangganan(produk, durasi) {
        switch (produk) {
            case 'ai_chatgpt':
                return durasi === 7 ? 18000 : 68000;
            case 'ai_claude':
                return durasi === 7 ? 20000 : 50000;
            case 'ai_perplexity':
                return durasi === 7 ? 15000 : 40000;
            case 'ai_you':
                return durasi === 7 ? 15000 : 60000;
            case 'alight_motion':
                return durasi === 7 ? 12000 : 35000;
            default:
                return 0;
        }
    }

    function showOrderConfirmation(chatId, messageId, produk, harga, stok, stokTerjual) {
        const totalHarga = jumlahPesanan * harga;
        const currentTime = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });

        const message =
            ' CoinFireBoost Indonesia🔥\n' +
            '╭─────────────────╮\n' +
            `│ Produk: ${produk}\n` +
            `│ Variasi: ${harga === 10000 ? '1 Minggu' : '1 Bulan'}\n` +
            `│ Harga satuan: Rp. ${harga}\n` +
            `│ Stok: ${stok} - Terjual: ${stokTerjual}\n` +
            '│─────────────── \n' +
            `│ Jumlah Pesanan: x${jumlahPesanan}\n` +
            `│ Total Harga: Rp. ${totalHarga}\n` +
            '╰─────────────────╯\n' +
            `Refresh at ${currentTime}`;

        const options = {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '➖', callback_data: 'decrement_order' },
                        { text: '🔄 Refresh', callback_data: 'refresh_order' },
                        { text: '➕', callback_data: 'increment_order' },
                    ],
                    [
                        { text: '✅ Konfirmasi Pesanan', callback_data: 'confirm_order' },
                        { text: '❌ Cancel', callback_data: 'cancel_order' },
                    ]
                ]
            }
        };

        bot.editMessageText(message, options);
    }

    function refreshOrder(chatId, messageId) {
        const totalHarga = jumlahPesanan * hargaLangganan;
        const currentTime = new Date().toLocaleTimeString(); // Ambil waktu saat ini
        const message =
            '🔥 CoinFireBoost Indonesia 🔥\n' +
            '╭─────────────────╮\n' +
            `│ Produk: ${deskripsiProduk}\n` +
            `│ Harga satuan: Rp. ${hargaLangganan}\n` +
            `│ Jumlah Pesanan: x${jumlahPesanan}\n` +
            `│ Total Harga: Rp. ${totalHarga}\n` +
            `│ Waktu: ${currentTime}\n` + // Tambahkan waktu saat ini
            '╰─────────────────╯\n';
    
        const options = {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '➖', callback_data: 'decrement_order' },
                        { text: '🔄 Refresh', callback_data: 'refresh_order' },
                        { text: '➕', callback_data: 'increment_order' },
                    ],
                    [
                        { text: '✅ Konfirmasi Pesanan', callback_data: 'confirm_order' },
                        { text: '❌ Cancel', callback_data: 'cancel_order' },
                    ]
                ]
            }
        };
    
        bot.editMessageText(message, options);
    }
    

    function cancelOrder(chatId) {
        jumlahPesanan = 1; 
        bot.sendMessage(chatId, 'Pesanan telah dibatalkan. Silakan pilih produk lainnya!');
        showMainMenu(chatId);
    }

    function showMainMenu(chatId) {
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'AI ChatGPT+', callback_data: 'ai_chatgpt' },
                        { text: 'AI Claude', callback_data: 'ai_claude' }
                    ],
                    [
                        { text: 'AI Perplexity', callback_data: 'ai_perplexity' },
                        { text: 'AI You', callback_data: 'ai_you' }
                    ],
                    [
                        { text: 'Alight Motion', callback_data: 'alight_motion' }
                    ]
                ]
            }
        };
        bot.sendMessage(chatId, 'Silakan pilih produk yang mau dibeli:', options);
    }

    function showPaymentQRCode(chatId) {
        transactionId = generateTransactionId(10); 
        const orderDetails = {
            transaction_details: {
                order_id: transactionId,
                gross_amount: jumlahPesanan * hargaLangganan,
            }
        };

        snap.createTransaction(orderDetails).then((transaction) => {
            const paymentUrl = transaction.redirect_url;

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Bayar Sekarang', url: paymentUrl }]
                    ]
                }
            };

            bot.sendMessage(chatId, 'Silakan lakukan pembayaran dengan mengklik tombol di bawah ini:', options);

            paymentCheckInterval = setInterval(() => checkPaymentStatus(chatId, transactionId), 10000);

            setTimeout(() => cancelIfUnpaid(chatId, transactionId), PAYMENT_TIMEOUT);
        }).catch((error) => {
            console.error('Error creating transaction:', error);
            bot.sendMessage(chatId, 'Terjadi kesalahan saat membuat transaksi. Silakan coba lagi.');
        });
    }

    function cancelIfUnpaid(chatId, transactionId) {
        snap.transaction.status(transactionId).then((statusResponse) => {
            if (statusResponse.transaction_status !== 'settlement') {
                clearInterval(paymentCheckInterval); 
                bot.sendMessage(chatId, 'Waktu pembayaran habis. Pesanan dibatalkan.');
            }
        }).catch((error) => {
            console.error('Error checking transaction status:', error);
            bot.sendMessage(chatId, 'Terjadi kesalahan saat memeriksa status pembayaran.');
        });
    }

    function checkPaymentStatus(chatId, transactionId, userName) {
        snap.transaction.status(transactionId).then((statusResponse) => {
            console.log(`Checking payment status for transaction ID: ${transactionId}`);

            if (statusResponse.transaction_status === 'settlement') {
                clearInterval(paymentCheckInterval); 

                const invoiceMessage =
                    'CoinFireBoost Indonesia 🔥\n' +
                    `🎉 Selamat, ${userName}! Transaksi Anda Berhasil! 🎉 \n` +
                    '╭──────────────╮\n' +
                    '│─────────────────────\n' +
                    '│       INVOICE COINFIREBOOST       \n' +
                    '│─────────────────────\n' +
                    `│ Order ID: ${transactionId}\n` +
                    `│ Produk: ${deskripsiProduk}\n` +
                    `│ Jumlah: x${jumlahPesanan}\n` +
                    `│ Total: Rp. ${jumlahPesanan * hargaLangganan}\n` +
                    `│ Status: ${statusResponse.transaction_status}\n` +
                    '╰──────────────╯\n' +
                    '🌟 Terima kasih telah bertransaksi dengan kami! 🌟\n' +
                    '🔥 Selamat bergabung dengan CoinFireBoost Indonesia! 🔥\n' +
                    '✨ Kami menghargai dukungan Anda dan berharap Anda menikmati layanan kami! ✨';

                bot.sendMessage(chatId, invoiceMessage).then(() => {

                    const confirmationMessage =
                    'CoinFireBoost Indonesia 🔥\n' +
                     '╭─────────────────────────────────────────╮\n' +
                        '│ 🌟 Pembayaran Anda Telah Berhasil! 🎉       │\n' +
                        '│ ✨ Segera konfirmasi pesanan Anda dan      │\n' +
                        '│ nikmati layanan kami!                     │\n' +
                        '│ 📸 Jangan lupa untuk mengambil screenshot   │\n' +
                        '│ dari invoice dan bukti pembayaran sebagai   │\n' +
                        '│ referensi!                               │\n' +
                        '│ Terima kasih telah memilih CoinFireBoost  │\n' +
                        '│ Indonesia! 🔥                            │\n' +
                        '╰─────────────────────────────────────────╯\n';
                    ;
                    const options = {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '✅ Konfirmasi Pesanan', url: 'https://wa.me/6285771756364' } // Arahkan ke WhatsApp
                                ]
                            ]
                        }
                    };

                    bot.sendMessage(chatId, confirmationMessage, options);
                });
            }
        }).catch((error) => {
            console.error('Error fetching transaction status:', error);
        });
    }

}    