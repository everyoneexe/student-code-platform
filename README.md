# 🎓 Ders Takip Projesi - Kod & Devre Paylaşım Platformu

Bu proje, öğrencilerin programlama örneklerini ve devre projelerini paylaşabilecekleri modern bir web uygulamasıdır.

## ✨ Ana Özellikler

### 🎨 Frontend
- ✅ **Modern React/Next.js** arayüzü (TypeScript)
- ✅ **Responsive tasarım** (Tailwind CSS) 
- ✅ **Gelişmiş proje galerisi** ve modal görüntüleyici
- ✅ **Kategori filtreleme** ve slider navigasyon
- ✅ **Kod kopyalama özelliği** 
- ✅ **Ayrı kod modal'ı** - büyük ve düzenli kod görüntüleme
- ✅ **Delete özelliği** - confirmation modal ile güvenli silme
- ✅ **Scroll destekli açıklamalar** - uzun metinler için
- ✅ **Varsayılan fotoğraf sistemi** - fotoğraf olmadığında otomatik fallback

### 🗄️ Backend
- ✅ **Firebase Firestore** - cloud-based NoSQL veritabanı
- ✅ **Real-time veri senkronizasyonu** - anlık güncellemeler
- ✅ **Firebase Storage** - görsel ve dosya yönetimi
- ✅ **CRUD operasyonları** (Create, Read, Update, Delete)
- ✅ **Otomatik timestamp** tracking
- ✅ **Form validation** ve error handling

## 🚀 Kurulum

### 1. Depoyu Klonla
```bash
git clone https://github.com/everyoneexe/student-code-platform.git
cd ders-takip
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```

### 4. Tarayıcıda Aç
```
http://localhost:3000
```

## 📂 Proje Yapısı

```
ders-takip/
├── app/
│   ├── admin/
│   │   ├── dashboard/          # Eski Admin Panel
│   │   └── firebase/           # 🔥 Firebase Admin Panel
│   ├── api/
│   │   ├── contents/           # İçerik API'leri (eski)
│   │   ├── test-data/          # 🔥 Firebase test verisi API
│   │   └── categories/         # Kategori API'si
│   └── page.tsx               # Ana sayfa
├── components/
│   └── FirebaseContentGallery.tsx  # 🔥 Firebase galeri komponenti
├── lib/
│   ├── firebase.ts            # 🔥 Firebase konfigürasyonu
│   ├── firebase-service.ts    # 🔥 Firebase service layer
│   └── data-store.ts          # Eski JSON veri yöneticisi
├── public/
│   └── default.jpg            # Varsayılan fotoğraf
└── package.json
```

## 🗄️ Veritabanı Teknolojisi

### 🔥 **Firebase Firestore + Storage**
Bu proje **Google Firebase** ekosistemi kullanarak **cloud-based NoSQL** veritabanı ile geliştirilmiştir:

```
Firebase Services:
├── 🔥 Firestore Database    # NoSQL document database
├── 📁 Firebase Storage      # File storage (images, files)
├── 🔐 Firebase Auth         # Authentication (optional)
└── 📊 Firebase Analytics    # Usage analytics (optional)
```

### 💾 **Veritabanı Mimarisi:**
- **Database Type:** Cloud Firestore (NoSQL Document Database)
- **Technology:** Google Firebase
- **Data Format:** Document-based JSON storage
- **ACID Properties:** Full ACID compliance
- **Scalability:** Enterprise-level, auto-scaling
- **Real-time:** Live data synchronization

### 🔄 **Firebase Service Katmanı:**
```typescript
// lib/firebase-service.ts - Firebase abstraction layer
class ContentService {
  // Firestore CRUD Operations
  static async getAllContents(): Promise<ContentItem[]>
  static async addContent(content: ContentItem): Promise<string | null>
  static async updateContent(id: string, updates: Partial<ContentItem>): Promise<boolean>
  static async deleteContent(id: string): Promise<boolean>
}

class StorageService {
  // Firebase Storage Operations
  static async uploadImage(file: File, path: string): Promise<string | null>
  static async deleteImage(imageUrl: string): Promise<boolean>
}
```

### 🎯 **Neden Firebase Firestore?**

| **Avantajlar** | **Açıklama** |
|----------------|--------------|
| ☁️ **Cloud-Based** | Sunucu yönetimi gerektirmez |
| 🚀 **Real-time** | Anlık veri senkronizasyonu |
| 📈 **Scalable** | Otomatik ölçeklendirme |
| 🔐 **Secure** | Built-in güvenlik kuralları |
| 🌍 **Global CDN** | Dünya çapında hızlı erişim |
| 💰 **Cost-Effective** | Pay-as-you-use model |

