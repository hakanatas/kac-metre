/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 6. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Ali 7 karış, Ayşe 9 karış: aynı masa!', en: 'Ali says 7 spans, Ayşe says 9: the same desk!',
      note: 'Ali masayı karışıyla ölçüyor: 7 karış. Ayşe de ölçüyor: 9 karış. Masa aynı ama sonuçlar farklı, çünkü herkesin karışı farklı.' },
    { scene: 2, start: 10.6, end: 16.0, tr: 'Herkes aynı ölçüyü kullansın: metre', en: 'Let everyone use the same unit: the metre',
      note: 'Herkesin aynı sonucu bulması için standart bir ölçü birimi gerekir. Uzunlukta ölçüt birim metredir.' },
    { scene: 2, start: 16.2, end: 21.8, tr: '1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm', en: '1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm',
      note: 'Metrenin büyükleri ve küçükleri var: kilometre, hektometre, dekametre; desimetre, santimetre, milimetre. 1 kilometre 1000 metre, 1 metre 100 santimetre, 1 santimetre 10 milimetre.' },
    { scene: 2, start: 22.0, end: 27.8, tr: 'Her basamak sağındakinin 10 katı', en: 'Each step is 10 times the next one',
      note: 'Birimler 10’ar 10’ar değişir. Küçük birime geçerken 10 ile çarparız, büyük birime geçerken 10’a böleriz.' },
    { scene: 3, start: 28.6, end: 38.8, tr: 'Masa: 1 m + 20 cm = 120 cm = 1,2 m', en: 'The desk: 1 m + 20 cm = 120 cm = 1.2 m',
      note: 'Masayı metre cetveliyle ölçelim: bir metre, artı 20 santimetre. Yani 120 santimetre ya da 1,2 metre.' },
    { scene: 3, start: 39.0, end: 45.8, tr: 'Kalem: 14 cm = 140 mm = 0,14 m', en: 'The pencil: 14 cm = 140 mm = 0.14 m',
      note: 'Kalemi milimetrik cetvelle ölçelim: 14 santimetre. Bu 140 milimetre, ya da 0,14 metre eder.' },
    { scene: 4, start: 46.6, end: 51.8, tr: '1,5 m mi uzun, 145 cm mi?', en: 'Which is longer: 1.5 m or 145 cm?',
      note: 'İki kurdele var: biri 1,5 metre, öteki 145 santimetre. Hangisi daha uzun? 145 büyük görünüyor ama birimler farklı!' },
    { scene: 4, start: 52.0, end: 57.8, tr: '1,5 m = 150 cm: 5 cm daha uzun', en: '1.5 m = 150 cm: 5 cm longer',
      note: 'Aynı birime çevirelim: 1,5 metre 150 santimetre eder. 150 santimetre, 145 santimetreden 5 santimetre uzun.' },
    { scene: 4, start: 58.0, end: 65.8, tr: '1,2 km = 1200 m: okul 250 m daha uzak', en: '1.2 km = 1200 m: the school is 250 m farther',
      note: 'Okul 1,2 kilometre, park 950 metre uzakta. 1,2 kilometre 1200 metre eder; okul 250 metre daha uzak.' },
    { scene: 5, start: 66.6, end: 73.8, tr: 'Kalem için cm, yol için km', en: 'cm for a pencil, km for a road',
      note: 'Hangi birimi seçeceğimize de karar vermeliyiz. Kalemin boyunu kilometreyle, iki şehir arasını santimetreyle söylemeyiz.' },
    { scene: 5, start: 74.0, end: 79.8, tr: 'Uygun birim sayıyı kolay okunur yapar', en: 'The right unit makes the number easy to read',
      note: 'Uygun birim, sayıyı kolay okunur ve karşılaştırılabilir yapar.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Metre ölçüt; karşılaştırmadan önce aynı birim', en: 'The metre is the reference; same unit before comparing',
      note: 'Aklında kalsın: uzunlukta ölçüt birim metredir. Birimler 10’ar 10’ar değişir. Karşılaştırmadan önce aynı birime çevir ve duruma uygun birimi seç.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Artık her şeyi ölçebilirsin!', en: 'Now you can measure anything!',
      note: 'Artık her uzunluğu doğru birimle ölçebilir ve karşılaştırabilirsin!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
