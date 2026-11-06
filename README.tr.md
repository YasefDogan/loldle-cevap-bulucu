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

LoLdle bir Vue uygulamasıdır. Eklenti sayfadaki Vue bileşen ağacını gezip zaten çözülmüş olan cevabı (`todayAnswerDecrypted`) ve yetenek bilgisini (`abilityLetter`, `abilityName`) okur. Hiçbir ağ isteği yapmaz, veri toplamaz.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `manifest.json` | Eklenti tanımı (MV3) |
| `content.js` | loldle.net üzerindeki yüzen cevap kutusu |
| `popup.html` / `popup.js` | Araç çubuğu açılır penceresi |
| `_locales/` | Eklenti adı/açıklamasının Türkçe ve İngilizce hâlleri |

## Uyarı

Bu resmî olmayan bir hayran projesidir; LoLdle veya Riot Games ile bağlantısı yoktur. Eğlence amaçlıdır — kullanmak oyunun tadını kaçırır, dikkatli kullan. Site yapısını değiştirirse eklenti çalışmayı bırakabilir.
