const schedule = require('node-schedule');

function sendPromosiNotification(bot, chatId) {
    const message = 
    '🎉 Promo Spesial untuk Pengguna Setia! 🎉\n' +
    '🔥 AI Premium & Streaming Premium kini hadir dengan diskon eksklusif! 🔥\n\n' +
    
    '✨ *AI Premium*: Dapatkan akses ke teknologi AI canggih yang siap mempermudah hidup dan pekerjaan Anda! ' +
    'Mulai dari asisten cerdas, otomatisasi tugas, hingga analisis data profesional, semua tersedia dalam satu paket premium.\n' +
    '💡 *Kenapa AI Premium?*\n\n' +
    '• Proses lebih cepat\n' +
    '• Hasil lebih akurat\n' +
    '• Sesuai untuk kebutuhan bisnis dan pribadi\n\n' +

    '🎬 *Streaming Premium*: Nikmati konten terbaik dengan kualitas tertinggi! Film, serial, dan acara TV favorit Anda, ' +
    'semuanya tanpa iklan dan dengan kualitas HD. Rasakan pengalaman menonton tanpa batas di mana saja dan kapan saja.\n' +
    '📺 *Keunggulan Streaming Premium:*\n\n' +
    '• Akses eksklusif ke ribuan konten\n' +
    '• Kualitas streaming hingga 4K\n' +
    '• Nikmati tanpa jeda iklan\n\n' +

    '🚀 *Promo Terbatas!* Dapatkan diskon besar hanya untuk waktu terbatas! ' +
    'Jangan lewatkan kesempatan ini dan tingkatkan pengalaman Anda dengan layanan premium kami.\n\n' +

    'Klik sekarang untuk menikmati manfaatnya dan jadilah bagian dari mereka yang menikmati teknologi masa depan ' +
    'dan hiburan tanpa batas!\n\n' +

    '👉 *Cek Sekarang dan Nikmati Promo Spesial Ini!* 👈';


    bot.sendMessage(chatId, message);
}

module.exports = function setupPromosiNotifikasi(bot, adminChatId) {
 
    schedule.scheduleJob('0 12 * * *', function() {
        console.log('Mengirim notifikasi promosi jam 12 siang...');
        sendPromosiNotification(bot, adminChatId);
    });


    schedule.scheduleJob('0 19 * * *', function() {
        console.log('Mengirim notifikasi promosi jam 7 malam...');
        sendPromosiNotification(bot, adminChatId);
    });
};
