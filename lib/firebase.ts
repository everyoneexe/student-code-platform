import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB5KB4m6uECHtdbuYDiaXNJYRHQrMbQ9es",
  authDomain: "ders-87307.firebaseapp.com",
  projectId: "ders-87307",
  storageBucket: "ders-87307.firebasestorage.app",
  messagingSenderId: "534083096279",
  appId: "1:534083096279:web:d64e23adb17b128b54ea92"
}

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig)

// Firebase servislerini export et
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export default app