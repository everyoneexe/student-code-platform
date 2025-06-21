import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'contents.json')

type NewContent = {
  title: string
  description: string
  image: string
  category: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, image, category } = body as NewContent

    const file = fs.readFileSync(DATA_PATH, 'utf-8')
    const contents = JSON.parse(file)

    const newId = Math.max(...contents.map((c: any) => c.id ?? 0)) + 1

    const newContent = {
  id: newId,
  title,
  description,
  image,
  category,
  code: body.code || '',
}


    contents.push(newContent)
    fs.writeFileSync(DATA_PATH, JSON.stringify(contents, null, 2))

    return NextResponse.json({ success: true, content: newContent })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}
