const db = require("../db/mysql_connect");

// 1. ANA SAYFAYI RENDER ETME (EJS)
const renderDashboard = (req, res) => {
    // views/index.ejs dosyasını ekrana basar
    res.render('index');
};

/* --- KDS KARAR API'LERİ (Veritabanından Veri Çeker) --- */

// KARAR 1: Bölge Raporu
const getBolgeRaporu = async (req, res) => {
    try {
        const query = `
            SELECT 
                b.bolge_adi,
                b.buyume_hedefi_yuzde,
                IFNULL(SUM(s.toplam_tutar), 0) as mevcut_ciro,
                IFNULL(SUM(s.toplam_tutar), 0) * (1 + (b.buyume_hedefi_yuzde / 100)) as hedef_ciro
            FROM Bolgeler b
            LEFT JOIN Satislar s ON b.bolge_id = s.bolge_id
            GROUP BY b.bolge_id, b.bolge_adi;
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// KARAR 2: Bütçe
const getPazarlamaButcesi = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Pazarlama_Harcamalari ORDER BY harcama_tarihi ASC");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// KARAR 3: Kampanya
const getKampanyaPerformansi = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT kampanya_adi, pazarlama_butcesi, beklenen_artis_orani FROM Kampanyalar");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// KARAR 4: Ürün Portföyü (BCG)
const getUrunPerformansi = async (req, res) => {
    try {
        // BCG Matrisi için: Satış Adedi (Pazar Payı temsili) ve Kar Marjı (Büyüme temsili)
        const query = `
            SELECT 
                u.urun_adi,
                u.satis_fiyati,
                SUM(s.adet) as toplam_satis,
                (u.satis_fiyati - u.maliyet_fiyati) as kar_marji
            FROM Urunler u
            LEFT JOIN Satislar s ON u.urun_id = s.urun_id
            GROUP BY u.urun_id;
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// KARAR 5: Kanal Verileri (Simülasyon İçin)
const getKanalVerileri = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Satis_Kanallari");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// KARAR 6: Fiyat Esnekliği
const getFiyatEsnekligi = async (req, res) => {
    try {
        // Ürünlerin maliyetlerini çekiyoruz ki kâr hesabı yapabilelim
        const [rows] = await db.query("SELECT urun_id, urun_adi, satis_fiyati, maliyet_fiyati FROM Urunler LIMIT 1"); 
        // Simülasyon için tek bir örnek ürün (veya ortalama) yeterli olabilir
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// KARAR 7: Trendler
const getTrendler = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Icerikler ORDER BY trend_skoru DESC");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

module.exports = {
    renderDashboard,
    getBolgeRaporu,
    getPazarlamaButcesi,
    getKampanyaPerformansi,
    getUrunPerformansi,
    getKanalVerileri,
    getFiyatEsnekligi,
    getTrendler
};