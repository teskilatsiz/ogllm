document.addEventListener('DOMContentLoaded', () => {
    const egitimAcButonu = document.getElementById('egitim-ac-butonu');
    const egitimModali = document.getElementById('egitim-modali');
    const egitimKapatButonu = document.getElementById('egitim-kapat-butonu');
    const onayModali = document.getElementById('onay-modali');
    const modalKapatButonu = document.getElementById('modal-kapat-butonu');
    const egitimPaneli = document.getElementById('egitim-paneli');
    
    const mesajKutusu = document.getElementById('mesaj-kutusu');
    const mesajGirisi = document.getElementById('mesaj-girisi');
    const gonderButonu = document.getElementById('gonder-butonu');
    const kategoriSeciciTetikleyici = document.getElementById('kategori-secici-tetikleyici');
    const kategoriMenu = document.getElementById('kategori-menu');
    const aktifKategoriAdi = document.getElementById('aktif-kategori-adi');
    const kategoriAciklamasi = document.getElementById('kategori-aciklamasi');
    const soruGirisi = document.getElementById('soru-girisi');
    const cevapGirisi = document.getElementById('cevap-girisi');
    const egitButonu = document.getElementById('egit-butonu');
    const modalBasligi = document.getElementById('modal-basligi');
    const modalMesaji = document.getElementById('modal-mesaji');
    
    const gorselYukleInput = document.getElementById('gorsel-yukle-input');
    const gorselOnizlemeKutusu = document.getElementById('gorsel-onizleme-kutusu');
    const gorselOnizleme = document.getElementById('gorsel-onizleme');
    const gorselAnahtarKelime = document.getElementById('gorsel-anahtar-kelime');
    const gorselSorgulaButonu = document.getElementById('gorsel-sorgula-butonu');
    const gorselSorguInput = document.getElementById('gorsel-sorgu-input');
    let yuklenenGorselDataURL = null;
    let hafiza = {};

    const kategoriVerileri = {
        'soru-cevap': { ad: "Soru-Cevap", tip: 'metin', aciklama: "Ona sorulan spesifik bir soruya nasıl cevap vereceğini öğret.", soruPlaceholder: "Örnek: 'En sevdiğin renk ne?'", cevapPlaceholder: "Örnek: 'Ben turuncu tonlarını severim.'", modalBaslik: "Yeni Bilgi Edinildi!", modalMesaj: "Artık bu soruya nasıl cevap vereceğini biliyor." },
        'gorsel-hafiza': { ad: "Görsel Hafıza", tip: 'gorsel', aciklama: "Bir anahtar kelime ile bir görseli hafızasına kaydet.", modalBaslik: "Yeni Bir Şey Gördü!", modalMesaj: "Bu görseli artık hatırlayacak." },
        'diyalog': { ad: "Diyalog Akışı", tip: 'metin', aciklama: "Günlük konuşmalardaki ifadelere nasıl karşılık vereceğini öğret.", soruPlaceholder: "Örnek: 'Bugün hava çok güzel.'", cevapPlaceholder: "Örnek: 'Evet, tam yürüyüş havası baba.'", modalBaslik: "Sosyalleşiyor!", modalMesaj: "Bu diyaloğu hafızasına ekledi." }
    };
    let aktifKategori = null;

    function hafizayiKaydet() {
        try { localStorage.setItem('ogllmHafiza', JSON.stringify(hafiza)); }
        catch (e) { console.error("Hafıza kaydedilemedi, localStorage dolu olabilir.", e); }
    }

    function hafizayiYukle() {
        const kayitliHafiza = localStorage.getItem('ogllmHafiza');
        hafiza = kayitliHafiza ? JSON.parse(kayitliHafiza) : { "merhaba": "Merhaba baba!", "nasılsın": "İyiyim babacığım, sen nasılsın?" };
    }

    egitimAcButonu.addEventListener('click', () => egitimModali.classList.add('aktif'));
    egitimKapatButonu.addEventListener('click', () => egitimModali.classList.remove('aktif'));
    egitimModali.addEventListener('click', (event) => { if (event.target === egitimModali) egitimModali.classList.remove('aktif'); });

    function calculateSimilarity(strA, strB) { const clean = (s) => s.toLowerCase().replace(/[^\w\s]/g, ''); const setA = new Set(clean(strA).split(/\s+/)); const setB = new Set(clean(strB).split(/\s+/)); const intersection = new Set([...setA].filter(x => setB.has(x))); const union = new Set([...setA, ...setB]); return intersection.size / union.size; }
    function findBestMatch(userInput) { let bestScore = 0; let bestMatch = null; const BENZERLIK_ESIGI = 0.4; for (const q in hafiza) { if(typeof hafiza[q] === 'string' && !hafiza[q].startsWith('data:image')) { const score = calculateSimilarity(userInput, q); if (score > bestScore) { bestScore = score; bestMatch = hafiza[q]; } } } return bestScore >= BENZERLIK_ESIGI ? bestMatch : null; }
    
    function oglununCevabiniAl(babaninMesaji) {
        const temizMesaj = babaninMesaji.toLowerCase().trim();
        if (hafiza[temizMesaj]) return hafiza[temizMesaj];
        return findBestMatch(temizMesaj) || "Bunu bana henüz öğretmedin baba. Yukarıdaki butondan yardım alabilirsin.";
    }

    function streamResponse(responseText) {
        const mesajElementi = document.createElement('div');
        mesajElementi.classList.add('mesaj', 'yapay-zeka', 'streaming');
        mesajKutusu.appendChild(mesajElementi);
        mesajKutusu.scrollTop = mesajKutusu.scrollHeight;
        const kelimeler = responseText.split(' ');
        let kelimeIndex = 0;
        const interval = setInterval(() => {
            if (kelimeIndex < kelimeler.length) {
                const kelimeSpan = document.createElement('span');
                kelimeSpan.className = 'kelime';
                kelimeSpan.textContent = kelimeler[kelimeIndex];
                mesajElementi.appendChild(kelimeSpan);
                mesajKutusu.scrollTop = mesajKutusu.scrollHeight;
                kelimeIndex++;
            } else {
                clearInterval(interval);
                mesajElementi.classList.remove('streaming');
            }
        }, 120);
    }
    
    function mesajEkle(mesaj, kimden, gorselUrl = null) {
        const mesajElementi = document.createElement('div');
        mesajElementi.classList.add('mesaj', kimden);
        let islemeEkrani = null;

        if (gorselUrl) {
            const kapsayici = document.createElement('div');
            kapsayici.className = 'gorsel-kapsayici';
            
            const resim = document.createElement('img');
            resim.src = gorselUrl;
            
            islemeEkrani = document.createElement('div');
            islemeEkrani.className = 'gorsel-isleme-ekrani';
            islemeEkrani.innerHTML = `<div class="tarama-cizgisi"></div><span id="isleme-durum-metni"></span>`;

            kapsayici.append(resim, islemeEkrani);
            mesajElementi.appendChild(kapsayici);
        }
        if (mesaj) {
            const metinSpan = document.createElement('span');
            metinSpan.textContent = mesaj;
            mesajElementi.appendChild(metinSpan);
        }
        
        mesajKutusu.appendChild(mesajElementi);
        mesajKutusu.scrollTop = mesajKutusu.scrollHeight;
        return islemeEkrani;
    }

    function mesajGonder() {
        const mesajMetni = mesajGirisi.value.trim();
        if (mesajMetni === '') return;
        mesajEkle(mesajMetni, 'kullanici');
        mesajGirisi.value = '';
        gonderButonu.classList.remove('aktif');
        setTimeout(() => { 
            const cevap = oglununCevabiniAl(mesajMetni);
            if(cevap && cevap.startsWith('data:image')) {
                mesajEkle(null, 'yapay-zeka', cevap);
            } else {
                streamResponse(cevap);
            }
        }, 800);
    }
    
    mesajGirisi.addEventListener('input', () => {
        gonderButonu.classList.toggle('aktif', mesajGirisi.value.trim() !== '');
    });

    function kategoriMenuDoldur() { kategoriMenu.innerHTML = ''; for (const [id, veri] of Object.entries(kategoriVerileri)) { const button = document.createElement('button'); button.dataset.kategori = id; button.textContent = veri.ad; kategoriMenu.appendChild(button); } }
    
    function kategoriArayuzunuGuncelle(kategoriId) { 
        if (!kategoriVerileri[kategoriId]) return; 
        aktifKategori = kategoriId; 
        const veri = kategoriVerileri[kategoriId];
        aktifKategoriAdi.textContent = veri.ad;
        kategoriAciklamasi.textContent = veri.aciklama;
        egitimPaneli.classList.toggle('gorsel-modu', veri.tip === 'gorsel');
        if (veri.tip !== 'gorsel') {
            soruGirisi.placeholder = veri.soruPlaceholder;
            cevapGirisi.placeholder = veri.cevapPlaceholder;
        }
    }

    function modalGoster(baslik, mesaj) { modalBasligi.textContent = baslik; modalMesaji.textContent = mesaj; onayModali.classList.add('aktif'); }
    
    function oglunaOgret() {
        if (!aktifKategori) { return; }
        const aktifKategoriVerisi = kategoriVerileri[aktifKategori];
        
        if (aktifKategoriVerisi.tip === 'gorsel') {
            const anahtarKelime = gorselAnahtarKelime.value.trim().toLowerCase();
            if(!anahtarKelime || !yuklenenGorselDataURL) { alert("Lütfen hem anahtar kelimeyi girin hem de bir görsel yükleyin."); return; }
            hafiza[anahtarKelime] = yuklenenGorselDataURL;
        } else {
            const soru = soruGirisi.value.trim().toLowerCase();
            const cevap = cevapGirisi.value.trim();
            if (!soru || !cevap) { alert("Lütfen her iki alanı da doldur."); return; }
            hafiza[soru] = cevap;
        }
        hafizayiKaydet();
        egitimModali.classList.remove('aktif');
        setTimeout(() => modalGoster(aktifKategoriVerisi.modalBaslik, aktifKategoriVerisi.modalMesaj), 400);
        soruGirisi.value = ''; cevapGirisi.value = ''; gorselAnahtarKelime.value = ''; yuklenenGorselDataURL = null; gorselYukleInput.value = ''; gorselOnizleme.src = ''; gorselOnizleme.classList.remove('gorunur');
    }

    gorselOnizlemeKutusu.addEventListener('click', () => gorselYukleInput.click());
    gorselYukleInput.addEventListener('change', (event) => {
        const dosya = event.target.files[0];
        if(dosya) {
            const reader = new FileReader();
            reader.onload = (e) => { yuklenenGorselDataURL = e.target.result; gorselOnizleme.src = yuklenenGorselDataURL; gorselOnizleme.classList.add('gorunur'); };
            reader.readAsDataURL(dosya);
        }
    });

    gorselSorgulaButonu.addEventListener('click', () => gorselSorguInput.click());
    gorselSorguInput.addEventListener('change', (event) => {
        const dosya = event.target.files[0];
        if (!dosya) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const sorguDataURL = e.target.result;
            const islemeEkrani = mesajEkle(null, 'kullanici', sorguDataURL);
            const durumMetni = islemeEkrani.querySelector('#isleme-durum-metni');

            setTimeout(() => {
                islemeEkrani.classList.add('aktif');
                durumMetni.textContent = 'Görsel işleniyor...';
            }, 100);

            setTimeout(() => {
                durumMetni.textContent = 'Görsel analiz ediliyor...';
            }, 1500);

            setTimeout(() => {
                let eslesmeBulundu = false;
                for(const anahtar in hafiza) {
                    if(hafiza[anahtar] === sorguDataURL) {
                        durumMetni.textContent = 'Analiz edildi';
                        setTimeout(() => {
                            islemeEkrani.classList.remove('aktif');
                            streamResponse(`Bu görseli "${anahtar}" olarak hatırlıyorum.`);
                        }, 500);
                        eslesmeBulundu = true;
                        break;
                    }
                }
                if(!eslesmeBulundu) {
                    durumMetni.textContent = 'Analiz edildi';
                     setTimeout(() => {
                        islemeEkrani.classList.remove('aktif');
                        streamResponse("Üzgünüm baba, bu görseli daha önce görmedim.");
                    }, 500);
                }
            }, 3000);
        };
        reader.readAsDataURL(dosya);
        gorselSorguInput.value = '';
    });

    kategoriSeciciTetikleyici.addEventListener('click', (e) => { e.stopPropagation(); kategoriMenu.classList.toggle('aktif'); kategoriSeciciTetikleyici.classList.toggle('aktif'); });
    document.addEventListener('click', () => { kategoriMenu.classList.remove('aktif'); kategoriSeciciTetikleyici.classList.remove('aktif'); });
    kategoriMenu.addEventListener('click', (e) => { e.stopPropagation(); const button = e.target.closest('button'); if (button && button.dataset.kategori) { kategoriArayuzunuGuncelle(button.dataset.kategori); kategoriMenu.classList.remove('aktif'); kategoriSeciciTetikleyici.classList.remove('aktif'); } });
    egitButonu.addEventListener('click', oglunaOgret);
    modalKapatButonu.addEventListener('click', () => onayModali.classList.remove('aktif'));
    gonderButonu.addEventListener('click', mesajGonder);
    mesajGirisi.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); mesajGonder(); } });
    
    hafizayiYukle();
    kategoriMenuDoldur();
    kategoriArayuzunuGuncelle('soru-cevap');
});