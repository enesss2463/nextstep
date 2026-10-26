---
doc: checklist
status: approved
---
# Build Checklist

Build mode: fast. Kullanıcı planı ve hızlı akışı “hayır yok devam” yanıtıyla onayladı.

## Slices

- [ ] **1. Gerçek yapay zekâdan plan oluştur ve ilerle**
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
- [ ] Geri bildirim alındı ve gerekli düzeltmeler tamamlandı.

## Final Review
- [x] Kullanıcı geri bildirimi: teknik durum cümleleri, sloganlar ve gereksiz açıklamalar kaldırıldı.
- [x] Kullanıcı geri bildirimi: elektrik görünümü, şimşek simgesi ve ışıklı kenar/buton efektleri geliştirildi.
- [ ] Kullanıcı hazır olduğunu doğruladı; testler geçti.

## Code Tour and App Map
- [x] Gerçek görevden modele ve kayda giden akış app-map içinde açıklandı; kullanıcıyla canlı öğrenme etkinliği henüz yapılmadı.
- [ ] devpost/app-map.html oluşturuldu; kullanıcıya gösterimi bekliyor.

Mechanical verification: Six node:test checks passed. Live browser generation produced four real model steps totalling 25 minutes. Running timer continued after reload; completion survived reload; all-complete state and undo were checked. Mobile 390px width had no horizontal overflow. Visual changes after participant feedback were inspected in the browser.

## Revisions
- İlk canlı model çağrısında geçersiz veya tekrar eden içerik görüldü; şema sınırları daraltıldı, Türkçe yönerge ve biçim örneği eklendi. Çıktının tavsiye kalitesi hâlâ küçük yerel modelle sınırlı.
- İlk kullanıcı incelemesinde arayüzdeki fazla metin kaldırıldı ve elektrik teması güçlendirildi. Ana davranışlar aynı kaldı.
