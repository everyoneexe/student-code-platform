'use client'

import { useState, useEffect } from 'react'

type ContentItem = {
  id: number
  title: string
  description: string
  image: string
  category: string
  code: string
  createdAt: string
  updatedAt: string
}

export default function ContentGallery() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [index, setIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>('Tümü')
  const [copied, setCopied] = useState(false)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [categories, setCategories] = useState<string[]>(['Tümü'])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [codeModalContent, setCodeModalContent] = useState<ContentItem | null>(null)

  // İçerikleri API'den yükle
  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    try {
      const res = await fetch('/api/contents')
      if (res.ok) {
        const data = await res.json()
        setContents(data.data)
        const uniqueCategories = ['Tümü', ...new Set(data.data.map((c: ContentItem) => c.category))] as string[]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('İçerikler yüklenirken hata:', error)
    }
    setLoading(false)
  }

  const sortedContents = contents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

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
    setIndex(0) // kategori değişince slider başa dönsün
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/contents/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        // İçeriği listeden kaldır
        setContents(contents.filter(item => item.id !== id))
        setDeleteConfirm(null)
        
        // Eğer silinen içerik modal'da açıksa modal'ı kapat
        if (selectedContent && selectedContent.id === id) {
          setSelectedContent(null)
        }
      } else {
        alert('İçerik silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('İçerik silinirken hata oluştu')
    }
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Projeler</h2>

      {/* Kategori Butonları */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-blue-100 text-gray-700'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="absolute left-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 disabled:opacity-30"
        >
          ◀
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-12 transition-all duration-300 ease-in-out">
          {visibleContents.map((item) => (
            <div
              key={item.id}
              className="relative group bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all"
              onClick={() => setSelectedContent(item)}
            >
              {/* Silme Butonu */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteConfirm(item.id)
                }}
                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="İçeriği Sil"
              >
                ×
              </button>
              
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 rounded-b-2xl max-h-0 overflow-hidden group-hover:max-h-40 group-hover:p-4 transition-all duration-300 ease-in-out text-sm text-gray-700">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={index + itemsPerPage >= filteredContents.length}
          className="absolute right-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 disabled:opacity-30"
        >
          ▶
        </button>
      </div>

      {/* Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-[96vw] p-8 flex flex-col gap-6 animate-fade-in overflow-y-auto max-h-[90vh]">
            {/* Kapat Butonu */}
            <button
              onClick={() => setSelectedContent(null)}
              className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-red-400 transition"
              aria-label="Kapat"
            >
              ×
            </button>

            {/* Başlık */}
            <h3 className="text-3xl font-bold text-center break-words max-w-full overflow-hidden">{selectedContent.title}</h3>

            {/* İçerik Görseli */}
            <img
              src={selectedContent.image}
              alt={selectedContent.title}
              className="max-h-[320px] mx-auto rounded-xl shadow object-contain bg-gradient-to-br from-blue-50 to-pink-50"
            />

            {/* Açıklama */}
            <div className="max-h-32 overflow-y-auto text-lg text-gray-700 text-center px-2 break-words max-w-full border border-gray-200 rounded-lg p-3 bg-gray-50">
              {selectedContent.description}
            </div>

            {/* Kod Alanı */}
            {selectedContent.code && selectedContent.code.trim() && (
              <div className="w-full mt-4">
                <div className="flex items-center justify-center">
                  <button
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition active:scale-95 shadow-lg"
                    onClick={() => setCodeModalContent(selectedContent)}
                  >
                    📋 Kod Örneği Gör
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Silme Onay Modal'ı */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-[90vw] p-6">
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">İçeriği Sil</h3>
            <p className="text-gray-600 text-center mb-6">
              Bu içeriği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kod Modal'ı */}
      {codeModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-[96vw] p-8 flex flex-col gap-6 animate-fade-in overflow-y-auto max-h-[90vh]">
            {/* Kapat Butonu */}
            <button
              onClick={() => setCodeModalContent(null)}
              className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-red-400 transition"
              aria-label="Kapat"
            >
              ×
            </button>

            {/* Başlık */}
            <h3 className="text-2xl font-bold text-center text-gray-800 pr-8">
              📋 {codeModalContent.title} - Kod Örneği
            </h3>

            {/* Kod Alanı */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-600 text-lg">Kod:</span>
                <button
                  className={`px-4 py-2 rounded-lg bg-gray-200 hover:bg-blue-200 text-sm font-mono transition active:scale-95 relative shadow`}
                  onClick={() => handleCopy(codeModalContent.code!)}
                >
                  {copied ? (
                    <span className="text-green-600 font-bold animate-pulse">✅ Kopyalandı!</span>
                  ) : (
                    "📄 Kopyala"
                  )}
                </button>
              </div>
              <pre className="bg-gray-100 text-sm p-6 rounded-xl overflow-auto whitespace-pre-wrap font-mono border border-gray-300 max-h-96 break-words shadow-inner">
                <code className="break-words">{codeModalContent.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
