# 🔍 Firebase Console'da Veri Kontrolü

## Nasıl Kontrol Edeceksin:

### 1. Firebase Console'a Git
- https://console.firebase.google.com
- "ders-87307" projesini aç

### 2. Firestore Database'e Git
- Sol menüden **"Firestore Database"** tıkla
- **"Data"** sekmesinde olduğundan emin ol

### 3. Collection'ı Kontrol Et
Şunları görmeli:

✅ **`contents`** adında collection var mı?
✅ Collection'ın içinde döküman var mı?
✅ Dökümanın 6 field'ı var mı? (title, description, category, code, createdAt, photoUrl)

### 4. Eğer Yoksa:
**A) Collection yok ise:**
- **"Start collection"** → `contents` yaz

**B) Döküman yok ise:**
- Collection'a tıkla → **"Add document"**
- Auto-ID bırak, 6 field'ı ekle

**C) Field eksik ise:**
- Dokümana tıkla → **"Edit"**
- Eksik field'ları ekle

### 5. Kesin Kontrol:
Collection'ın içinde şöyle bir döküman olmalı:

```
contents (collection)
  └── [Auto-ID] (document)
       ├── title: "Test İçerik"
       ├── description: "Bu bir test içeriğidir" 
       ├── category: "web"
       ├── code: "console.log('Hello Firebase!');"
       ├── createdAt: "2024-01-01T00:00:00Z"
       └── photoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400"
```

Bu yapı tamsa, uygulamada veri görünecek!