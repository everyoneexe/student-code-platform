'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalContents: number
  totalCategories: number
  recentContents: any[]
  categoryStats: { name: string; count: number }[]
}

interface ContentItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  code: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [editMode, setEditMode] = useState(false)

  const correctPassword = 'oguzhan2025'

  const handleLogin = () => {
    if (password === correctPassword) {
      setAuthenticated(true)
      loadDashboard()
    } else {
      alert('Yanlış şifre!')
    }
  }

  const loadDashboard = async () => {
    setLoading(true)
    try {
      // İstatistikleri yükle
      const statsRes = await fetch('/api/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data)
      }

      // İçerikleri yükle
      const contentsRes = await fetch('/api/contents')
      if (contentsRes.ok) {
        const contentsData = await contentsRes.json()
        setContents(contentsData.data)
      }
    } catch (error) {
      console.error('Dashboard yüklenirken hata:', error)
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu içeriği silmek istediğinizden emin misiniz?')) return

    try {
      const res = await fetch(`/api/contents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setContents(contents.filter(c => c.id !== id))
        alert('İçerik silindi!')
      } else {
        alert('Silme işleminde hata oluştu!')
      }
    } catch (error) {
      alert('Silme işleminde hata oluştu!')
    }
  }

  const handleEdit = (content: ContentItem) => {
    setSelectedContent(content)
    setEditMode(true)
  }

  const handleUpdate = async (updatedContent: ContentItem) => {
    try {
      const res = await fetch(`/api/contents/${updatedContent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent)
      })
      
      if (res.ok) {
        const data = await res.json()
        setContents(contents.map(c => c.id === updatedContent.id ? data.data : c))
        setEditMode(false)
        setSelectedContent(null)
        alert('İçerik güncellendi!')
      } else {
        alert('Güncelleme işleminde hata oluştu!')
      }
    } catch (error) {
      alert('Güncelleme işleminde hata oluştu!')
    }
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Giriş Yapın</h2>
          <input
            type="password"
            placeholder="Şifre"
            className="p-3 border rounded-lg mb-4 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* İstatistikler */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">Toplam İçerik</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalContents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">Toplam Kategori</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalCategories}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">En Popüler Kategori</h3>
              <p className="text-lg font-bold text-purple-600">
                {stats.categoryStats.length > 0 
                  ? stats.categoryStats.sort((a, b) => b.count - a.count)[0].name
                  : 'Yok'
                }
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">Son Eklenen</h3>
              <p className="text-lg font-bold text-orange-600">
                {stats.recentContents.length > 0 
                  ? new Date(stats.recentContents[0].createdAt).toLocaleDateString('tr-TR')
                  : 'Yok'
                }
              </p>
            </div>
          </div>
        )}

        {/* Kategori İstatistikleri */}
        {stats && stats.categoryStats.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Kategori İstatistikleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.categoryStats.map((cat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-2xl font-bold text-blue-600">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İçerik Yönetimi */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">İçerik Yönetimi</h2>
              <a 
                href="/admin" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Yeni İçerik Ekle
              </a>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oluşturulma</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{content.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{content.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{content.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(content)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Düzenleme Modal */}
        {editMode && selectedContent && (
          <EditModal
            content={selectedContent}
            onSave={handleUpdate}
            onCancel={() => { setEditMode(false); setSelectedContent(null) }}
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
}

function EditModal({ content, onSave, onCancel }: EditModalProps) {
  const [formData, setFormData] = useState(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">İçerik Düzenle</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Başlık"
            className="w-full p-3 border rounded-lg"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Açıklama"
            className="w-full p-3 border rounded-lg h-24"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Görsel URL"
            className="w-full p-3 border rounded-lg"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="Arduino">Arduino</option>
            <option value="Python">Python</option>
            <option value="Devre">Devre</option>
            <option value="Scratch">Scratch</option>
            <option value="Diğer">Diğer</option>
          </select>
          <textarea
            placeholder="Kod örneği"
            className="w-full p-3 border rounded-lg h-32 font-mono text-sm"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}