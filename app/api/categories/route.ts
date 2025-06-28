import { NextRequest, NextResponse } from 'next/server'
import { dataStore } from '../../../lib/data-store'

// GET - Tüm kategorileri getir
export async function GET() {
  try {
    const categories = dataStore.getCategories()
    
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kategoriler getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni kategori ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Kategori adı gerekli' },
        { status: 400 }
      )
    }
    
    const newCategory = dataStore.addCategory(name)
    
    return NextResponse.json({
      success: true,
      data: newCategory
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kategori eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}