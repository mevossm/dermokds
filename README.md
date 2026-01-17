# dermokds
Bu proje, Dermalyva adında orta ölçekli bir dermokozmetik markasının, veriye dayalı stratejik kararlar almasını sağlamak için geliştirdiğim bir web uygulamasıdır.

Yönetim Bilişim Sistemleri öğrencisi olarak, sadece kod yazmak değil, gerçek bir iş problemini (stok yönetimi, fiyatlandırma, kanal stratejisi vb.) dijital bir çözümle nasıl aşabileceğimi göstermek istedim.

Kullandıgım teknolojiler:

Backend (Arka Plan): Node.js & Express.js (Hızlı ve ölçeklenebilir sunucu yapısı için).

Veritabanı: MySQL (İlişkisel verileri tutmak için).

Frontend (Arayüz): EJS (Dinamik HTML için), CSS3 (Modern ve şık tasarım için), JavaScript (Simülasyonlar için).

Veri Görselleştirme: Chart.js (Grafikleri çizdirmek için).

Mimari: MVC (Model-View-Controller)

Karar Destek Modülleri (Dashboard)
Burada yöneticiler için 7 kritik karar noktası simüle ediliyor:

1- Bölge Stratejisi: Hangi şehir "Merkez Üs", hangisi "Riskli Bölge" harita üzerinde analiz ediliyor.

2- Bütçe Yönetimi: Yıllık bütçe ve ROI (Yatırım Getirisi) takibi.

3- Kampanya Analizi: Geçmiş kampanyaların başarı oranları.

4- Ürün Karşılaştırma: İki ürünü yan yana koyup hangisinin daha iyi sattığını görme imkanı.

5- Kanal Simülatörü: "Watsons'a girdik, peki Gratis'e de girersek kârımız ne olur?" sorusunun cevabı.

6- Fiyat Esnekliği: Fiyat çubuğunu kaydırarak talep ve kârın nasıl değiştiğini anlık görme (What-If analizi).

7- Trend Takibi: Hangi içerik (Niacinamide, Retinol vb.) yükselişte, hangisi düşüşte?


2. Admin Paneli & İş Kuralları (Back-End Logic)
Sadece veri göstermekle kalmadım, arka planda veri bütünlüğünü koruyan kurallar yazdım:

🛡️ Senaryo 1 (Fiyat Güvenliği): Yeni ürün eklerken fiyatı 0 veya eksi giremezsiniz. Stok adedi negatif olamaz. Sistem bunu sunucu tarafında engeller.

🔒 Senaryo 2 (Silme Koruması): Eğer bir ürünün geçmişte satışı varsa, o ürünü silemezsiniz. Bu sayede geçmiş raporların bozulmasını engelliyoruz.

Hazırlayan, Yönetim Bilişim Sistemleri 3. sınıf öğrencisi Meva Özen.
