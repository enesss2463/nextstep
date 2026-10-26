---
doc: prd
status: approved
---
# NextStep — Product Requirements

Yerelde çalışan, büyük görevlerden başlanabilir küçük adımlar çıkaran odak uygulaması. Kaynak: `scope.md > The Core Loop`.

## The Core Journey
1. Görevini ve ayırabileceğin süreyi gir.
2. Yapay zekâ göreve özel, süre bütçesine sığan küçük adımlar oluştursun.
3. Bir adım seç, odak sayacını başlat veya duraklat.
4. Tamamladığın adımı işaretle; ilerleme oranını gör.
5. Sayfayı yenileyince veya yeniden açınca planına kaldığın yerden dön.

## Screens and Layout
Tek ana ekran. Üstte NextStep ve yerel model durumu; solda görev ve süre girişi; sağda plan ve odak sayacı. Mobilde alanlar alt alta. Kaydedilmiş görevler aynı ekranda seçilebilir.

## Look and Feel
Kullanıcı elektrikli görünüm ve butonlar istedi; ilk incelemede daha belirgin bir elektrik teması talep etti. Koyu lacivert zemin, ince ızgara, mavi-mor ışıklı kenarlar, gerçek bir şimşek simgesi ve butonda ışık geçişi kullanılır. Teknik durum, sloganlar ve gereksiz açıklamalar normal akıştan kaldırılır. Yalnızca işlevsel etiketler, kayıt bilgisi ve gerektiğinde bağlantı hatası görünür. Hareket azaltma tercihi korunur; yanıp sönen efekt kullanılmaz. Arayüz Türkçe, Devpost tanıtımı İngilizce.

## Features and Behavior
### Generate a Plan
5–120 dakika ve 5–500 karakterlik görev kabul edilir. Gerçek modelden 3–6 somut adım istenir; her adımda başlık, kısa yönlendirme ve dakika bulunur. Toplam süre bütçeyi aşmaz. Hazırlanırken buton devre dışıdır ve durum görünür. Örnek görev butonları yalnızca formu doldurur; sahte sonuç göstermez.

### Focus and Completion
Bir defada bir adımın sayacı çalışır. Başlat, duraklat ve sıfırla işlemleri vardır. Sürenin dolması adımı kendiliğinden tamamlamaz; kullanıcı tamamlandığını işaretler. Biten adımlar geri alınabilir. Tüm adımlar bittiğinde tamamlandı durumu görünür.

### Saved Progress
Planlar ve tamamlanan adımlar aynı tarayıcıda saklanır. Aktif sayaç sayfa yenilense de gerçek geçen süreyi dikkate alır. Yeni plan başarısızsa mevcut plan korunur. Kaydedilmiş plan seçilirken çalışan sayaç duraklatılır.

## States and Boundaries
- İlk açılış: boş plan alanında açıklama ve örnek görevler.
- Model kapalı veya ulaşılamıyor: açık hata ve yeniden deneme; kullanıcı girdisi korunur.
- Geçersiz model çıktısı: hata; sahte planla değiştirme yok.
- Depolama engelli: kaydedilemedi uyarısı; mevcut ekrandaki plan çalışmaya devam eder.
- Model çıktısı düz metin olarak gösterilir; HTML çalıştırılmaz.

## Product Decisions
Kullanıcı: NextStep, gerçek yapay zekâ, yerel çalışma, elektrik teması.
Önerilen uygulama ayrıntıları: tek ekran, 5–120 dakika, tarayıcıda saklama, 3–6 adım.

## What We're Building
Görev → gerçek model → küçük adımlar → sayaç → tamamlanma → kalıcı ilerleme.

## Deferred From the POC
Hesaplar, cihazlar arası eşitleme, takvim bağlantısı ve bildirimler ana akışı kanıtlamak için gerekli değil.

## Open Questions
Kullanıcı plan incelemesine “hayır yok devam” yanıtıyla onay verdi. Model performansı canlı çağrıyla doğrulanacak.
