'use client'

import { useState } from 'react'
import contents from '../public/data/contents.json'

type ContentItem = {
  id: number
  title: string
  description: string
  image: string
  category: string
  code?: string 
}

export default function ContentGallery() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [index, setIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>('Tümü')
  const [copied, setCopied] = useState(false)

  const sortedContents = contents.sort((a, b) => b.id - a.id)
  const categories = ['Tümü', ...new Set(sortedContents.map((c) => c.category))]

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
            <h3 className="text-3xl font-bold text-center">{selectedContent.title}</h3>

            {/* İçerik Görseli */}
            <img
              src={selectedContent.image}
              alt={selectedContent.title}
              className="max-h-[320px] mx-auto rounded-xl shadow object-contain bg-gradient-to-br from-blue-50 to-pink-50"
            />

            {/* Açıklama */}
            <p className="text-lg text-gray-700 text-center px-2">{selectedContent.description}</p>

            {/* Kod Alanı */}
            {selectedContent.code && selectedContent.code.trim() && (
              <div className="w-full mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-600">Kod Örneği:</span>
                  <button
                    className={`px-3 py-1 rounded bg-gray-200 hover:bg-blue-200 text-sm font-mono transition active:scale-95 relative`}
                    onClick={() => handleCopy(selectedContent.code!)}
                  >
                    {copied ? (
                      <span className="text-green-600 font-bold animate-pulse">Kopyalandı!</span>
                    ) : (
                      "Kopyala"
                    )}
                  </button>
                </div>
                <pre className="bg-gray-100 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono border border-gray-200 max-h-64">
                  <code>{selectedContent.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
