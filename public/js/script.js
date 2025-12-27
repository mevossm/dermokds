// --- GLOBAL CHART AYARLARI ---
Chart.defaults.color = '#94A3B8'; 
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)'; 
Chart.defaults.font.family = "'Inter', sans-serif";

// Global Değişkenler
let comparisonChartInstance;
let allProductsData = [];
let priceChart; 

document.addEventListener('DOMContentLoaded', () => {
    fetchRegion();
    fetchBudget();
    fetchCampaign();
    fetchBCG(); 
    initSims(); // Karar 5 ve 6
    fetchTrends(); // Karar 7
});

// --- 1. BÖLGE VERİSİ ---
async function fetchRegion() {
    try {
        const res = await fetch('/api/karar1-bolge');
        const data = await res.json();
        
        // Simüle edilmiş veriler
        const simData = [
            { name: 'İstanbul', change: '+24.5%', suffix: 'Potansiyel' },
            { name: 'İzmir', change: '+18.2%', suffix: 'Büyüme' },
            { name: 'Ankara', change: '-3.1%', suffix: 'Daralma' }
        ];

        const cityMap = { 'İstanbul': 'istanbul', 'İzmir': 'izmir', 'Ankara': 'ankara' };

        simData.forEach(item => {
            const cityClass = cityMap[item.name];
            const metricEl = document.querySelector(`.hub-${cityClass} .hub-metric`);
            if(metricEl) metricEl.innerText = `${item.change} ${item.suffix}`;
        });

    } catch (e) { console.error("Bölge verisi hatası:", e); }
}

// --- 2. BÜTÇE GRAFİĞİ ---
async function fetchBudget() {
    const ctx = document.getElementById('budgetChart');
    if(!ctx) return;
    
    const labels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const budgetData = [45000, 38000, 52000, 48000, 60000, 55000, 58000, 49000, 53000, 59000, 62000, 68000];
    const roiData = [52000, 41000, 68000, 55000, 78000, 71000, 82000, 59000, 65000, 75000, 81000, 94000];

    let maxDiff = -Infinity; let minDiff = Infinity; let bestMonthIndex = 0; let worstMonthIndex = 0;
    for(let i=0; i<labels.length; i++) {
        let diff = roiData[i] - budgetData[i]; 
        if(diff > maxDiff) { maxDiff = diff; bestMonthIndex = i; }
        if(diff < minDiff) { minDiff = diff; worstMonthIndex = i; }
    }
    const bestEl = document.getElementById('best-month');
    const worstEl = document.getElementById('worst-month');
    const suggestEl = document.getElementById('budget-suggest');
    if(bestEl) bestEl.innerText = `${labels[bestMonthIndex]} (Yüksek Kâr)`;
    if(worstEl) worstEl.innerText = `${labels[worstMonthIndex]} (Düşük Verim)`;
    if(suggestEl) suggestEl.innerText = "%15 Artış Öneriliyor";

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Bütçe', data: budgetData, backgroundColor: '#0EA5E9', borderRadius: 4, barPercentage: 0.6 },
                { label: 'Yatırım Getirisi (ROI)', data: roiData, backgroundColor: '#10B981', borderRadius: 4, barPercentage: 0.6 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }, scales: { y: { beginAtZero: true, grid: { drawBorder: false } }, x: { grid: { display: false } } }, layout: { padding: { top: 10 } } }
    });
}

