import fs from 'fs'
import path from 'path'

export interface ContentItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  code: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  contentCount?: number
}

export interface User {
  id: number
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

class DataStore {
  private contentsPath: string
  private categoriesPath: string
  private usersPath: string
  private dataDir: string

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data')
    this.contentsPath = path.join(this.dataDir, 'contents.json')
    this.categoriesPath = path.join(this.dataDir, 'categories.json')
    this.usersPath = path.join(this.dataDir, 'users.json')
    
    this.initializeDataDir()
    this.initializeFiles()
  }

  private initializeDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true })
    }
  }

  private initializeFiles() {
    // Contents dosyası
    if (!fs.existsSync(this.contentsPath)) {
      this.writeContents([])
    }

    // Categories dosyası
    if (!fs.existsSync(this.categoriesPath)) {
      const defaultCategories: Category[] = [
        { id: 1, name: 'Arduino' },
        { id: 2, name: 'Python' },
        { id: 3, name: 'Devre' },
        { id: 4, name: 'Scratch' },
        { id: 5, name: 'Diğer' }
      ]
      this.writeCategories(defaultCategories)
    }

    // Users dosyası
    if (!fs.existsSync(this.usersPath)) {
      const defaultUsers: User[] = [
        {
          id: 1,
          username: 'admin',
          password: 'oguzhan2025', // Gerçek uygulamada hash'lenmiş olmalı
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ]
      this.writeUsers(defaultUsers)
    }
  }

  // Contents işlemleri
  getContents(): ContentItem[] {
    try {
      const data = fs.readFileSync(this.contentsPath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  private writeContents(contents: ContentItem[]): void {
    fs.writeFileSync(this.contentsPath, JSON.stringify(contents, null, 2))
  }

  addContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem {
    const contents = this.getContents()
    const newId = contents.length > 0 ? Math.max(...contents.map(c => c.id)) + 1 : 1
    const now = new Date().toISOString()
    
    const newContent: ContentItem = {
      ...content,
      id: newId,
      createdAt: now,
      updatedAt: now
    }
    
    contents.push(newContent)
    this.writeContents(contents)
    return newContent
  }

  updateContent(id: number, updates: Partial<Omit<ContentItem, 'id' | 'createdAt'>>): ContentItem | null {
    const contents = this.getContents()
    const index = contents.findIndex(c => c.id === id)
    
    if (index === -1) return null
    
    contents[index] = {
      ...contents[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.writeContents(contents)
    return contents[index]
  }

  deleteContent(id: number): boolean {
    const contents = this.getContents()
    const filteredContents = contents.filter(c => c.id !== id)
    
    if (filteredContents.length === contents.length) return false
    
    this.writeContents(filteredContents)
    return true
  }

  getContentById(id: number): ContentItem | null {
    const contents = this.getContents()
    return contents.find(c => c.id === id) || null
  }

  getContentsByCategory(category: string): ContentItem[] {
    const contents = this.getContents()
    return contents.filter(c => c.category === category)
  }

  // Categories işlemleri
  getCategories(): Category[] {
    try {
      const data = fs.readFileSync(this.categoriesPath, 'utf-8')
      const categories = JSON.parse(data)
      
      // Her kategorinin kaç içeriği olduğunu hesapla
      const contents = this.getContents()
      return categories.map((cat: Category) => ({
        ...cat,
        contentCount: contents.filter(c => c.category === cat.name).length
      }))
    } catch {
      return []
    }
  }

  private writeCategories(categories: Category[]): void {
    fs.writeFileSync(this.categoriesPath, JSON.stringify(categories, null, 2))
  }

  addCategory(name: string): Category {
    const categories = this.getCategories()
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1
    
    const newCategory: Category = {
      id: newId,
      name: name.trim()
    }
    
    categories.push(newCategory)
    this.writeCategories(categories)
    return newCategory
  }

  // Users işlemleri  
  getUsers(): User[] {
    try {
      const data = fs.readFileSync(this.usersPath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  private writeUsers(users: User[]): void {
    fs.writeFileSync(this.usersPath, JSON.stringify(users, null, 2))
  }

  getUserByUsername(username: string): User | null {
    const users = this.getUsers()
    return users.find(u => u.username === username) || null
  }

  addUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers()
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
    
    const newUser: User = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    this.writeUsers(users)
    return newUser
  }

  // İstatistikler
  getStats() {
    const contents = this.getContents()
    const categories = this.getCategories()
    
    return {
      totalContents: contents.length,
      totalCategories: categories.length,
      recentContents: contents
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
      categoryStats: categories.map(cat => ({
        name: cat.name,
        count: contents.filter(c => c.category === cat.name).length
      }))
    }
  }
}

export const dataStore = new DataStore()