'use client'

import { useState, ChangeEvent } from 'react'

const categories = ['Arduino', 'Python', 'Devre', 'Scratch', 'Diğer']

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Arduino',
    code: '',
  })

  const correctPassword = 'oguzhan2025'

  const handleLogin = () => {
    if (password === correctPassword) setAuthenticated(true)
    else alert('Yanlış şifre!')
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let imagePath = formData.image

    // Görsel upload varsa önce onu yükle
    if (selectedFile) {
      const body = new FormData()
      body.append('file', selectedFile)

      const uploadRes = await fetch('/api/upload-image', {
        method: 'POST',
        body,
      })

      const uploadData = await uploadRes.json()
      if (uploadData.success) {
        imagePath = uploadData.path
      } else {
        alert('Görsel yüklenemedi!')
        return
      }
    }

    const res = await fetch('/api/add-content', {
      method: 'POST',
      body: JSON.stringify({ ...formData, image: imagePath }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    if (data.success) {
      alert('İçerik eklendi!')
      setFormData({
        title: '',
        description: '',
        image: '',
        category: 'Arduino',
        code: '',
      })
      setSelectedFile(null)
      setImagePreview(null)
    } else {
      alert('Hata oluştu.')
    }
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Girişi</h1>
        <input
          type="password"
          placeholder="Şifre"
          className="p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
          Giriş Yap
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Yeni İçerik Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Başlık"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Açıklama"
          className="w-full p-2 border rounded"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
        {imagePreview && <img src={imagePreview} className="w-full h-48 object-contain" />}
        <textarea
          placeholder="Kod örneği (isteğe bağlı)"
          className="w-full p-2 border rounded font-mono text-sm"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Ekle
        </button>
      </form>
    </div>
  )
}
