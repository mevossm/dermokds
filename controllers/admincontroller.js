const UrunModel = require('../models/UrunModel');

const AdminController = {
    // Admin sayfasını göster
    renderAdminPage: (req, res) => {
        UrunModel.getAll((err, results) => {
            if (err) return res.send("Veritabanı hatası");
            // Hata mesajı varsa sayfaya gönder, yoksa null
            const error = req.query.error || null;
            const success = req.query.success || null;
            res.render('admin', { urunler: results, error, success });
        });
    },

    // Ürün Ekleme İşlemi (CREATE) + İŞ KURALI 1
    addProduct: (req, res) => {
        const { urun_adi, kategori, satis_fiyati, stok_adedi } = req.body;

        // --- SENARYO 1: Fiyat Güvenliği Kuralı ---
        // Kural: Satış fiyatı 0 veya negatif olamaz.
        if (parseFloat(satis_fiyati) <= 0) {
            return res.redirect('/admin?error=HATA: Satış fiyatı 0 veya negatif olamaz!');
        }

        // Kural: Stok adedi negatif olamaz.
        if (parseInt(stok_adedi) < 0) {
            return res.redirect('/admin?error=HATA: Stok adedi geçersiz.');
        }

        const newProduct = { urun_adi, kategori, satis_fiyati, stok_adedi };
        
        UrunModel.create(newProduct, (err, result) => {
            if (err) return res.redirect('/admin?error=Veritabanı kayıt hatası!');
            res.redirect('/admin?success=Ürün başarıyla eklendi.');
        });
    },

    // Ürün Silme İşlemi (DELETE) + İŞ KURALI 2
    deleteProduct: (req, res) => {
        const id = req.params.id;

        // --- SENARYO 2: Veri Bütünlüğü Kuralı ---
        // Kural: Eğer bir ürünün geçmişte satışı varsa SİLİNEMEZ.
        UrunModel.checkSalesHistory(id, (err, result) => {
            if (err) return res.redirect('/admin?error=Kontrol hatası');

            if (result[0].sayi > 0) {
                // Satış geçmişi var, silme engellendi!
                return res.redirect('/admin?error=ENGEL: Bu ürünün satış geçmişi olduğu için silinemez!');
            } else {
                // Satış yok, silebilirsin
                UrunModel.delete(id, (err, result) => {
                    if (err) return res.redirect('/admin?error=Silme hatası');
                    res.redirect('/admin?success=Ürün silindi.');
                });
            }
        });
    }
};

module.exports = AdminController;