# OĞLLM: Tarayıcı Tabanlı, Anlamsal Anlama Yeteneğine Sahip Eğitilebilir Sohbet Robotu

OĞLLM, kullanıcıların hem metin hem de görsel verilerle eğitebildiği ve test edebildiği, modern bir arayüze sahip, tarayıcı tabanlı bir yapay zeka sohbet robotudur. Bu proje, anahtar kelime eşleştirmesinin ötesine geçerek, **TensorFlow.js** ve **Universal Sentence Encoder (USE)** dil modeli sayesinde cümleler arası anlamsal benzerliği analiz eder.

Tüm eğitim verileri kullanıcının tarayıcısındaki `localStorage` üzerinde saklanır, bu da tam bir gizlilik ve veri kontrolü sağlar.

## Temel Özellikler

-   **Anlamsal Analiz ve Arama:** Sistem, cümlelerin sadece kelimelerini değil, anlamsal içeriğini de anlar. TensorFlow.js ve USE modeli sayesinde, "Hava nasıl?" ve "Bugünkü hava durumu hakkında bilgi verir misin?" gibi farklı cümlelerin anlamsal olarak benzer olduğunu tespit edebilir.

-   **Çok Yönlü Eğitim Modülleri:** Model, farklı diyalog türleri için özelleştirilmiş kategoriler aracılığıyla eğitilebilir:
    -   Soru-Cevap
    -   Diyalog Akışı
    -   Duygusal Tepki
    -   Fikir ve Görüş
    -   Mizah Yeteneği

-   **Görsel Tanıma ve Sorgulama:** Modelin hafızasına bir anahtar kelime ile bir görsel eşleştirilerek "Görsel Tanıma" yeteneği eklenebilir. Kullanıcılar daha sonra bu görseli yükleyerek modelin görseli tanıyıp tanımadığını test edebilir.

-   **İstemci Taraflı Veri Saklama:** Tüm metin ve görsel eğitim verileri, yalnızca kullanıcının yerel tarayıcı deposunda (`localStorage`) saklanır. Herhangi bir sunucuya veri gönderimi yapılmaz, bu da tam gizlilik sağlar.

-   **Dinamik ve Duyarlı Arayüz:** Arayüz, modern CSS teknikleri kullanılarak tamamen duyarlı (responsive) bir şekilde tasarlanmıştır. Akıcı animasyonlar, kelime kelime cevap oluşturma (streaming response) ve görsel analiz animasyonları gibi özelliklerle kullanıcı deneyimi zenginleştirilmiştir.

## Teknik Altyapı

Bu proje, herhangi bir sunucu (backend) bağımlılığı olmadan, tamamen istemci tarafında çalışacak şekilde geliştirilmiştir.

-   **Frontend:** HTML5, CSS3 (Flexbox, Grid, Custom Properties), Vanilla JavaScript
-   **Makine Öğrenimi (İstemci Tarafı):**
    -   **TensorFlow.js:** Tarayıcıda makine öğrenimi modellerini çalıştırmak ve tensör operasyonları yapmak için kullanılır.
    -   **Universal Sentence Encoder (USE):** Metin verilerini, anlamsal anlamlarını temsil eden 512 boyutlu sayısal vektörlere (embedding) dönüştüren, önceden eğitilmiş bir dil modelidir.
-   **Depolama:** `localStorage` API

## Çalışma Prensibi

1.  **Eğitim (Veri Vektörleştirme):** "Modeli Geliştir" modülü üzerinden bir metin verisi eklendiğinde, Universal Sentence Encoder (USE) bu cümlenin anlamını analiz eder ve onu 512 boyutlu bir anlamsal vektöre dönüştürür. Bu vektör, cümlenin matematiksel bir temsilidir ve ilişkili cevapla birlikte `localStorage`'da saklanır.

2.  **Sorgulama (Anlamsal Karşılaştırma):** Kullanıcı sohbet alanına bir cümle girdiğinde, bu cümlenin de anlamsal vektörü oluşturulur.

3.  **Benzerlik Skoru (Kosinüs Benzerliği):** Sistem, kullanıcının girdiği cümlenin vektörü ile hafızadaki tüm diğer cümle vektörleri arasındaki anlamsal yakınlığı ölçer. Bu ölçüm, iki vektör arasındaki açıyı temel alan **Kosinüs Benzerliği** (Cosine Similarity) algoritması ile yapılır.

4.  **Sonuç Döndürme:** En yüksek benzerlik skoruna sahip olan vektör tespit edilir ve o vektörle ilişkilendirilmiş olan cevap kullanıcıya gösterilir. Bu yöntem, uygulamanın kelime eşleşmesinin ötesinde, cümlenin "niyetini" anlamasına olanak tanır.

## Kurulum ve Çalıştırma

1.  Bu repoyu bilgisayarınıza klonlayın veya dosyaları bir klasöre indirin.
2.  `index.html` dosyasına herhangi bir modern web tarayıcısı (Chrome, Firefox, Edge vb.) ile çift tıklayarak açın.
3.  Uygulama ilk açıldığında, Universal Sentence Encoder modelinin internetten yüklenmesi birkaç saniye sürebilir. Arayüzdeki "Yapay zeka hazırlanıyor..." bildirimi kaybolduğunda, sistem kullanıma hazırdır.
