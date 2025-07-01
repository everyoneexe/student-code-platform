# 🔥 Firebase'e Test Verisi Ekleme - Adım Adım

## 1. Firebase Console'a Git
- **URL**: https://console.firebase.google.com
- **Proje**: "ders-87307" projesini aç

## 2. Firestore Database'e Git
- Sol menüden **"Firestore Database"** tıkla
- **"Data"** sekmesinde ol

## 3. Collection Oluştur
- **"Start collection"** butonuna tıkla
- **Collection ID**: `contents` yaz
- **"Next"** butonuna tıkla

## 4. İlk Dökümanı Ekle
- **Document ID**: Auto-ID bırak
- **6 field ekle** (+ Add field):

### Field 1: title
- **Field**: `title`
- **Type**: `string` 
- **Value**: `Test Firebase İçerik`

### Field 2: description  
- **Field**: `description`
- **Type**: `string`
- **Value**: `Bu Firebase'den gelen test içeriğidir`

### Field 3: category
- **Field**: `category`
- **Type**: `string`
- **Value**: `web`

### Field 4: code
- **Field**: `code`
- **Type**: `string`
- **Value**: `console.log('Firebase çalışıyor!');`

### Field 5: createdAt
- **Field**: `createdAt`
- **Type**: `string`
- **Value**: `2024-01-01T00:00:00Z`

### Field 6: photoUrl
- **Field**: `photoUrl`
- **Type**: `string`
- **Value**: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400`

## 5. Kaydet
- **"Save"** butonuna tıkla

## 6. Test Et
- Uygulamayı yenile: http://localhost:3000
- Artık Firebase'den veri gelecek!

## 🎯 Başarı İşareti:
Eğer her şey doğruysa:
- ✅ Toast: "İçerikler yüklendi! 🔥"
- ✅ "1 proje" yazacak
- ✅ Test içeriğin görünecek

Hadi dene! 🚀