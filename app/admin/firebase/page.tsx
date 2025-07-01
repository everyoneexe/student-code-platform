'use client'

import { useState, useEffect } from 'react'
import { ContentService, CategoryService, StatsService, StorageService } from '../../../lib/firebase-service'
import toast, { Toaster } from 'react-hot-toast'

interface ContentItem {
  id?: string
  title: string
  description: string
  photoUrl: string
  category: string
  code: string
  createdAt: any
  updatedAt: any
}

interface Stats {
  totalContents: number
  totalCategories: number
  recentContents: ContentItem[]
  categoryStats: { name: string; count: number }[]
}

export default function FirebaseAdminPanel() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photoUrl: '',
    category: 'Arduino',
    code: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const correctPassword = 'oguzhan2025'

  const handleLogin = () => {
    if (password === correctPassword) {
      setAuthenticated(true)
      loadDashboard()
      toast.success('Giriş başarılı!')
    } else {
      toast.error('Yanlış şifre!')
    }
  }

  const loadDashboard = async () => {
    setLoading(true)
    toast.loading('Veriler yükleniyor...')
    
    try {
      // Paralel olarak tüm verileri yükle
      const [statsData, contentsData, categoriesData] = await Promise.all([
        StatsService.getStats(),
        ContentService.getAllContents(),
        CategoryService.getAllCategories()
      ])

      setStats(statsData)
      setContents(contentsData)
      setCategories(['Arduino', 'Python', 'Devre', 'Scratch', 'Diğer']) // Default kategoriler
      toast.dismiss()
      toast.success('Veriler yüklendi!')
    } catch (error) {
      toast.dismiss()
      toast.error('Veriler yüklenirken hata oluştu!')
      console.error('Dashboard yüklenirken hata:', error)
    }
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    toast.loading('İçerik ekleniyor...')

    try {
      let imagePath = formData.photoUrl

      // Görsel upload varsa önce onu yükle
      if (selectedFile) {
        const uploadedUrl = await StorageService.uploadImage(selectedFile, 'contents')
        if (uploadedUrl) {
          imagePath = uploadedUrl
        } else {
          toast.dismiss()
          toast.error('Görsel yüklenemedi!')
          setLoading(false)
          return
        }
      }

      // İçerik ekle
      const contentId = await ContentService.addContent({
        ...formData,
        photoUrl: imagePath
      })

      if (contentId) {
        toast.dismiss()
        toast.success('İçerik başarıyla eklendi!')
        
        // Formu temizle
        setFormData({
          title: '',
          description: '',
          photoUrl: '',
          category: 'Arduino',
          code: '',
        })
        setSelectedFile(null)
        setImagePreview(null)
        setShowAddForm(false)
        
        // Verileri yenile
        loadDashboard()
      } else {
        toast.dismiss()
        toast.error('İçerik eklenirken hata oluştu!')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('İçerik eklenirken hata oluştu!')
      console.error('İçerik ekleme hatası:', error)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu içeriği silmek istediğinizden emin misiniz?')) return

    toast.loading('İçerik siliniyor...')
    
    try {
      const success = await ContentService.deleteContent(id)
      if (success) {
        setContents(contents.filter(c => c.id !== id))
        toast.dismiss()
        toast.success('İçerik silindi!')
        loadDashboard() // İstatistikleri güncelle
      } else {
        toast.dismiss()
        toast.error('Silme işleminde hata oluştu!')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Silme işleminde hata oluştu!')
    }
  }

  const handleEdit = (content: ContentItem) => {
    setSelectedContent(content)
    setEditMode(true)
  }

  const handleUpdate = async (updatedContent: ContentItem) => {
    if (!updatedContent.id) return

    toast.loading('İçerik güncelleniyor...')
    
    try {
      const success = await ContentService.updateContent(updatedContent.id, updatedContent)
      
      if (success) {
        setContents(contents.map(c => c.id === updatedContent.id ? updatedContent : c))
        setEditMode(false)
        setSelectedContent(null)
        toast.dismiss()
        toast.success('İçerik güncellendi!')
        loadDashboard()
      } else {
        toast.dismiss()
        toast.error('Güncelleme işleminde hata oluştu!')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Güncelleme işleminde hata oluştu!')
    }
  }

  // Test verileri ekleme fonksiyonu
  const addTestData = async () => {
    if (!confirm('Test verileri eklensin mi? Bu işlem 3 adet örnek proje ekleyecek.')) return

    setLoading(true)
    toast.loading('Test verileri ekleniyor...')

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

    try {
      let successCount = 0
      for (const content of testContents) {
        const id = await ContentService.addContent(content)
        if (id) successCount++
      }

      toast.dismiss()
      if (successCount === testContents.length) {
        toast.success(`${successCount} test verisi başarıyla eklendi! 🎉`)
        loadDashboard() // Verileri yenile
      } else {
        toast.error(`Sadece ${successCount}/${testContents.length} veri eklenebildi.`)
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Test verileri eklenirken hata oluştu!')
      console.error('Test veri ekleme hatası:', error)
    }
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
        <Toaster position="top-right" />
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🔥 Firebase Admin</h1>
          <h2 className="text-xl font-semibold mb-4 text-gray-600">Giriş Yapın</h2>
          <input
            type="password"
            placeholder="Şifre"
            className="p-3 border rounded-lg mb-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg w-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            🚀 Giriş Yap
          </button>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Firebase Backend ile güçlendirilmiştir 🔥
          </div>
        </div>
      </div>
    )
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-xl mt-4">Firebase'den veriler yükleniyor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">🔥 Firebase Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time veri yönetimi</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ➕ Yeni İçerik
            </button>
            <button
              onClick={addTestData}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              🧪 Test Verisi
            </button>
            <button
              onClick={loadDashboard}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Yenile
            </button>
          </div>
        </div>

        {/* İstatistikler */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold">📚 Toplam İçerik</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalContents}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold">🏷️ Kategoriler</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalCategories}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold">⭐ En Popüler</h3>
              <p className="text-lg font-bold mt-2">
                {stats.categoryStats.length > 0 
                  ? stats.categoryStats.sort((a, b) => b.count - a.count)[0].name
                  : 'Yok'
                }
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold">🕒 Son Aktivite</h3>
              <p className="text-sm font-bold mt-2">
                {stats.recentContents.length > 0 
                  ? 'Az önce güncellendi'
                  : 'Yok'
                }
              </p>
            </div>
          </div>
        )}

        {/* Kategori İstatistikleri */}
        {stats && stats.categoryStats.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">📊 Kategori Dağılımı</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.categoryStats.map((cat, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                  <p className="font-semibold text-gray-700">{cat.name}</p>
                  <p className="text-3xl font-bold text-blue-600">{cat.count}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${(cat.count / Math.max(...stats.categoryStats.map(c => c.count))) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İçerik Tablosu */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800">📋 İçerik Yönetimi</h2>
            <p className="text-gray-600">Firebase Firestore ile gerçek zamanlı</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contents.map((content, index) => (
                  <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">#{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{content.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {content.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🔥 Aktif
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(content)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        ✏️ Düzenle
                      </button>
                      <button
                        onClick={() => content.id && handleDelete(content.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        🗑️ Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* İçerik Ekleme Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">➕ Yeni İçerik Ekle</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Başlık"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Açıklama"
                  className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg"
                />
                {imagePreview && <img src={imagePreview} className="w-full h-48 object-contain rounded-lg" />}
                <textarea
                  placeholder="Kod örneği (isteğe bağlı)"
                  className="w-full p-3 border rounded-lg h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? '⏳ Ekleniyor...' : '✅ Ekle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    ❌ İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Düzenleme Modal */}
        {editMode && selectedContent && (
          <EditModal
            content={selectedContent}
            onSave={handleUpdate}
            onCancel={() => { setEditMode(false); setSelectedContent(null) }}
            categories={categories}
          />
        )}
      </div>
    </div>
  )
}

// Düzenleme Modal Komponenti
interface EditModalProps {
  content: ContentItem
  onSave: (content: ContentItem) => void
  onCancel: () => void
  categories: string[]
}

function EditModal({ content, onSave, onCancel, categories }: EditModalProps) {
  const [formData, setFormData] = useState(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">✏️ İçerik Düzenle</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Başlık"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Açıklama"
            className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Görsel URL"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.photoUrl}
            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            placeholder="Kod örneği"
            className="w-full p-3 border rounded-lg h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              💾 Kaydet
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              ❌ İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}