import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbPath
if (path.isAbsolute(config.databaseUrl)) {
    dbPath = config.databaseUrl
} else {
    dbPath = path.join(__dirname, '../../', config.databaseUrl)
}

console.log(`📊 Database path: ${dbPath}`)

const db = new Database(dbPath)

db.pragma('foreign_keys = ON')

export const initializeDatabase = async () => {
    console.log('🔧 Initializing database...')
    
    try {

        const User = (await import('../models/User.js')).default
        const Recipe = (await import('../models/Recipe.js')).default
        
        User.createTable()
        Recipe.createTable()
        Recipe.createRecipeIngredientsTable()
        
        if (config.isDevelopment()) {
            console.log('🌱 Starting seeds...')
            User.seed()
            console.log('✅ User seed complete')
            Recipe.seed()
            console.log('✅ Recipe seed complete')
        } else {
            console.log('⏭️ Skipping seeds (not in development)')
        }
        
        console.log('✅ Database initialization complete')
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message)
        console.error(error)
        throw error
    }
}

export default db