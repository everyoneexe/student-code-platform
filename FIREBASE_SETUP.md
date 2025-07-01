# 🔥 Firebase Kurulum Rehberi

Bu rehber, "ders-takip" projesi için Firebase'i manual olarak nasıl kuracağınızı adım adım açıklar.

## 🚀 1. Firebase Console'da Proje Oluşturma

### Adım 1: Firebase Console'a Giriş
- [Firebase Console](https://console.firebase.google.com) adresine gidin
- Google hesabınızla giriş yapın

### Adım 2: Yeni Proje Oluştur
1. **"Create a project"** veya **"Add project"** butonuna tıklayın
2. **Proje adı**: `ders-takip` (veya istediğiniz ad)
3. **Google Analytics**: İsteğe bağlı (önerilir)
4. **Create project** butonuna tıklayın

### Adım 3: Web Uygulaması Ekle
1. Proje dashboard'ında **"Web"** simgesine (`</>`) tıklayın
2. **App nickname**: `ders-takip-web`
3. **Firebase Hosting**: İsteğe bağlı
4. **Register app** butonuna tıklayın

## 🔧 2. Firebase Yapılandırması

### Adım 4: Config Bilgilerini Kopyala
Firebase size aşağıdaki gibi bir config objesi verecek:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC7..." // Gerçek API key
  authDomain: "ders-takip-12345.firebaseapp.com",
  projectId: "ders-takip-12345",
  storageBucket: "ders-takip-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
};
```

### Adım 5: Config'i Projeye Uygula
1. `lib/firebase.ts` dosyasını açın
2. `firebaseConfig` objesindeki sahte değerleri gerçek değerlerle değiştirin:

```typescript
const firebaseConfig = {
  apiKey: "BURAYA_GERÇEK_API_KEY",
  authDomain: "BURAYA_GERÇEK_AUTH_DOMAIN",
  projectId: "BURAYA_GERÇEK_PROJECT_ID",
  storageBucket: "BURAYA_GERÇEK_STORAGE_BUCKET",
  messagingSenderId: "BURAYA_GERÇEK_MESSAGING_SENDER_ID",
  appId: "BURAYA_GERÇEK_APP_ID"
}
```

## 🗄️ 3. Firestore Database Kurulumu

### Adım 6: Firestore'u Etkinleştir
1. Firebase Console'da **"Firestore Database"** seçin
2. **"Create database"** butonuna tıklayın
3. **Security rules**: "Start in production mode" (güvenlik kuralları)
4. **Location**: Europe (europe-west) önerilir
5. **Done** butonuna tıklayın

### Adım 7: Güvenlik Kurallarını Ayarla
Geliştirme için **"Rules"** sekmesinde:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Geliştirme için - güvensiz ama pratik
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Önemli**: Production için güvenlik kurallarını düzenleyin!

## 📦 4. Firebase Storage Kurulumu

### Adım 8: Storage'ı Etkinleştir
1. Firebase Console'da **"Storage"** seçin
2. **"Get started"** butonuna tıklayın
3. **Security rules**: Varsayılan kuralları kabul edin
4. **Location**: Firestore ile aynı bölgeyi seçin
5. **Done** butonuna tıklayın

### Adım 9: Storage Güvenlik Kuralları
**"Rules"** sekmesinde:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Geliştirme için - güvensiz ama pratik
      allow read, write: if true;
    }
  }
}
```

## 🔑 5. Authentication (Opsiyonel)

### Adım 10: Auth Kurulumu
1. Firebase Console'da **"Authentication"** seçin
2. **"Get started"** butonuna tıklayın
3. **"Sign-in method"** sekmesinde istediğiniz yöntemleri etkinleştirin
4. Email/Password, Google, GitHub vs.

## 🧪 6. Test ve Doğrulama

### Adım 11: Bağlantıyı Test Et
1. Config'i uyguladıktan sonra development server'ı başlatın:
   ```bash
   cd /path/to/ders-takip
   npm run dev
   ```

2. Console'da Firebase hatalarının kaybolduğunu kontrol edin

### Adım 12: Firestore Test Verisi
Firebase Console'da **"Firestore Database"** > **"Data"** sekmesinde:

1. **"Start collection"** tıklayın
2. **Collection ID**: `contents`
3. **Document ID**: Auto-ID
4. Test verisi ekleyin:

```json
{
  "title": "Test İçerik",
  "description": "Bu bir test içeriğidir",
  "category": "web",
  "createdAt": "2024-01-01T00:00:00Z",
  "photoUrl": "https://example.com/image.jpg",
  "code": "console.log('Hello World');"
}
```

## 📋 7. Tamamlama Checklist

- [ ] Firebase projesi oluşturuldu
- [ ] Web uygulaması eklendi
- [ ] Firebase config kopyalandı ve uygulandı
- [ ] Firestore Database etkinleştirildi
- [ ] Storage etkinleştirildi
- [ ] Güvenlik kuralları ayarlandı
- [ ] Test verisi eklendi
- [ ] Uygulama çalışıyor, console'da hata yok

## 🔧 Sorun Giderme

### Yaygın Hatalar:

1. **"Firebase config hatası"**: Config değerlerini kontrol edin
2. **"Permission denied"**: Firestore güvenlik kurallarını kontrol edin
3. **"Storage hatası"**: Storage kurallarını ve bucket adını kontrol edin
4. **"Network error"**: İnternet bağlantınızı ve Firebase status'unu kontrol edin

### Debug İçin:
```bash
# Firebase console loglarını kontrol edin
console.log('Firebase config:', firebaseConfig);
console.log('Firestore instance:', db);
```

## 📚 Ek Kaynaklar

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Get Started](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage/web/start)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Not**: Bu rehber tamamlandıktan sonra `lib/firebase.ts` dosyasındaki sahte değerleri gerçek Firebase config değerleriyle değiştirmeyi unutmayın!