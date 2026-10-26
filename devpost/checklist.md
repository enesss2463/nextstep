---
doc: checklist
status: approved
---
# Build Checklist

Build mode: fast. Kullanıcı planı ve hızlı akışı “hayır yok devam” yanıtıyla onayladı.

## Slices

- [x] **1. Gerçek yapay zekâdan plan oluştur ve ilerle**
  Becomes usable: Yerelde görev girilir, gerçek model adımları üretir, kullanıcı sayacı kullanır ve ilerleme kaydedilir.
  Why now: Küçük tek ekranlı ürünün çekirdeği ve model riski aynı uçtan uca akışta doğrulanır.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behavior`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`
  Build: Yerel sunucu, şemalı model çağrısı, neon arayüz, sayaç ve tarayıcı kaydı.
  Verify (mechanical): node --test test.mjs; canlı model isteği; tarayıcıda üretim, sayaç, tamamlanma, yenilemede kayıt; mobil görünüm.
  Learner check: Uygulamayı aç, kendi görevini yaz, bir adımda sayacı dene, tamamla ve sayfayı yenile.
  Commit: `Build local NextStep planning and focus flow`

## Hands-on Checkpoints
- [x] İlk çalışan sürüm kullanıcı tarafından incelendi; metin ve görünüm geri bildirimi alındı.
- [x] Geri bildirim alındı ve gerekli düzeltmeler tamamlandı.

## Final Review
- [x] Kullanıcı geri bildirimi: teknik durum cümleleri, sloganlar ve gereksiz açıklamalar kaldırıldı.
- [x] Kullanıcı geri bildirimi: elektrik görünümü, şimşek simgesi ve ışıklı kenar/buton efektleri geliştirildi.
- [x] Son temizlik ve hata düzeltmeleri otomatik ve tarayıcı kontrollerinden geçti; kullanıcı ek soru olmadan tamamlanmasını istedi.

Implemented and mechanically verified. The participant reviewed the first version and requested copy reduction and a stronger electric theme; both were implemented. A later review found unused CSS and lost keyboard focus; these were fixed at the participant's request. The participant delegated the remaining cleanup and checks without further questions. The required demo video remains deferred, and the Devpost entry remains a draft.

## Code Tour and App Map
- [x] Gerçek görevden modele ve kayda giden akış app-map içinde açıklandı; kullanıcıyla canlı öğrenme etkinliği henüz yapılmadı.
- [ ] devpost/app-map.html oluşturuldu; kullanıcıya gösterimi bekliyor.

Mechanical verification: Nine node:test checks passed. Real Ollama generation returned a valid plan totalling 25 minutes. Browser assertions verified keyboard focus after step completion, step selection and history selection; timer start/pause/reset/reload; completion persistence; invalid-response recovery; offline-status recovery; and HTML-like model output displayed safely as text. Before/after computed styles and dimensions matched for 28 elements at desktop and 390px widths. Layouts at 320, 390, 760, 1000 and 1536px had no horizontal overflow. The production app was restarted with the latest code, and existing browser records loaded successfully.

## Revisions
- İlk canlı model çağrısında geçersiz veya tekrar eden içerik görüldü; şema sınırları daraltıldı, Türkçe yönerge ve biçim örneği eklendi. Çıktının tavsiye kalitesi hâlâ küçük yerel modelle sınırlı.
- İlk kullanıcı incelemesinde arayüzdeki fazla metin kaldırıldı ve elektrik teması güçlendirildi. Ana davranışlar aynı kaldı.
- Kullanılmayan CSS ve eski tema tekrarları kaldırıldı; stil dosyası 19.055 bayttan 14.658 bayta indi. Görünüm karşılaştırması eşleşti.
- Yeniden çizim sonrası klavye odağı kararlı düğme kimlikleriyle geri verildi. Yeni plan doğrulaması model şemasıyla eşitlendi; altı adımlı eski kayıtlar için okuma uyumluluğu korundu.
- Güncelliğini yitiren başvuru taslağı kaldırıldı. Asıl Devpost taslağı ve GitHub belgeleri güncel kodla eşitlendi. Devpost teknoloji yanıtı 255 karakter sınırına uymadığı için kaydedilemiyordu; 230 karaktere indirildi ve yeniden açılan formda kalıcı olduğu doğrulandı. Video ve son başvuru beyanları tamamlanmadı.
