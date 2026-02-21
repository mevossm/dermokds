const router = require('express').Router();
const {
    renderDashboard,
    getBolgeRaporu,
    getPazarlamaButcesi,
    getKampanyaPerformansi,
    getUrunPerformansi,
    getKanalVerileri,
    getFiyatEsnekligi,
    getTrendler
} = require("../controllers/controller");

// SAYFA GÖRÜNÜMÜ (VIEW)
router.get('/', renderDashboard); 

// KDS API ENDPOINTLERİ (DATA)
router.get('/api/karar1-bolge', getBolgeRaporu);
router.get('/api/karar2-butce', getPazarlamaButcesi);
router.get('/api/karar3-kampanya', getKampanyaPerformansi);
router.get('/api/karar4-urunler', getUrunPerformansi);
router.get('/api/karar5-kanallar', getKanalVerileri);
router.get('/api/karar6-fiyat', getFiyatEsnekligi);
router.get('/api/karar7-trend', getTrendler);

module.exports = router;
// ... (Mevcut kodların burada duruyor)

// --- YENİ EKLENEN ADMIN YOLLARI (CRUD & MVC İÇİN) ---
const AdminController = require('../controllers/AdminController');

// Admin Paneli Görünümü (READ)
router.get('/admin', AdminController.renderAdminPage);

// Ürün Ekleme (CREATE - POST Methodu)
router.post('/admin/add', AdminController.addProduct);

// Ürün Silme (DELETE - GET Methodu ile basitleştirilmiş)
router.get('/admin/delete/:id', AdminController.deleteProduct);

module.exports = router;