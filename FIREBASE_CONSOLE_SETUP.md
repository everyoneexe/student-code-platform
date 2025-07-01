# 🔥 Firebase Console Kurulum Rehberi

Bu rehber, Firebase Console'da Firestore Database'i nasıl kuracağınızı adım adım açıklar.

## 🚀 1. Firebase Console'a Giriş

### Adım 1: Console'a Git
- **URL**: https://console.firebase.google.com
- Google hesabınızla giriş yapın

### Adım 2: Projeyi Bulun
- Projeler listesinde **"ders-87307"** projesini bulun
- (Bu, config dosyanızda gördüğümüz proje ID'si)
- Projeye tıklayarak açın

## 🗄️ 2. Firestore Database Kurulumu

### Adım 3: Firestore'u Başlatın
1. Sol menüden **"Firestore Database"** seçin
2. **"Create database"** butonuna tıklayın
3. **Security rules** için **"Start in production mode"** seçin
4. **Location** için **"europe-west"** (Avrupa bölgesi) seçin
5. **"Done"** butonuna tıklayın

### Adım 4: Güvenlik Kurallarını Ayarlayın
1. Firestore açıldıktan sonra **"Rules"** sekmesine gidin
2. Aşağıdaki kuralı kopyalayıp yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. **"Publish"** butonuna tıklayın

⚠️ **Önemli**: Bu kural geliştirme için güvensizdir, production'da düzenleyin!

## 📊 3. Test Verisi Ekleme

### Adım 5: İlk Collection'ı Oluşturun
1. **"Data"** sekmesine gidin
2. **"Start collection"** butonuna tıklayın
3. **Collection ID**: `contents` yazın
4. **"Next"** butonuna tıklayın

### Adım 6: Test Dökümanı Ekleyin
1. **Document ID**: Auto-ID bırakın (otomatik)
2. **Field** bilgilerini sırayla ekleyin:

| Field Name | Type | Value |
|------------|------|-------|
| title | string | "Test İçerik" |
| description | string | "Bu bir test içeriğidir" |
| category | string | "web" |
| createdAt | string | "2024-01-01T00:00:00Z" |
| photoUrl | string | "https://images.unsplash.com/photo-1461749280684-dccba630e2f6" |
| code | string | "console.log('Hello World');" |

3. **"Save"** butonuna tıklayın

## 📦 4. Firebase Storage (Opsiyonel)

### Adım 7: Storage'ı Etkinleştirin
1. Sol menüden **"Storage"** seçin
2. **"Get started"** butonuna tıklayın
3. **Security rules**: Varsayılan kuralları kabul edin
4. **Location**: Firestore ile aynı bölgeyi seçin (europe-west)
5. **"Done"** butonuna tıklayın

## ✅ 5. Kurulum Testi

### Adım 8: Uygulamayı Test Edin
Kurulum tamamlandıktan sonra:

1. Terminalden ders-takip klasörüne gidin
2. `npm run dev` ile uygulamayı başlatın
3. http://localhost:3000 adresine gidin
4. Console'da Firebase hatalarının kaybolduğunu kontrol edin
5. Test içeriğinin göründüğünü doğrulayın

## 🔧 Sorun Giderme

### Yaygın Problemler:

**1. "Permission denied" hatası:**
- Firestore Rules'i kontrol edin
- `allow read, write: if true;` kuralının ekli olduğundan emin olun

**2. "Failed to get document" hatası:**
- Collection adının `contents` olduğunu kontrol edin
- Test dökümanının doğru eklendiğini kontrol edin

**3. "Network error" hatası:**
- İnternet bağlantınızı kontrol edin
- Firebase config'inin doğru olduğunu kontrol edin

### Debug İçin:
Browser console'da Firebase bağlantısını test edin:
```javascript
console.log('Firebase config:', firebaseConfig);
console.log('Firestore instance:', db);
```

## 📞 Yardım

Kurulum tamamlandıktan sonra uygulamanız Firebase Firestore ile çalışmaya başlayacak!

**Önemli**: Production'a geçmeden önce güvenlik kurallarını mutlaka güncelleyin.

---

Firebase kurulumu tamamlandıktan sonra bu dosyayı silebilirsiniz.