### 📊 **Firestore Collections:**
```typescript
// contents collection
{
  id: string,                    // Auto-generated document ID
  title: string,                 // Proje başlığı
  description: string,           // Proje açıklaması
  photoUrl: string,              // Firebase Storage URL
  category: string,              // Kategori
  code: string,                  // Kod örneği
  createdAt: Timestamp,          // Firebase server timestamp
  updatedAt: Timestamp           // Firebase server timestamp
}

// categories collection
{
  id: string,                    // Auto-generated document ID
  name: string,                  // Kategori adı
  createdAt: Timestamp           // Firebase server timestamp
}
```

### 🔧 **Firebase Configuration:**
```typescript
// lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "project.firebaseapp.com",
  projectId: "student-platform",
  storageBucket: "project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
}
```

## � API Endpoints

### 🔥 Firebase İşlemleri
```bash
# Firebase Service Layer ile veri işlemleri
ContentService.getAllContents()     # Firestore'dan tüm içerikleri getir
ContentService.addContent()         # Firestore'a yeni içerik ekle
ContentService.deleteContent(id)    # Firestore'dan içerik sil
```

### API Endpoints
```bash
POST   /api/test-data          # Firebase test verisi ekleme
GET    /api/categories         # Kategorileri getir
```

## 📊 Veri Yapısı ve ER Diyagramı

### 🔥 Firebase Firestore Entity-Relationship Diyagramı

```mermaid
erDiagram
    CONTENTS {
        string id PK "Auto-generated Firebase Document ID"
        string title "Proje başlığı"
        string description "Proje açıklaması"
        string photoUrl "Firebase Storage URL"
        string category "Kategori adı"
        string code "Kod örneği"
        timestamp createdAt "Firebase server timestamp"
        timestamp updatedAt "Firebase server timestamp"
    }
    
    CATEGORIES {
        string id PK "Auto-generated Firebase Document ID"
        string name "Kategori adı"
        timestamp createdAt "Firebase server timestamp"
    }
    
    FIREBASE_STORAGE {
        string path PK "Storage file path"
        string downloadURL "Public access URL"
        string contentType "File MIME type"
        timestamp uploadedAt "Upload timestamp"
    }
    
    CONTENTS ||--o{ CATEGORIES : belongs_to
    CONTENTS ||--o{ FIREBASE_STORAGE : references
```

### 🔥 Firebase ContentItem Entity
```typescript
interface ContentItem {
  id?: string                   // Firebase Document ID (auto-generated)
  title: string                 // Proje başlığı
  description: string           // Proje açıklaması
  photoUrl: string              // Firebase Storage URL
  category: string              // Kategori adı
  code: string                  // Kod örneği
  createdAt: any               // Firebase server timestamp
  updatedAt: any               // Firebase server timestamp
}
```

### 🔥 Firebase Category Entity
```typescript
interface Category {
  id?: string                   // Firebase Document ID (auto-generated)
  name: string                  // Kategori adı
  createdAt: any               // Firebase server timestamp
}
```

### 🔥 Firebase Storage Entity
```typescript
interface StorageFile {
  path: string                  // Storage file path
  downloadURL: string           // Public access URL
  contentType: string           // File MIME type (image/jpeg, image/png, etc.)
  uploadedAt: any              // Firebase server timestamp
}
```

### 🔗 Firebase Firestore Relationships
- **contents ↔ categories**: Document reference by category name (Many-to-One)
- **contents ↔ storage**: photoUrl field references Firebase Storage (One-to-One)
- **Real-time sync**: All collections support live data synchronization
- **Auto-scaling**: Firebase handles automatic scaling and performance

### 📊 Current Live Data (Production)
```typescript
// Firestore Collection: "contents" (3 documents)
[
  {
    id: "JdeS5f3a5d0TnG7q6dnZ",
    title: "React Hook Kullanımı",
    category: "React",
    photoUrl: "https://picsum.photos/400/300?random=1"
  },
  {
    id: "iG7Sbzz4SZdOyj8XVlKA",
    title: "Next.js API Routes",
    category: "Next.js",
    photoUrl: "https://picsum.photos/400/300?random=2"
  },
  {
    id: "WT3WoixRwP1upc3Q2FVN",
    title: "Firebase Firestore",
    category: "Firebase",
    photoUrl: "https://picsum.photos/400/300?random=3"
  }
]
```

## 🎯 Yeni Özellikler

### 1. **Ayrı Kod Modal'ı**
- Kod örnekleri artık ayrı modal'da açılıyor
- Daha büyük görüntüleme alanı
- "📋 Kod Örneği Gör" butonu ile erişim
- "📄 Kopyala" butonu ile kod kopyalama

### 2. **Delete Özelliği**
- Hover ile görünen delete butonları (kırmızı ×)
- Confirmation modal ile güvenli silme
- "İçeriği Sil" onay sistemi

