import { NextRequest, NextResponse } from 'next/server'
import { dataStore } from '../../../lib/data-store'

type NewContent = {
  title: string
  description: string
  image: string
  category: string
  code?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, image, category, code } = body as NewContent

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Başlık, açıklama ve kategori gereklidir' },
        { status: 400 }
      )
    }

    // Eğer resim seçilmemişse varsayılan resim kullan
    const finalImage = image || '/default.jpg'

    const newContent = dataStore.addContent({
      title,
      description,
      image: finalImage,
      category,
      code: code || ''
    })

    return NextResponse.json({ success: true, content: newContent })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}
