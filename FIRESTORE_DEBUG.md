# 🔥 Firebase Firestore Debug

## Mevcut Durum
- Firebase bağlantısı: ✅ Çalışıyor
- Toast mesajı: "İçerikler yüklendi! 🔥"
- Görüntülenen proje sayısı: 0

## Sorun Analizi
Firebase bağlantısı başarılı ama Firestore'da test verisi eksik.

## Çözüm Adımları

### 1. Firebase Console'a Git
```
https://console.firebase.google.com/project/ders-87307/firestore
```

### 2. Koleksiyon Kontrolü
- "contents" koleksiyonu var mı kontrol et
- Eğer yoksa, yeni koleksiyon oluştur

### 3. Test Verisi Ekle
Aşağıdaki formatı kullan:

```javascript
// Doküman 1
{
  title: "React Hook Kullanımı",
  description: "React'ta useState ve useEffect hook'larının detaylı kullanımı",
  category: "React",
  code: "const [count, setCount] = useState(0);\n\nuseEffect(() => {\n  console.log('Component mounted');\n}, []);",
  photoUrl: "https://picsum.photos/400/300?random=1",
  createdAt: new Date(),
  updatedAt: new Date()
}

// Doküman 2
{
  title: "Next.js API Routes",
  description: "Next.js'te API endpoint'leri oluşturma ve kullanma",
  category: "Next.js",
  code: "export default function handler(req, res) {\n  res.status(200).json({ message: 'Hello API!' });\n}",
  photoUrl: "https://picsum.photos/400/300?random=2",
  createdAt: new Date(),
  updatedAt: new Date()
}

// Doküman 3
{
  title: "Firebase Firestore",
  description: "Firestore veritabanı işlemleri ve real-time güncellemeler",
  category: "Firebase",
  code: "import { collection, addDoc } from 'firebase/firestore';\n\nconst docRef = await addDoc(collection(db, 'contents'), {\n  title: 'Test',\n  description: 'Test açıklama'\n});",
  photoUrl: "https://picsum.photos/400/300?random=3",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### 4. Koleksiyon Adı Kontrolü
- Service: "contents" ✅
- Interface: photoUrl field ✅
- Timestamp: createdAt/updatedAt ✅

### 5. Test Sonrası
Veri eklendikten sonra sayfayı yenile ve projelerin görüntülendiğini kontrol et.