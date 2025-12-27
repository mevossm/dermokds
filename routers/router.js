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