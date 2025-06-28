import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "ders-takip-xxxx.firebaseapp.com",
  projectId: "ders-takip-xxxx",
  storageBucket: "ders-takip-xxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
}

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig)

// Firebase servislerini export et
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export default app