// --- 3. KAMPANYA ROI KARNESİ ---
async function fetchCampaign() {
    try {
        const res = await fetch('/api/karar3-kampanya');
        const data = await res.json();
        const container = document.getElementById('campaign-list-area');
        if(!container) return;
        container.innerHTML = '';
        
        let totalBudget = 0; let totalRevenue = 0;

        data.forEach(camp => {
            const budget = parseFloat(camp.pazarlama_butcesi);
            const uplift = parseFloat(camp.beklenen_artis_orani);
            let revenue = budget + (budget * (uplift / 100) * 4); 
            totalBudget += budget; totalRevenue += revenue;
            const roiVal = ((revenue - budget) / budget) * 100;
            const isProfitable = roiVal > 0;
            const maxVal = Math.max(budget, revenue) * 1.2;
            const budgetWidth = (budget / maxVal) * 100;
            const revenueWidth = (revenue / maxVal) * 100;

            const html = `
                <div class="campaign-item">
                    <div class="camp-header">
                        <span>${camp.kampanya_adi}</span>
                        <span class="camp-roi-badge ${isProfitable ? 'roi-plus' : 'roi-minus'}">
                            ${isProfitable ? '+' : ''}%${roiVal.toFixed(1)} ROI
                        </span>
                    </div>
                    <div class="bar-race-track">
                        <div class="race-row">
                            <span style="width:50px;">Bütçe</span>
                            <div class="race-bar-bg"><div class="race-fill fill-budget" style="width: ${budgetWidth}%"></div></div>
                            <span class="val-label">${(budget/1000).toFixed(1)}k</span>
                        </div>
                        <div class="race-row">
                            <span style="width:50px; color:#fff;">Ciro</span>
                            <div class="race-bar-bg"><div class="race-fill fill-revenue" style="width: ${revenueWidth}%"></div></div>
                            <span class="val-label" style="color:${isProfitable ? '#10B981' : '#F43F5E'}">${(revenue/1000).toFixed(1)}k</span>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += html;
        });

        const profitEl = document.getElementById('total-net-profit');
        const roasEl = document.getElementById('avg-roas');
        const avgRoas = totalRevenue > 0 ? (totalRevenue / totalBudget) : 0;
        
        if(profitEl) profitEl.innerText = `+₺${((totalRevenue - totalBudget)/1000000).toFixed(2)}M`;
        if(roasEl) roasEl.innerText = `${avgRoas.toFixed(1)}x ROAS`;

    } catch (e) { console.error(e); }
}

// --- 4. ÜRÜN KARŞILAŞTIRMA ---
async function fetchBCG() {
    try {
        const res = await fetch('/api/karar4-urunler');
        allProductsData = await res.json();
    } catch (e) { console.error("API Hatası", e); }
    
    const select1 = document.getElementById('product-select-1');
    const select2 = document.getElementById('product-select-2');
    
    if(select1 && select2 && allProductsData.length > 0) {
        select1.innerHTML = '<option value="" disabled selected>1. Ürünü Seç</option>';
        select2.innerHTML = '<option value="" disabled selected>2. Ürünü Seç (Opsiyonel)</option>';

        allProductsData.forEach((urun, index) => {
            const option1 = new Option(urun.urun_adi, index);
            const option2 = new Option(urun.urun_adi, index);
            select1.add(option1);
            select2.add(option2);
        });

        initComparisonChart();
        select1.addEventListener('change', updateComparisonChart);
        select2.addEventListener('change', updateComparisonChart);
        select1.value = 0; updateComparisonChart();
    }
}

function initComparisonChart() {
    const canvas = document.getElementById('comparisonChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    comparisonChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: ['Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'], datasets: [] },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, color: '#94a3b8' } } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }
        }
    });
}

function updateComparisonChart() {
    const idx1 = document.getElementById('product-select-1').value;
    const idx2 = document.getElementById('product-select-2').value;
    const datasets = [];
    let name1 = "", name2 = "";
    let totalSales1 = 0, totalSales2 = 0;

    if(idx1 !== "") {
        const p1 = allProductsData[idx1]; name1 = p1.urun_adi;
        const trendData = getProductTrend(p1.urun_adi);
        totalSales1 = trendData.reduce((a, b) => a + b, 0);
        datasets.push({ label: p1.urun_adi, data: trendData, borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 });
    }

    if(idx2 !== "") {
        const p2 = allProductsData[idx2]; name2 = p2.urun_adi;
        const trendData = getProductTrend(p2.urun_adi);
        totalSales2 = trendData.reduce((a, b) => a + b, 0);
        datasets.push({ label: p2.urun_adi, data: trendData, borderColor: '#F43F5E', backgroundColor: 'rgba(244, 63, 94, 0.1)', fill: true, tension: 0.4 });
    }

    const winnerEl = document.getElementById('comp-winner');
    const diffEl = document.getElementById('comp-diff');
    const label1 = document.getElementById('footer-label-1');
    const label2 = document.getElementById('footer-label-2');

    if(winnerEl && diffEl) {
        if (idx1 !== "" && idx2 !== "") {
            if(label1) label1.innerText = "Ürün"; 
            if(label2) label2.innerText = "Satış Durumu";
            let winnerName = (totalSales1 > totalSales2) ? name1 : name2;
            let diffPercent = (totalSales1 > totalSales2) ? ((totalSales1 - totalSales2) / totalSales2) * 100 : ((totalSales2 - totalSales1) / totalSales1) * 100;
            winnerEl.innerText = winnerName;
            diffEl.innerText = `%${diffPercent.toFixed(1)} Daha Fazla Satış`;
            diffEl.className = "text-green";
        } else if (idx1 !== "") {
            if(label1) label1.innerText = "Ürün";
            if(label2) label2.innerText = "6 Aylık Değişim";
            winnerEl.innerText = name1;
            const trend = datasets[0].data;
            const change = ((trend[5] - trend[0]) / trend[0]) * 100;
            diffEl.innerText = `%${Math.abs(change).toFixed(1)} ${change > 0 ? 'Büyüme' : 'Küçülme'}`;
            diffEl.className = change > 0 ? "text-green" : "text-red";
        } else {
            if(label1) label1.innerText = "Durum"; if(label2) label2.innerText = "Analiz";
            winnerEl.innerText = "--"; diffEl.innerText = "--";
        }
    }

    if(comparisonChartInstance) {
        comparisonChartInstance.data.datasets = datasets;
        comparisonChartInstance.update();
    }
}

function getProductTrend(productName) {
    const name = productName.toLowerCase();
    if (name.includes('salisilik') || name.includes('bb krem')) return [850, 600, 350, 150, 50, 10]; 
    if (name.includes('akne')) return [0, 20, 80, 250, 600, 1100];
    if (name.includes('leke') || name.includes('yaşlanma')) return [550, 720, 610, 800, 680, 750];
    const base = 400; const data = [];
    for(let i=0; i<6; i++) {
        let val = base + (Math.random() * 200 - 100) + (i * 40); 
        if(val < 0) val = 0; data.push(Math.round(val));
    }
    return data;
}

// --- 5. KANAL SİMÜLASYONU ---
const channelData = {
    // Watsons mevcut olduğu için çıkarıldı
    'Gratis': { profit: 520000, marginDrop: 6, visibility: 25 },
    'Rossmann': { profit: 280000, marginDrop: 4, visibility: 10 },
    'Eve': { profit: 150000, marginDrop: 7, visibility: 5 },
    'Eczane': { profit: 320000, marginDrop: 2, visibility: 15 }
};

let currentProfit = 2850000;
let currentMargin = 60; 
let currentVisibility = 55; 
let activeChannels = new Set();

function toggleChannel(channelName, isChecked) {
    if (isChecked) activeChannels.add(channelName);
    else activeChannels.delete(channelName);
    recalculateSimulation();
}

function recalculateSimulation() {
    let newProfit = currentProfit;
    let newMargin = currentMargin;
    let newVisibility = currentVisibility;
    
    activeChannels.forEach(ch => {
        const data = channelData[ch];
        if (data) {
            newProfit += data.profit;
            newMargin -= data.marginDrop;
            newVisibility += data.visibility;
        }
    });

    if (newVisibility > 100) newVisibility = 100;

    const profitEl = document.getElementById('sim-total-profit');
    const adviceEl = document.getElementById('sim-advice');
    const adviceBox = document.querySelector('.sim-advice-bar');

    if(profitEl) {
        profitEl.innerText = `₺${(newProfit/1000000).toFixed(2)}M`;
        document.getElementById('sim-margin').innerText = `%${newMargin.toFixed(1)}`;
        document.getElementById('sim-visibility-bar').style.width = `${newVisibility}%`;
        document.getElementById('sim-visibility-text').innerText = `%${newVisibility}`;
        const deltaEl = document.getElementById('profit-delta');
        const diff = newProfit - currentProfit;
        const diffPercent = ((diff / currentProfit) * 100).toFixed(1);
        
        if(diff > 0) {
            deltaEl.innerText = `+₺${(diff/1000).toFixed(0)}k (+%${diffPercent})`;
            deltaEl.className = "sim-delta text-green";
        } else {
            deltaEl.innerText = "Değişim Yok";
            deltaEl.className = "sim-delta";
        }

        let advice = "";
        const count = activeChannels.size;
        
        if (adviceBox) adviceBox.classList.remove('warning');

        if (count === 0) {
            advice = "Mevcut durum (Watsons dahil) güçlü ve stabil. Yeni fırsatları değerlendirebilirsiniz.";
        } else if (count === 2) {
            advice = "🚀 Mükemmel İvme: Marka bilinirliği ve erişilebilirlik, kârlılığı bozmadan ideal oranda artıyor.";
        } else if (count === 3) {
            advice = "⚠️ Operasyonel Uyarı: Hızlı genişleme stokları zorluyor. Lojistik süreçlerini gözden geçirin.";
            if (adviceBox) adviceBox.classList.add('warning'); 
        } else if (count === 4) {
            advice = "🚨 Kritik Uyarı: Kontrolsüz büyüme! Kâr marjı eriyor ve stoklar yetersiz kalabilir. Acil optimizasyon şart.";
            if (adviceBox) adviceBox.classList.add('warning'); 
        } else {
            advice = "Yeni kanal entegrasyonu başarılı. Büyüme potansiyeli var.";
        }

        if (newMargin < 45) {
            advice = "🛑 KRİTİK: Kâr marjı %45'in altına düştü! Sürdürülebilirlik tehlikede.";
            if (adviceBox) adviceBox.classList.add('warning');
        }

        if (adviceEl) adviceEl.innerText = advice;
    }
}

// --- 6. FİYAT SİMÜLASYONU ---
function initSims() {
    recalculateSimulation(); 

    const canvas = document.getElementById('priceChart');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['80', '90', '95', '100', '105', '110', '120'], 
            datasets: [
                { 
                    label: 'Talep', 
                    data: [0,0,0,0,0,0,0], 
                    borderColor: '#0EA5E9', backgroundColor: 'rgba(14, 165, 233, 0.1)', tension: 0.4, yAxisID: 'y' 
                },
                { 
                    label: 'Kâr', 
                    data: [0,0,0,0,0,0,0], 
                    borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4, yAxisID: 'y1' 
                }
            ]
        },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            plugins: { legend: { display: false } }, 
            scales: { 
                y: { display: false, min: 0, max: 1000000 }, 
                y1: { display: false, min: 0, max: 100000 }, 
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } } 
            } 
        }
    });
    updatePriceSim(0);
}

window.updatePriceSim = function(val) {
    const percent = parseInt(val);
    const badgeEl = document.getElementById('price-badge');
    if(badgeEl) {
        badgeEl.innerText = `% ${percent > 0 ? '+' : ''}${percent}`;
        if(percent > 0) badgeEl.style.color = "#F59E0B"; 
        else if(percent < 0) badgeEl.style.color = "#10B981"; 
        else badgeEl.style.color = "#F43F5E"; 
    }

    const steps = [-20, -10, -5, 0, 5, 10, 20];
    let newDemandData = [];
    let newProfitData = [];
    
    const baseDemand = 9500; 
    const basePrice = 100;
    const unitCost = 60; 

    steps.forEach(step => {
        let effectivePercent = step + percent;
        let priceFactor = 1 + (effectivePercent / 100);
        let pointPrice = basePrice * priceFactor;

        let elasticity = 2.5; 
        if (effectivePercent < 0) elasticity = 3.0;

        let priceChangeRatio = (basePrice - pointPrice) / basePrice;
        let demandFactor = 1 + (priceChangeRatio * elasticity);
        if(demandFactor < 0) demandFactor = 0;

        let pointDemand = Math.floor(baseDemand * demandFactor);
        let unitMargin = pointPrice - unitCost;
        let pointProfit = Math.floor(pointDemand * unitMargin * 1.15); 

        newDemandData.push(pointDemand * 50); 
        newProfitData.push(pointProfit / 9);
    });

    let currentDemand = newDemandData[3] / 50;
    let currentProfit = newProfitData[3] * 9;

    const demEl = document.getElementById('pred-demand');
    const profEl = document.getElementById('pred-profit');
    
    if(demEl) demEl.innerText = Math.floor(currentDemand).toLocaleString();
    if(profEl) {
        profEl.innerText = `₺${Math.floor(currentProfit).toLocaleString()}`;
        if (percent > 0) {
            if (currentProfit >= 450000) profEl.style.color = "#10B981";
            else if (currentProfit > 350000) profEl.style.color = "#F59E0B";
            else profEl.style.color = "#F43F5E";
        } else {
            if (currentProfit >= 430000) profEl.style.color = "#10B981";
            else profEl.style.color = "#F43F5E";
        }
    }

    if (priceChart) {
        priceChart.data.datasets[0].data = newDemandData;
        priceChart.data.datasets[1].data = newProfitData;
        const maxDemand = Math.max(...newDemandData);
        const maxProfit = Math.max(...newProfitData);
        priceChart.options.scales.y.max = maxDemand * 1.2;
        priceChart.options.scales.y1.max = maxProfit * 1.2;
        priceChart.update();
    }
}

// --- 7. TRENDLER (VERİLER ÇEŞİTLENDİRİLDİ) ---
async function fetchTrends() {
    try {
        const trendData = [
            { icerik_adi: 'Niacinamide', trend_skoru: 95, status: 'Patlama', change: '+65.4%' },
            { icerik_adi: 'Retinol', trend_skoru: 88, status: 'Yükselişte', change: '+22.1%' },
            { icerik_adi: 'C Vitamini', trend_skoru: 75, status: 'Yükselişte', change: '+14.8%' },
            { icerik_adi: 'Hyaluronik Asit', trend_skoru: 90, status: 'Stabil', change: '+4.2%' },
            { icerik_adi: 'Arbutin', trend_skoru: 72, status: 'Yükselişte', change: '+31.5%' },
            { icerik_adi: 'Salisilik Asit', trend_skoru: 60, status: 'Durgun', change: '-1.5%' },
            { icerik_adi: 'Kolajen', trend_skoru: 52, status: 'Düşüşte', change: '-2.5%' },
            { icerik_adi: 'Peptit', trend_skoru: 40, status: 'Düşüşte', change: '-12.4%' }
        ];

        const container = document.getElementById('trend-container');
        if(!container) return;
        container.innerHTML = '';
        
        trendData.forEach(t => {
            let color = 'var(--accent-green)'; let icon = '↗';
            
            if (t.trend_skoru < 55) { color = 'var(--accent-pink)'; icon = '↘'; } 
            else if (t.trend_skoru < 65) { color = '#F59E0B'; icon = '—'; }
            if (t.change.includes('+65')) { color = '#a855f7'; icon = '🚀'; } // Patlama efekti

            const html = `
                <div class="trend-item" style="border-top: 3px solid ${color}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h4 style="font-size:0.9rem">${t.icerik_adi}</h4>
                        <span style="color:${color}; font-size:1.2rem;">${icon}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${t.trend_skoru}%; background-color:${color}"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-top: 10px;">
                        <span style="color:var(--text-muted);">${t.status}</span>
                        <span style="color:${color}; font-weight:600;">${t.change}</span>
                    </div>
                </div>`;
            container.innerHTML += html;
        });
    } catch (e) { console.error(e); }
}