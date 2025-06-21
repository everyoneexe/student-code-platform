import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const fileName = Date.now() + '-' + file.name.replace(/\s+/g, '-')
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return NextResponse.json({ success: true, path: `/uploads/${fileName}` })
}
