import { NextResponse } from 'next/server'
import { dataStore } from '../../../lib/data-store'

// GET - İstatistikleri getir
export async function GET() {
  try {
    const stats = dataStore.getStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'İstatistikler getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}