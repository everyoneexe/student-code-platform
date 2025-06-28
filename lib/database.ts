import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'data', 'ders-takip.db'))

// Tabloları oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    code TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Varsayılan kategorileri ekle
const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)')
const categories = ['Arduino', 'Python', 'Devre', 'Scratch', 'Diğer']
categories.forEach(cat => insertCategory.run(cat))

// Prepared statements
export const statements = {
  // Contents
  getAllContents: db.prepare('SELECT * FROM contents ORDER BY created_at DESC'),
  getContentById: db.prepare('SELECT * FROM contents WHERE id = ?'),
  getContentsByCategory: db.prepare('SELECT * FROM contents WHERE category = ? ORDER BY created_at DESC'),
  insertContent: db.prepare(`
    INSERT INTO contents (title, description, image, category, code) 
    VALUES (?, ?, ?, ?, ?)
  `),
  updateContent: db.prepare(`
    UPDATE contents 
    SET title = ?, description = ?, image = ?, category = ?, code = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `),
  deleteContent: db.prepare('DELETE FROM contents WHERE id = ?'),
  
  // Categories
  getAllCategories: db.prepare('SELECT * FROM categories ORDER BY name'),
  insertCategory: db.prepare('INSERT INTO categories (name) VALUES (?)'),
  
  // Users
  getUserByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  insertUser: db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)'),
}

// Veritabanı kapanışında bağlantıyı kapat
process.on('exit', () => db.close())
process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

export default db