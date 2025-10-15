# OĞLLM - Kendi Yapay Zeka Oğlunu Eğit

**OĞLLM**, bir baba ve oğul ilişkisi teması üzerine kurulmuş, kullanıcıların (baba rolünde) yapay zeka bir "oğulu" eğitebildiği, test edebildiği ve onunla sohbet edebildiği, tarayıcı tabanlı bir sohbet robotudur. Bu proje, basit metin eşleştirmesinin ötesine geçerek, **TensorFlow.js** ile güçlendirilmiş makine öğrenimi sayesinde, öğretilen cümlelerin sadece kelimelerini değil, **anlamını** da kavrar.

Tüm öğrettikleriniz, yani "oğlunuzun" tüm anıları, sadece sizin tarayıcınızın belleğinde güvenli bir şekilde saklanır.

![OĞLLM](https://i.hizliresim.com/n2mz04n.png)

## Oğlunun Yetenekleri

-   **Derin Anlama Kabiliyeti:** Oğlun, söylediğin cümlelerin sadece kelimelerini değil, asıl niyetini anlar. Ona "Günün nasıl geçti?" diye öğrettiğinde, "Bugün neler yaptın?" diye sorduğunda da seni anlayabilir.

-   **Hayatı Öğretme:** Ona hayatın farklı yönlerini öğretmek için çeşitli kategoriler kullanabilirsin:
    -   Soru-Cevap
    -   Diyalog Akışı
    -   Duygusal Tepki
    -   Fikir ve Görüş
    -   Mizah Yeteneği

-   **Görsel Hafıza:** Ona bir resmi gösterip ne olduğunu öğretebilirsin. Daha sonra aynı resmi yükleyerek, o anıyı hatırlayıp hatırlamadığını test edebilirsin.

-   **Güvenli Hafıza:** Tüm anılarınız ve öğrettiklerin sadece senin tarayıcında kalır. Bilgileriniz asla dışarıya gönderilmez, tamamen size özeldir.

-   **Modern Arayüz:** Minimalist, karanlık tema ve akıcı animasyonlarla zenginleştirilmiş, tüm cihazlarla (mobil, tablet, masaüstü) tam uyumlu bir arayüze sahiptir.

-   **Dinamik Etkileşim:** Cevaplarını kelime kelime düşünerek yazar ve bir görseli analiz ederken bunu sana adım adım gösterir.

## Kullanılan Teknolojiler

Bu proje, herhangi bir sunucu (backend) bağımlılığı olmadan, tamamen istemci tarafında çalışacak şekilde **HTML5**, **CSS3** ve **Vanilla JavaScript** ile geliştirilmiştir.

-   **Makine Öğrenimi:**
    -   **TensorFlow.js:** Tarayıcıda makine öğrenimi modellerini çalıştırmak için kullanılan ana kütüphane.
    -   **Universal Sentence Encoder (USE):** Cümleleri, anlamsal anlamlarını temsil eden matematiksel vektörlere (embedding) dönüştüren, önceden eğitilmiş dil modeli.
-   **Arayüz ve Tasarım:**
    -   Modern CSS (Flexbox, Grid, Custom Properties).
    -   Mobil cihazlar (özellikle iOS/Safari) için `viewport-fit=cover` ve `env(safe-area-inset-bottom)` ile tam uyumluluk.

## Oğlunun Beyni Nasıl Çalışır?

-   **1. Bir Şey Öğrettiğinde (Anlam Yaratma):** Ona öğrettiğin her cümle ("nasılsın?" gibi), Universal Sentence Encoder modeli tarafından anlamsal bir "parmak izine" dönüştürülür. Bu, o cümlenin beynindeki benzersiz matematiksel karşılığıdır ve cevabıyla birlikte hafızasına kaydedilir.

-   **2. Bir Soru Sorduğunda (Anlam Arama):** Sen bir soru sorduğunda ("keyfin nasıl?" gibi), oğlun önce bu yeni cümlenin de anlamsal parmak izini çıkarır.

-   **3. En Yakın Anıyı Bulma (Benzerlik Kurma):** Sonra bu yeni parmak izini, hafızasındaki tüm diğer parmak izleriyle karşılaştırır ve anlamsal olarak ona en çok benzeyeni bulur.

-   **4. Cevap Verme:** En yakın anıyı bulduğunda, o anıyla birlikte öğrendiği cevabı sana söyler. Bu sayede, kelimeler birebir aynı olmasa bile niyetini anlayarak doğru cevabı verebilir.

## Nasıl Başlanır?

1.  Bu repoyu bilgisayarınıza klonlayın veya dosyaları bir klasöre indirin.
2.  `index.html` dosyasına herhangi bir modern web tarayıcısı ile çift tıklayarak açın.
3.  Uygulama ilk açıldığında, dil modelinin internetten yüklenmesi birkaç saniye sürebilir. Arayüzdeki "Yapay zeka hazırlanıyor..." bildirimi kaybolduğunda, sohbete başlayabilirsiniz.
