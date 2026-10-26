---
doc: spec
status: approved
---
# NextStep — Technical Spec

## How This Works, In Plain Language
Tarayıcıdaki form görevini bilgisayarda çalışan küçük bir Node.js sunucusuna gönderir. Sunucu, bilgisayarda kurulu Ollama üzerinden llama3.2 modelinden adımlar ister. Dönen plan kontrol edilir ve ekranda gösterilir. Tamamlanan adımlar tarayıcının kendi kayıt alanında tutulur. API anahtarı veya bulut hesabı gerekmez.

## The Core Journey Through the System
Form → POST /api/plan → Ollama /api/chat → doğrulanan JSON plan → ekranda adımlar → localStorage kaydı. Kaynak: `prd.md > The Core Journey`.

## Stack
- Node.js yerleşik HTTP ve fetch: yeni bağımlılık gerektirmeyen yerel sunucu. https://nodejs.org/api/http.html
- HTML, CSS, JavaScript: tek ekran ve etkileşimler; derleme adımı yok.
- Ollama ve llama3.2: bilgisayarda kurulu. https://docs.ollama.com/api/chat
- Tarayıcı localStorage: aynı tarayıcıda ilerleme. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## Where It Runs and How Someone Tries It
Node.js 22+ ve yerel Ollama gerekir. `ollama serve` ile modeli sun; `npm start` ile uygulamayı aç. Adres: http://127.0.0.1:4173. Sunucu yalnızca loopback dinler. Model yoksa `ollama pull llama3.2` gerekir; bu makinede model manifesti mevcut. Uygulama yerel kalacak. Yarışma için public depo ve demo video ayrıca hazırlanmalı.

## Look and Feel
`prd.md > Look and Feel` uygulanır: lacivert, mavi ve mor neon; CSS ile ışıklı kenarlar, ince ızgara ve butonda ışık geçişi. Şimşek yerel SVG'dir. Slogan ve teknik durum metinleri normal akıştan çıkarılır; bağlantı durumu yalnızca hata halinde gösterilir. Dış font veya resim isteği gerekmiyor. Klavye odağı, yeterli kontrast, hareket azaltma ve mobil düzen korunur.

## Components
### Local Server
Sadece izin verilen statik dosyaları sunar. İstek boyutunu, görev uzunluğunu, dakika sınırını ve origin/host değerlerini kontrol eder. Model çağrısı zaman aşımına sahiptir. Aynı anda tek üretim isteği kabul eder. Implements `prd.md > Generate a Plan`.

### Plan Validation
Model çıktısının JSON yapısı, adım sayısı ve metinleri doğrulanır. Modelin süre ağırlıkları pozitif tam sayıya çevrilerek toplam bütçeye ölçeklenir; her adıma en az bir dakika ayrılır. Geçersiz çıktı açık hata üretir. Implements `prd.md > Generate a Plan`.

### Browser App
DOM'a metin güvenli biçimde yazılır. Kullanıcının görevleri, adımların tamamlanması ve sayaç durumu saklanır. Sayaç kalan zamanı bir bitiş zamanından hesaplar; sekme yavaşlatmasından kaynaklı kayma birikmez. Implements `prd.md > Focus and Completion`, `prd.md > Saved Progress`.

## Data Model
localStorage `nextstep.v1`: sürüm, planlar, seçili plan ID'si ve sayaç. Plan: id, task, minutes, createdAt, model, steps. Adım: title, detail, minutes, done. Sayaç: planId, stepIndex, remainingMs, endsAt veya null. Yüklenen kayıtlar doğrulanır; bozuk kayıt sessizce silinmez, hata gösterilir.

## File Structure
```
nextstep/
  public/index.html    # Tek ekran
  public/style.css     # Elektrik teması
  public/app.js        # Form, plan, sayaç ve kayıt
  public/core.js       # Saf doğrulama/zaman yardımcıları
  server.mjs           # Yerel HTTP sunucu ve model bağlantısı
  plan.mjs             # Model çıktısı doğrulama ve süre dağılımı
  test.mjs             # Node assert / test ile sınır kontrolleri
  package.json         # start ve test komutları
  README.md            # Çalıştırma ve demo yönergesi
  LICENSE              # MIT lisans
  devpost/             # Yarışma plan belgeleri
```

## External Services and Dependencies
Yerel `http://127.0.0.1:11434/api/chat`: model, messages, stream:false ve JSON şemalı format; yanıt message.content JSON metni. https://docs.ollama.com/capabilities/structured-outputs
GET /api/tags model durumunu okumak için kullanılır. Üçüncü tarafa görev gönderilmez. Ek npm paketi yok.

## Important Failure Modes
Ollama kapalı, çağrı yavaş veya JSON geçersiz → açıklayıcı hata, form ve önceki plan korunur. Kayıt alanı dolu/kapalı → kaydetme uyarısı. Eksik model → model kurulumu açıklaması.

## Decisions and Open Issues
Kullanıcı gerçek yapay zekâ ve yerel çalışmayı seçti. Ollama/llama3.2, Node.js ve tarayıcı kaydı içeren plan incelemesine “hayır yok devam” yanıtıyla onay verdi. Modelin cevap kalitesi ve ilk yükleme süresi erken canlı testle ölçülecek. Kullanıcıya ait özel bir öğrenme belirsizliği belirtilmedi.
