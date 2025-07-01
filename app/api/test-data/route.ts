import { NextRequest, NextResponse } from 'next/server'
import { ContentService } from '../../../lib/firebase-service'

export async function POST() {
  try {
    console.log('🔥 Test verisi ekleme başladı...')

    const testContents = [
      {
        title: "React Hook Kullanımı",
        description: "React'ta useState ve useEffect hook'larının detaylı kullanımı. Modern React uygulamalarında state yönetimi ve lifecycle işlemleri.",
        photoUrl: "https://picsum.photos/400/300?random=1",
        category: "React",
        code: `const [count, setCount] = useState(0);

useEffect(() => {
  console.log('Component mounted');
  
  return () => {
    console.log('Component unmounted');
  };
}, []);

const handleIncrement = () => {
  setCount(prevCount => prevCount + 1);
};`
      },
      {
        title: "Next.js API Routes",
        description: "Next.js'te API endpoint'leri oluşturma ve kullanma. Server-side işlemler ve RESTful API tasarımı.",
        photoUrl: "https://picsum.photos/400/300?random=2",
        category: "Next.js",
        code: `export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;
    
    // Veritabanı işlemleri
    
    res.status(200).json({ 
      message: 'Kayıt başarılı!',
      data: { name, email }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}`
      },
      {
        title: "Firebase Firestore",
        description: "Firestore veritabanı işlemleri ve real-time güncellemeler. NoSQL veritabanı kullanımı ve best practices.",
        photoUrl: "https://picsum.photos/400/300?random=3",
        category: "Firebase",
        code: `import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';

// Veri ekleme
const addContent = async (data) => {
  const docRef = await addDoc(collection(db, 'contents'), {
    ...data,
    createdAt: serverTimestamp()
  });
  console.log('Document ID:', docRef.id);
};

// Real-time dinleme
const unsubscribe = onSnapshot(collection(db, 'contents'), (snapshot) => {
  const contents = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setContents(contents);
});`
      }
    ]

    const results = []
    
    for (const content of testContents) {
      console.log('🔥 Ekleniyor:', content.title)
      const id = await ContentService.addContent(content)
      results.push({ title: content.title, id, success: !!id })
    }

    const successCount = results.filter(r => r.success).length
    
    console.log('🔥 Test verisi ekleme tamamlandı:', successCount, '/', testContents.length)

    return NextResponse.json({
      success: true,
      message: `${successCount}/${testContents.length} test verisi başarıyla eklendi`,
      results
    })

  } catch (error) {
    console.error('🔥 Test verisi ekleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Test verisi eklenirken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}