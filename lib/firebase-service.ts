import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from './firebase'

// Tip tanımlamaları
export interface ContentItem {
  id?: string
  title: string
  description: string
  image: string
  category: string
  code: string
  createdAt: any
  updatedAt: any
}

export interface Category {
  id?: string
  name: string
  createdAt: any
}

// İçerik yönetimi
export class ContentService {
  private static collection = 'contents'

  // Tüm içerikleri getir
  static async getAllContents(): Promise<ContentItem[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ContentItem))
    } catch (error) {
      console.error('İçerikler getirilirken hata:', error)
      return []
    }
  }

  // Kategoriye göre içerikleri getir
  static async getContentsByCategory(category: string): Promise<ContentItem[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ContentItem))
    } catch (error) {
      console.error('Kategori içerikleri getirilirken hata:', error)
      return []
    }
  }

  // Tek içerik getir
  static async getContentById(id: string): Promise<ContentItem | null> {
    try {
      const docRef = doc(db, this.collection, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ContentItem
      }
      return null
    } catch (error) {
      console.error('İçerik getirilirken hata:', error)
      return null
    }
  }

  // Yeni içerik ekle
  static async addContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('İçerik eklenirken hata:', error)
      return null
    }
  }

  // İçerik güncelle
  static async updateContent(id: string, updates: Partial<ContentItem>): Promise<boolean> {
    try {
      const docRef = doc(db, this.collection, id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('İçerik güncellenirken hata:', error)
      return false
    }
  }

  // İçerik sil
  static async deleteContent(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.collection, id))
      return true
    } catch (error) {
      console.error('İçerik silinirken hata:', error)
      return false
    }
  }

  // Son eklenen içerikleri getir
  static async getRecentContents(limitCount: number = 5): Promise<ContentItem[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ContentItem))
    } catch (error) {
      console.error('Son içerikler getirilirken hata:', error)
      return []
    }
  }
}

// Kategori yönetimi
export class CategoryService {
  private static collection = 'categories'

  // Tüm kategorileri getir
  static async getAllCategories(): Promise<Category[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('name', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category))
    } catch (error) {
      console.error('Kategoriler getirilirken hata:', error)
      return []
    }
  }

  // Yeni kategori ekle
  static async addCategory(name: string): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        name,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Kategori eklenirken hata:', error)
      return null
    }
  }

  // Kategori istatistiklerini getir
  static async getCategoryStats(): Promise<{name: string, count: number}[]> {
    try {
      const contents = await ContentService.getAllContents()
      const categories = await this.getAllCategories()
      
      return categories.map(cat => ({
        name: cat.name,
        count: contents.filter(content => content.category === cat.name).length
      }))
    } catch (error) {
      console.error('Kategori istatistikleri getirilirken hata:', error)
      return []
    }
  }
}

// Görsel yönetimi
export class StorageService {
  // Görsel yükle
  static async uploadImage(file: File, path: string): Promise<string | null> {
    try {
      const storageRef = ref(storage, `images/${path}/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Görsel yüklenirken hata:', error)
      return null
    }
  }

  // Görsel sil
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const imageRef = ref(storage, imageUrl)
      await deleteObject(imageRef)
      return true
    } catch (error) {
      console.error('Görsel silinirken hata:', error)
      return false
    }
  }
}

// İstatistik servisi
export class StatsService {
  static async getStats() {
    try {
      const [contents, categories, categoryStats] = await Promise.all([
        ContentService.getAllContents(),
        CategoryService.getAllCategories(),
        CategoryService.getCategoryStats()
      ])

      const recentContents = await ContentService.getRecentContents(5)

      return {
        totalContents: contents.length,
        totalCategories: categories.length,
        recentContents,
        categoryStats
      }
    } catch (error) {
      console.error('İstatistikler getirilirken hata:', error)
      return {
        totalContents: 0,
        totalCategories: 0,
        recentContents: [],
        categoryStats: []
      }
    }
  }
}