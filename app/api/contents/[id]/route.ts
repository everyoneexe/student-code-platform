import { NextRequest, NextResponse } from 'next/server'
import { dataStore } from '../../../../lib/data-store'

// GET - Tekil içerik getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const content = dataStore.getContentById(id)
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'İçerik bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: content
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'İçerik getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - İçerik güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const body = await request.json()
    const { title, description, image, category, code } = body
    
    const updatedContent = dataStore.updateContent(id, {
      title,
      description,
      image,
      category,
      code
    })
    
    if (!updatedContent) {
      return NextResponse.json(
        { success: false, error: 'İçerik bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedContent
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'İçerik güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - İçerik sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const deleted = dataStore.deleteContent(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'İçerik bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'İçerik başarıyla silindi'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'İçerik silinirken hata oluştu' },
      { status: 500 }
    )
  }
}