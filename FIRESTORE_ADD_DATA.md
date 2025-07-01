# 📝 Firestore'a Test Verisi Ekleme

## Şu anda buradayısın: 
https://console.firebase.google.com/u/0/project/ders-87307/firestore/databases/-default-/data

## 1. Document ID
- **Document ID** alanını **boş bırak**
- Veya **"Auto-ID"** butonuna tıkla
- Firebase otomatik ID oluşturacak

## 2. Field'ları Tek Tek Ekle

Her field için **"+ Add field"** butonuna tıkla:

### Field 1: title
- **Field**: `title`
- **Type**: `string`
- **Value**: `Test İçerik`

### Field 2: description  
- **Field**: `description`
- **Type**: `string`
- **Value**: `Bu bir test içeriğidir`

### Field 3: category
- **Field**: `category` 
- **Type**: `string`
- **Value**: `web`

### Field 4: createdAt
- **Field**: `createdAt`
- **Type**: `string` 
- **Value**: `2024-01-01T00:00:00Z`

### Field 5: photoUrl
- **Field**: `photoUrl`
- **Type**: `string`
- **Value**: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400`

### Field 6: code
- **Field**: `code`
- **Type**: `string`
- **Value**: `console.log('Hello Firebase!');`

## 3. Kaydet
- **"Save"** butonuna tıkla

## 4. Collection ID Kontrol
Collection ID'nin **`contents`** olduğundan emin ol!

Bu adımları tamamladıktan sonra uygulamada test verisini görebileceğiz!