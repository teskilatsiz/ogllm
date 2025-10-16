document.addEventListener('DOMContentLoaded', () => {
    const egitimAcButonu = document.getElementById('egitim-ac-butonu');
    const egitimModali = document.getElementById('egitim-modali');
    const egitimKapatButonu = document.getElementById('egitim-kapat-butonu');
    const onayModali = document.getElementById('onay-modali');
    const modalKapatButonu = document.getElementById('modal-kapat-butonu');
    const egitimPaneli = document.getElementById('egitim-paneli');
    const modelYukleniyorDiv = document.getElementById('model-yukleniyor');
    const bilgiAcButonu = document.getElementById('bilgi-ac-butonu');
    const bilgiModali = document.getElementById('bilgi-modali');
    const bilgiKapatButonu = document.getElementById('bilgi-kapat-butonu');
    
    const mesajKutusu = document.getElementById('mesaj-kutusu');
    const mesajGirisi = document.getElementById('mesaj-girisi');
    const gonderButonu = document.getElementById('gonder-butonu');
    const kategoriSeciciTetikleyici = document.getElementById('kategori-secici-tetikleyici');
    const kategoriMenusu = document.getElementById('kategori-menusu');
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
    let hafiza = [];
    let model;

    const kategoriVerileri = {
        'soru-cevap': { ad: "Soru-Cevap", tip: 'metin', aciklama: "Ona sorulan spesifik bir soruya nasıl cevap vereceğini öğret.", soruPlaceholder: "Örnek Soru", cevapPlaceholder: "Oğlunun Vermesi Gereken Cevap", modalBaslik: "Aferin Oğluma!", modalMesaj: "Oğlun bu yeni bilgiyi aklına yazdı." },
        'diyalog': { ad: "Diyalog Akışı", tip: 'metin', aciklama: "Günlük konuşmalardaki ifadelere nasıl karşılık vereceğini öğret.", soruPlaceholder: "Örnek Cümle", cevapPlaceholder: "Oğlunun Karşılığı", modalBaslik: "Aferin Oğluma!", modalMesaj: "Oğlun bu yeni diyaloğu öğrendi." },
        'tepki': { ad: "Duygusal Tepki", tip: 'metin', aciklama: "Belirli durumlara veya ifadelere nasıl bir tepki vereceğini tanımla.", soruPlaceholder: "Örnek Durum", cevapPlaceholder: "Oğlunun Tepkisi", modalBaslik: "Çok Duygulu!", modalMesaj: "Oğlun artık bu duruma nasıl tepki vereceğini biliyor." },
        'fikir': { ad: "Fikir ve Görüş", tip: 'metin', aciklama: "Soyut konular hakkında kendi fikirlerini oluşturmasına yardım et.", soruPlaceholder: "Örnek Fikir Konusu", cevapPlaceholder: "Oğlunun Fikri", modalBaslik: "Ne Kadar Akıllı!", modalMesaj: "Oğlunun artık bu konuda bir fikri var." },
        'mizah': { ad: "Mizah Yeteneği", tip: 'metin', aciklama: "Ona komik cevaplar veya espriler öğreterek sohbeti eğlenceli kıl.", soruPlaceholder: "Örnek Şaka Sorusu", cevapPlaceholder: "Oğlunun Espirisi", modalBaslik: "Çok Komik!", modalMesaj: "Bu espriyi de repertuvarına ekledi." },
        'gorsel-hafiza': { ad: "Görsel Hafıza Ekle", tip: 'gorsel', aciklama: "Bir anahtar kelime ile bir görseli eşleştirerek oğlunun görsel hafızasını geliştir.", modalBaslik: "Yeni Bir Şey Gördü!", modalMesaj: "Oğlun bu görseli artık hatırlayacak." }
    };
    let aktifKategori = null;

    async function modeliYukleVeBaslat() {
        model = await use.load();
        modelYukleniyorDiv.style.display = 'none';
        mesajGirisi.disabled = false;
        await hafizayiYukle();
    }
    
    function hafizayiKaydet() {
        const saklanacakVeri = hafiza.map(({ soru, cevap }) => ({ soru, cevap }));
        try { localStorage.setItem('ogllmHafiza', JSON.stringify(saklanacakVeri)); }
        catch (e) { console.error("Hafıza kaydedilemedi, localStorage dolu olabilir.", e); }
    }

    async function hafizayiYukle() {
        const kayitliVeri = localStorage.getItem('ogllmHafiza');
        let veriler;
        if (kayitliVeri) {
            let parsedData = JSON.parse(kayitliVeri);
            if (Array.isArray(parsedData)) {
                veriler = parsedData;
            } else {
                veriler = Object.entries(parsedData).map(([soru, cevap]) => ({ soru, cevap }));
            }
        } else {
            veriler = [{ soru: "merhaba", cevap: "Merhaba baba!" }];
        }
        const sorular = veriler.map(v => v.soru);
        if (sorular.length > 0) {
            const embeddings = await model.embed(sorular);
            hafiza = veriler.map((v, i) => ({ ...v, tensor: embeddings.slice([i, 0], [1, -1]) }));
        } else {
            hafiza = [];
        }
    }

    async function findBestMatch(userInput) {
        if (hafiza.length === 0) return null;
        const inputTensor = await model.embed([userInput]);
        let bestScore = -1;
        let bestMatch = null;
        for (const item of hafiza) {
            if (item.tensor && !item.cevap.startsWith('data:image')) {
                const score = tf.tidy(() => tf.matMul(inputTensor, item.tensor, false, true).dataSync()[0]);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = item.cevap;
                }
            }
        }
        inputTensor.dispose();
        const BENZERLIK_ESIGI = 0.5;
        return bestScore > BENZERLIK_ESIGI ? bestMatch : null;
    }

    async function oglununCevabiniAl(babaninMesaji) {
        const temizMesaj = babaninMesaji.toLowerCase().trim();
        const tamEslesme = hafiza.find(h => h.soru === temizMesaj);
        if (tamEslesme) return tamEslesme.cevap;
        const enIyiBenzerlik = await findBestMatch(temizMesaj);
        return enIyiBenzerlik || "Bunu bana henüz öğretmedin baba, <button class='ogret-butonu-mesaj-ici'>öğret bana!</button>";
    }
    
    async function oglunaOgret() {
        if (!aktifKategori) { return; }
        const aktifKategoriVerisi = kategoriVerileri[aktifKategori];
        let soru, cevap;
        if (aktifKategoriVerisi.tip === 'gorsel') {
            soru = gorselAnahtarKelime.value.trim().toLowerCase();
            cevap = yuklenenGorselDataURL;
            if(!soru || !cevap) { alert("Lütfen hem anahtar kelimeyi girin hem de bir görsel yükleyin."); return; }
        } else {
            soru = soruGirisi.value.trim().toLowerCase();
            cevap = cevapGirisi.value.trim();
            if (!soru || !cevap) { alert("Lütfen her iki alanı da doldur."); return; }
        }
        const embedding = await model.embed([soru]);
        hafiza.push({ soru, cevap, tensor: embedding });
        hafizayiKaydet();
        egitimModali.classList.remove('aktif');
        setTimeout(() => modalGoster(aktifKategoriVerisi.modalBaslik, aktifKategoriVerisi.modalMesaj), 400);
        soruGirisi.value = ''; cevapGirisi.value = ''; gorselAnahtarKelime.value = ''; 
        yuklenenGorselDataURL = null; gorselYukleInput.value = ''; 
        gorselOnizleme.src = ''; gorselOnizleme.classList.remove('gorunur');
    }

    function streamResponse(responseText) {
        const mesajElementi = document.createElement('div');
        mesajElementi.classList.add('mesaj', 'yapay-zeka', 'streaming');
        mesajKutusu.appendChild(mesajElementi);
        mesajKutusu.scrollTop = mesajKutusu.scrollHeight;

        const buttonRegex = /<button class='ogret-butonu-mesaj-ici'>öğret bana!<\/button>/;
        const parts = responseText.split(buttonRegex);
        const textBeforeButton = parts[0] || '';
        const hasButton = parts.length > 1;

        const kelimeler = textBeforeButton.trim().split(' ');
        let kelimeIndex = 0;

        const interval = setInterval(() => {
            if (kelimeIndex < kelimeler.length) {
                const kelimeSpan = document.createElement('span');
                kelimeSpan.className = 'kelime';
                kelimeSpan.textContent = kelimeler[kelimeIndex] + (kelimeIndex < kelimeler.length - 1 ? ' ' : '');
                mesajElementi.appendChild(kelimeSpan);
                mesajKutusu.scrollTop = mesajKutusu.scrollHeight;
                kelimeIndex++;
            } else if (hasButton && kelimeIndex === kelimeler.length) {

                const buttonSpan = document.createElement('span');
                buttonSpan.className = 'kelime';
                buttonSpan.innerHTML = "<button class='ogret-butonu-mesaj-ici'>öğret bana!</button>";
                const ogretButonu = buttonSpan.querySelector('.ogret-butonu-mesaj-ici');
                if (ogretButonu) {
                    ogretButonu.addEventListener('click', () => {
                        egitimModali.classList.add('aktif');
                    });
                }
                mesajElementi.appendChild(buttonSpan);
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
            metinSpan.innerHTML = mesaj;
            if (mesaj.includes('<button')) {
                const ogretButonu = metinSpan.querySelector('.ogret-butonu-mesaj-ici');
                if (ogretButonu) {
                    ogretButonu.addEventListener('click', () => {
                        egitimModali.classList.add('aktif');
                    });
                }
            }
            mesajElementi.appendChild(metinSpan);
        }
        mesajKutusu.appendChild(mesajElementi);
        mesajKutusu.scrollTop = mesajKutusu.scrollHeight;
        return islemeEkrani;
    }

    async function mesajGonder() {
        const mesajMetni = mesajGirisi.value.trim();
        if (mesajMetni === '') return;
        mesajEkle(mesajMetni, 'kullanici');
        mesajGirisi.value = '';
        gonderButonu.classList.remove('aktif');
        await new Promise(resolve => setTimeout(resolve, 800));
        const cevap = await oglununCevabiniAl(mesajMetni);
        if(cevap && cevap.startsWith('data:image')) {
            mesajEkle(null, 'yapay-zeka', cevap);
        } else {
            streamResponse(cevap);
        }
    }
    
    function kategoriMenuDoldur() {
        kategoriMenusu.innerHTML = '';
        for (const [id, veri] of Object.entries(kategoriVerileri)) {
            const button = document.createElement('button');
            button.dataset.kategori = id;
            button.textContent = veri.ad;
            kategoriMenusu.appendChild(button);
        }
    }
    
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

    function modalGoster(baslik, mesaj) {
        modalBasligi.textContent = baslik;
        modalMesaji.textContent = mesaj;
        onayModali.classList.add('aktif');
    }
    
    egitimAcButonu.addEventListener('click', () => egitimModali.classList.add('aktif'));
    egitimKapatButonu.addEventListener('click', () => egitimModali.classList.remove('aktif'));
    egitimModali.addEventListener('click', (event) => {
        if (event.target === egitimModali) {
            egitimModali.classList.remove('aktif');
        }
    });

    bilgiAcButonu.addEventListener('click', () => bilgiModali.classList.add('aktif'));
    bilgiKapatButonu.addEventListener('click', () => bilgiModali.classList.remove('aktif'));
    bilgiModali.addEventListener('click', (event) => {
        if (event.target === bilgiModali) {
            bilgiModali.classList.remove('aktif');
        }
    });

    mesajGirisi.addEventListener('input', () => {
        gonderButonu.classList.toggle('aktif', mesajGirisi.value.trim() !== '');
    });

    gorselOnizlemeKutusu.addEventListener('click', () => gorselYukleInput.click());
    gorselYukleInput.addEventListener('change', (event) => {
        const dosya = event.target.files[0];
        if(dosya) {
            const reader = new FileReader();
            reader.onload = (e) => {
                yuklenenGorselDataURL = e.target.result;
                gorselOnizleme.src = yuklenenGorselDataURL;
                gorselOnizleme.classList.add('gorunur');
            };
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
                for(const item of hafiza) {
                    if(item.cevap === sorguDataURL) {
                        durumMetni.textContent = 'Analiz edildi';
                        setTimeout(() => {
                            islemeEkrani.classList.remove('aktif');
                            streamResponse(`Bu görseli "${item.soru}" olarak hatırlıyorum.`);
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

    kategoriSeciciTetikleyici.addEventListener('click', (e) => {
        e.stopPropagation();
        kategoriMenusu.classList.toggle('aktif');
        kategoriSeciciTetikleyici.classList.toggle('aktif');
    });

    document.addEventListener('click', () => {
        kategoriMenusu.classList.remove('aktif');
        kategoriSeciciTetikleyici.classList.remove('aktif');
    });

    kategoriMenusu.addEventListener('click', (e) => {
        e.stopPropagation();
        const button = e.target.closest('button');
        if (button && button.dataset.kategori) {
            kategoriArayuzunuGuncelle(button.dataset.kategori);
            kategoriMenusu.classList.remove('aktif');
            kategoriSeciciTetikleyici.classList.remove('aktif');
        }
    });
    
    egitButonu.addEventListener('click', oglunaOgret);
    modalKapatButonu.addEventListener('click', () => onayModali.classList.remove('aktif'));
    gonderButonu.addEventListener('click', mesajGonder);
    mesajGirisi.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            mesajGonder();
        }
    });
    
    kategoriMenuDoldur();
    kategoriArayuzunuGuncelle('soru-cevap');
    modeliYukleVeBaslat();
});