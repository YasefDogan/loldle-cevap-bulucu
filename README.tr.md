# LoLdle Cevap Bulucu

[English](README.md) | **Türkçe**

[LoLdle](https://loldle.net)'da günün cevabını doğrudan sayfanın içinden okuyup gösteren küçük bir Chrome eklentisi.

## Özellikler

- Tüm modlarda günün şampiyonunu gösterir: Klasik, Alıntı, Yetenek, Emoji, Splash
- **Yetenek modu:** doğru tuşu (Pasif / Q / W / E / R) ve yeteneğin adını gösterir
- Bonus sorudaki doğru düğmeyi işaretler, tek tıkla cevaplayabilir
- Sayfada yüzen kutu varsayılan olarak gizlidir — tıklayınca cevap açılır/kapanır (yanlışlıkla spoiler yemezsin)
- Araç çubuğundaki simgeden hızlı bakış için açılır pencere
- **Otomatik dil:** sistem/tarayıcı dilin Türkçe ise arayüz Türkçe, değilse İngilizce olur

## Kurulum

1. Bu repoyu indir (**Code → Download ZIP**) ve klasöre çıkar ya da klonla:
   ```bash
   git clone https://github.com/YasefDogan/loldle-cevap-bulucu.git
   ```
2. Chrome'da `chrome://extensions` adresini aç (Edge, Brave, Opera'da da çalışır).
3. Sağ üstten **Geliştirici modu**nu aç.
4. **Paketlenmemiş öğe yükle**'ye tıkla ve çıkardığın klasörü seç.

## Kullanım

1. [loldle.net](https://loldle.net)'e git ve bir mod seç.
2. Sayfanın sağ üst köşesindeki **👁 Günün cevabını göster** kutusuna tıkla
   ya da araç çubuğundaki eklenti simgesine tıkla.
3. Yetenek modunda şampiyonu bulduktan sonra **Bonusu cevapla** ile doğru tuşu seç.

## Nasıl çalışır?

LoLdle günün cevabını düz metin olarak göndermez, cevap **hashlenmiş/şifrelenmiş** gelir. Ama oyunun tahminlerini **tarayıcıda** kontrol edebilmesi için çözmeye gereken her şeyi de sayfaya koyar: anahtar ve çözme mantığı sayfanın HTML/JavaScript'inde durur. Tarayıcının çözebildiği bir şeyi kullanıcı da çözebilir.

Yani eklenti şifre kırmaz, sadece sayfanın zaten çözdüğü cevabı okur:

1. **Cevap sayfanın içinde.** Site yüklenince kendi kodundaki anahtarla şifreli cevabı çözer ve sonucu bellekte tutar.
2. **LoLdle bir Vue uygulaması.** Her Vue bileşeni kendine ait DOM elemanında bir referans tutar (`element.__vue__`).
3. **Ağacı gezme.** Eklenti sayfadaki ilk Vue bileşenini bulur, `$parent` ile en tepedeki köke çıkar, sonra `$children` üzerinden tüm bileşenleri tek tek gezer.
4. **Veriyi okuma.** Gezerken her bileşenin `$data`'sında şu alanları yakalar:
   - `todayAnswerDecrypted` → günün şampiyonu (site tarafından zaten çözülmüş)
   - `abilityLetter` → Yetenek modundaki doğru tuş (P/Q/W/E/R)
   - `abilityName` → yeteneğin adı
5. **Bonus soru.** `.letters-container .letter-picker` düğmeleri arasından doğru olanı bulur; işaretler ya da senin yerine tıklar.
6. Content script sayfanın kendi JavaScript ortamında çalışır (`"world": "MAIN"`); `__vue__`'ya erişebilmesinin sebebi bu. Site tek sayfa uygulaması olduğu için mod değiştirdikçe her saniye yeniden kontrol eder.

> Kısacası: **istemci tarafında "saklamak" güvenlik değildir.** Anahtar tarayıcıya gönderiliyorsa cevap okunabilir. Gerçek çözüm, tahminleri sunucuda kontrol etmek olurdu.

Hiçbir ağ isteği yapmaz, veri toplamaz — her şey kendi tarayıcı sekmende olur.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `manifest.json` | Eklenti tanımı (MV3) |
| `content.js` | loldle.net üzerindeki yüzen cevap kutusu |
| `popup.html` / `popup.js` | Araç çubuğu açılır penceresi |
| `_locales/` | Eklenti adı/açıklamasının Türkçe ve İngilizce hâlleri |

## Uyarı

Bu resmî olmayan bir hayran projesidir; LoLdle veya Riot Games ile bağlantısı yoktur. Eğlence amaçlıdır — kullanmak oyunun tadını kaçırır, dikkatli kullan. Site yapısını değiştirirse eklenti çalışmayı bırakabilir.
