'use client'

import { useState, useEffect } from 'react'
import { ContentService } from '../lib/firebase-service'
import toast, { Toaster } from 'react-hot-toast'

interface ContentItem {
  id?: string
  title: string
  description: string
  image: string
  category: string
  code: string
  createdAt: any
  updatedAt: any
}

export default function FirebaseContentGallery() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [index, setIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>('Tümü')
  const [copied, setCopied] = useState(false)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [categories, setCategories] = useState<string[]>(['Tümü'])
  const [loading, setLoading] = useState(true)

  // Firebase'den içerikleri yükle
  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    setLoading(true)
    try {
      const data = await ContentService.getAllContents()
      setContents(data)
      const uniqueCategories = ['Tümü', ...new Set(data.map((c: ContentItem) => c.category))]
      setCategories(uniqueCategories)
      toast.success('İçerikler yüklendi! 🔥')
    } catch (error) {
      console.error('İçerikler yüklenirken hata:', error)
      toast.error('İçerikler yüklenirken hata oluştu!')
    }
    setLoading(false)
  }

  const sortedContents = contents.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })

  const filteredContents =
    activeCategory === 'Tümü'
      ? sortedContents
      : sortedContents.filter((item) => item.category === activeCategory)

  const itemsPerPage = 3
  const visibleContents = filteredContents.slice(index, index + itemsPerPage)

  const handleNext = () => {
    if (index + itemsPerPage < filteredContents.length) {
      setIndex(index + itemsPerPage)
    }
  }

  const handlePrev = () => {
    if (index - itemsPerPage >= 0) {
      setIndex(index - itemsPerPage)
    }
  }

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat)
    setIndex(0)
    toast(`${cat} kategorisi seçildi`, { icon: '📂' })
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
    toast.success('Kod kopyalandı! 📋')
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto p-6">
        <Toaster position="top-right" />
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4">🔥 Firebase'den yükleniyor...</h2>
          <p className="text-gray-600">Gerçek zamanlı veriler getiriliyor</p>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🔥 Firebase Projeler
        </h2>
        <p className="text-gray-600">Real-time Firestore Database ile güçlendirilmiştir</p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🟢 Live
          </span>
          <span className="text-sm text-gray-500">{contents.length} proje</span>
        </div>
      </div>

      {/* Kategori Butonları */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all transform hover:scale-105 shadow-lg ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl'
                : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {cat === 'Tümü' ? '🔥 ' + cat : cat}
          </button>
        ))}
      </div>

      {/* Proje Grid */}
      <div className="relative flex items-center justify-center">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="absolute left-0 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 disabled:opacity-30 transition-all transform hover:scale-110"
        >
          ◀
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-16 transition-all duration-500 ease-in-out">
          {visibleContents.map((item) => (
            <div
              key={item.id}
              className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 border border-gray-100"
              onClick={() => setSelectedContent(item)}
            >
              {/* Firebase Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  🔥 Firebase
                </span>
              </div>
              
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.jpg'
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.category}
                  </span>
                  <span>•</span>
                  <span>
                    {item.createdAt?.toDate ? 
                      item.createdAt.toDate().toLocaleDateString('tr-TR') : 
                      'Bilinmeyen tarih'
                    }
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-4 rounded-b-2xl max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-300 ease-in-out text-sm text-gray-700">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={index + itemsPerPage >= filteredContents.length}
          className="absolute right-0 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 disabled:opacity-30 transition-all transform hover:scale-110"
        >
          ▶
        </button>
      </div>

      {/* Sayfalama Bilgisi */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          {Math.min(index + itemsPerPage, filteredContents.length)} / {filteredContents.length} proje gösteriliyor
        </p>
      </div>

      {/* Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-[96vw] p-8 flex flex-col gap-6 animate-fade-in overflow-y-auto max-h-[90vh]">
            {/* Firebase Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                🔥 Firebase Firestore
              </span>
            </div>
            
            {/* Kapat Butonu */}
            <button
              onClick={() => setSelectedContent(null)}
              className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-red-400 transition transform hover:scale-110"
              aria-label="Kapat"
            >
              ×
            </button>

            {/* Başlık */}
            <h3 className="text-4xl font-bold text-center pt-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {selectedContent.title}
            </h3>

            {/* Kategori ve Tarih */}
            <div className="flex justify-center items-center gap-4 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                📂 {selectedContent.category}
              </span>
              <span className="text-gray-500">
                🕒 {selectedContent.createdAt?.toDate ? 
                  selectedContent.createdAt.toDate().toLocaleString('tr-TR') : 
                  'Bilinmeyen tarih'
                }
              </span>
              {selectedContent.updatedAt && selectedContent.updatedAt !== selectedContent.createdAt && (
                <span className="text-gray-500">
                  ✏️ Güncellendi: {selectedContent.updatedAt.toDate().toLocaleDateString('tr-TR')}
                </span>
              )}
            </div>

            {/* İçerik Görseli */}
            <img
              src={selectedContent.image}
              alt={selectedContent.title}
              className="max-h-[400px] mx-auto rounded-xl shadow-lg object-contain bg-gradient-to-br from-blue-50 to-purple-50 p-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg'
              }}
            />

            {/* Açıklama */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">📝 Açıklama:</h4>
              <p className="text-lg text-gray-700 leading-relaxed">{selectedContent.description}</p>
            </div>

            {/* Kod Alanı */}
            {selectedContent.code && selectedContent.code.trim() && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    💻 Kod Örneği:
                  </h4>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg ${
                      copied 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                    }`}
                    onClick={() => handleCopy(selectedContent.code!)}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2">
                        ✅ Kopyalandı!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        📋 Kopyala
                      </span>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 text-sm p-6 rounded-xl overflow-x-auto whitespace-pre-wrap font-mono border-2 border-gray-700 max-h-96 shadow-inner">
                  <code>{selectedContent.code}</code>
                </pre>
              </div>
            )}

            {/* Firebase ID */}
            <div className="text-center text-xs text-gray-400">
              Firebase ID: {selectedContent.id}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}