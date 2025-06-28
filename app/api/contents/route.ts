import { NextRequest, NextResponse } from 'next/server'
import { dataStore } from '../../../lib/data-store'

// GET - Tüm içerikleri getir
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    
    let contents
    if (category && category !== 'Tümü') {
      contents = dataStore.getContentsByCategory(category)
    } else {
      contents = dataStore.getContents()
    }
    
    return NextResponse.json({
      success: true,
      data: contents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'İçerikler getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni içerik ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image, category, code } = body
    
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
    
    return NextResponse.json({
      success: true,
      data: newContent
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'İçerik eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}