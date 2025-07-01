# 🚀 Firebase Hızlı Çözüm

## Sorun: Firestore Database henüz kurulmamış

### 1. Firebase Console'a Git
- https://console.firebase.google.com
- "ders-87307" projesini aç

### 2. Firestore'u İlk Kez Kur
- Sol menüden **"Firestore Database"** tıkla
- **"Create database"** butonuna tıkla
- **"Start in test mode"** seç (30 gün ücretsiz, herkes erişebilir)
- **Location**: "europe-west" seç
- **"Done"** tıkla

### 3. Test Verisi Ekle
- **"Start collection"** → `contents`
- Auto-ID ile döküman oluştur
- Şu alanları ekle:

```
title: "Test İçerik" (string)
description: "Bu test içeriğidir" (string)
category: "web" (string)
code: "console.log('test');" (string)
createdAt: "2024-01-01T00:00:00Z" (string)
photoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400" (string)
```

Hepsi bu! Test mode otomatik olarak herkese izin veriyor.