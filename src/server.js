import express from "express"
import config from "./config/config.js"  // Import config
import { logMiddleware } from "./middleware/logger.js"
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js"  // Import API key middleware
import userRoutes from "./routes/userRoutes.js"
import recipeRoutes from "./routes/recipeRoutes.js"
import { initializeDatabase } from "./config/database.js"

const app = express()

await initializeDatabase()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logMiddleware)

app.get('/', (req, res) => {
    res.json({ 
        message: "Welcome to the API",
        version: "1.0.0",
        environment: config.nodeEnv,
        endpoints: {
            users: "/users",
            recipes: "/recipes"
        }
    })
})

// Health check (useful for Render)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    })
})

// Protected routes (API key required)
// Option 1: Protect all routes
app.use('/users', validateApiKey, userRoutes)
app.use('/recipes', recipeRoutes)

// Option 2: Only protect in production (easier for development)
// app.use('/users', validateApiKeyProduction, userRoutes)
// app.use('/recipes', validateApiKeyProduction, recipeRoutes)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found` 
    })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(config.isDevelopment() && { stack: err.stack })
    })
})

app.listen(config.port, () => {
    console.log(`✅ Server running on http://localhost:${config.port}`)
    console.log(`📊 Environment: ${config.nodeEnv}`)
    console.log(`🔒 API Key protection: ${config.apiKey ? 'ENABLED' : 'DISABLED'}`)
    console.log(`\nAPI Endpoints:`)
    console.log(`  GET    /              - Welcome message (public)`)
    console.log(`  GET    /health        - Health check (public)`)
    console.log(`  GET    /users         - Get all users (protected)`)
    console.log(`  GET    /users/:id     - Get user by ID (protected)`)
    console.log(`  POST   /users         - Create new user (protected)`)
    console.log(`  PUT    /users/:id     - Update user (protected)`)
    console.log(`  DELETE /users/:id     - Delete user (protected)`)
    console.log(`  GET    /recipes       - Get all recipes (protected)`)
    console.log(`  GET    /recipes/:id   - Get recipe by ID (protected)`)
    console.log(`  POST   /recipes       - Create new recipe (protected)`)
    console.log(`  PUT    /recipes/:id   - Update recipe (protected)`)
    console.log(`  DELETE /recipes/:id   - Delete recipe (protected)`)
    console.log(`  POST   /recipes/:id/ingredients      - Add ingredient (protected)`)
    console.log(`  DELETE /recipes/:id/ingredients      - Remove ingredient (protected)`)
})

export default app