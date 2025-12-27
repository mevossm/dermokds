const express = require('express');
const path = require('path');
require('dotenv').config();

// Router dosyamızı çağırıyoruz
const router = require('./routers/router');

const app = express();

// 1. EJS Görüntü Motoru Ayarları
app.set('view engine', 'ejs'); // Motorun adını belirttik
app.set('views', path.join(__dirname, 'views')); // .ejs dosyaları nerede duracak?

// 2. Statik Dosyalar (CSS, JS, Resimler)
// Tarayıcı bu klasörün içindekilere doğrudan erişebilir
app.use(express.static(path.join(__dirname, 'public')));

// 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Rotaları Kullan
// Gelen tüm istekleri router.js dosyasına yönlendir
app.use('/', router);

// 5. Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Dermalyva KDS Sunucusu Çalışıyor: http://localhost:${PORT}`);
});