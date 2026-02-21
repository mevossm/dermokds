const db = require('../db/mysql_connect'); // Senin db bağlantı dosyan

const UrunModel = {
    // Tüm ürünleri getir (READ)
    getAll: (callback) => {
        const query = "SELECT * FROM urunler ORDER BY urun_id DESC";
        db.query(query, callback);
    },

    // Yeni ürün ekle (CREATE)
    create: (data, callback) => {
        const query = "INSERT INTO urunler (urun_adi, kategori, satis_fiyati, stok_adedi) VALUES (?, ?, ?, ?)";
        db.query(query, [data.urun_adi, data.kategori, data.satis_fiyati, data.stok_adedi], callback);
    },

    // Ürün sil (DELETE)
    delete: (id, callback) => {
        const query = "DELETE FROM urunler WHERE urun_id = ?";
        db.query(query, [id], callback);
    },
    
    // Ürünün satış geçmişini kontrol et (İş Kuralı İçin Gerekli)
    checkSalesHistory: (id, callback) => {
        const query = "SELECT COUNT(*) as sayi FROM satislar WHERE urun_id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = UrunModel;