### 3. **Varsayılan Fotoğraf Sistemi**
- Fotoğraf yüklenmediğinde otomatik `/default.jpg` kullanımı
- API seviyesinde fallback logic
- Responsive görüntüleme

### 4. **Scroll Destekli Açıklamalar**
- Modal'da uzun açıklamalar için scroll özelliği
- `max-h-32` ile sınırlı yükseklik
- Gri kutulu tasarım ile düzenli görünüm

### 5. **Text Overflow Düzeltmeleri**
- `break-words` ile kelime kırma
- `max-width` ile taşma kontrolü
- Responsive text wrapping

## 🎮 Admin Panel

### Erişim
- **URL:** `/admin/dashboard`
- **Şifre:** `oguzhan2025`

### Özellikler
- 📝 **CRUD operasyonları** - Tam içerik yönetimi
- 📊 **İstatistikler** - Toplam içerik ve kategori sayıları
- 🖼️ **Görsel yükleme** - Drag & drop file upload
- 📱 **Responsive tasarım** - Mobil uyumlu
- 🔔 **Form validation** - Kullanıcı dostu hata mesajları

## 🎨 Kullanıcı Arayüzü

### Ana Sayfa Features
- **🔥 Firebase Kategori Filtreleme:** Tümü, Firebase, Next.js, React
- **Slider Navigation:** ◀ ▶ butonları ile sayfalama
- **🔥 Firebase Badge'leri:** Her projede Firebase işaretleri
- **Modal Interactions:** Tıkla-aç modal sistemi
- **Code Syntax:** Syntax highlighted kod blokları
- **Real-time Updates:** Firebase'den anlık veri güncellemeleri

### Responsive Design
- **Desktop:** 3 sütunlu grid layout
- **Tablet:** 2 sütunlu layout
- **Mobile:** Tek sütun responsive tasarım

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** 🔥 Firebase Firestore, Firebase Storage
- **Styling:** Tailwind CSS
- **Icons:** Emoji icons (📋, ✅, 📄, ×, 🔥)
- **API:** Next.js API Routes + Firebase SDK
- **Database:** 🔥 Firebase Firestore (NoSQL Cloud Database)
- **File Storage:** 🔥 Firebase Storage
- **Real-time:** 🔥 Firebase real-time synchronization

## 🔍 Kullanım Örnekleri

### İçerik Görüntüleme
1. Ana sayfada kategori seç
2. Proje kartına tıkla
3. Modal'da detayları gör
4. "📋 Kod Örneği Gör" ile kodu incele

### İçerik Ekleme
1. `/admin/firebase` adresine git (🔥 Firebase Admin Panel)
2. Şifre gir: `oguzhan2025`
3. Form doldur (başlık, açıklama, kategori, kod)
4. Fotoğraf yükle (Firebase Storage'a) - opsiyonel
5. "İçerik Ekle" butonuna tıkla (Firestore'a kaydedilir)

### İçerik Silme
1. Ana sayfada proje kartının üzerine hover yap
2. Kırmızı "×" butonunu tıkla
3. Confirmation modal'da "Sil" butonuna tıkla

## 🐛 Troubleshooting

### Genel Sorunlar
1. **Port 3000 meşgul** → `lsof -ti:3000 | xargs kill -9`
2. **Node modules sorunu** → `rm -rf node_modules && npm install`
3. **🔥 Firebase bağlantı sorunu** → Firebase config kontrolü
4. **Firestore erişim sorunu** → Test modunda güvenlik kuralları

### 🔥 Firebase Development
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Firebase test verisi ekleme
curl -X POST http://localhost:3000/api/test-data

# Firebase connection test
# Console'da "İçerikler yüklendi! 🔥" mesajını kontrol et
```

## 📈 İstatistikler

- **🔥 Firebase Component:** 1 ana Firebase galeri komponenti
- **🔥 Firebase Service:** 4 servis sınıfı (Content, Category, Storage, Stats)
- **🔥 Live Data:** 3 Firebase projesi (React, Next.js, Firebase)
- **API Endpoint:** Firebase SDK + 1 test endpoint
- **Responsive Breakpoint:** 3 farklı ekran boyutu
- **Modal Type:** 3 farklı modal türü

## 🎉 Sonuç

Bu proje **modern web development** prensiplerine uygun olarak geliştirilmiş:

- 🎯 **User Experience** odaklı tasarım
- 🔧 **Maintainable** kod yapısı  
- 📱 **Mobile-first** responsive tasarım
- 🚀 **Performance** optimized
- 💻 **Developer-friendly** API design

Ödev düzeyinde gelişmiş bir sistem olmasının yanı sıra, gerçek dünya projelerinde kullanılabilir **production-ready** özelliklere sahiptir! 🔥

