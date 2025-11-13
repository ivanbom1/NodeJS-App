import db from '../config/database.js'

class Recipe {
    static tableName = 'recipes'

    static createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                description TEXT,
                instructions TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `
        db.exec(sql)
        console.log(`✅ Table '${this.tableName}' created/verified`)
    }

    static createRecipeIngredientsTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS recipe_ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recipe_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                quantity REAL,
                unit TEXT,
                prep_time INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            )
        `
        db.exec(sql)
        console.log(`✅ Table 'recipe_ingredients' created/verified`)
    }

    static findAll() {
        const stmt = db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`)
        const recipes = stmt.all()

        return recipes.map(recipe => {
            const recipeWithIngredients = {
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                instructions: recipe.instructions,
                created_at: recipe.created_at,
                updated_at: recipe.updated_at,
                ingredients: this.getRecipeIngredients(recipe.id)
            }
            return recipeWithIngredients
        })
    }

    static findById(id) {
        const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
        const recipe = stmt.get(id)
        if (!recipe) return null
        
        return {
            ...recipe,
            ingredients: this.getRecipeIngredients(id)
        }
    }

    static create(recipeData) {
        const { name, description, instructions, ingredients } = recipeData
        const stmt = db.prepare(`
            INSERT INTO ${this.tableName} (name, description, instructions) 
            VALUES (?, ?, ?)
        `)
        const result = stmt.run(name, description || null, instructions || null)
        const recipeId = result.lastInsertRowid

        // Add ingredients if provided
        if (ingredients && Array.isArray(ingredients)) {
            ingredients.forEach(ingredient => {
                this.addIngredient(recipeId, ingredient)
            })
        }

        return this.findById(recipeId)
    }

    static update(id, recipeData) {
        const { name, description, instructions, ingredients } = recipeData
        const updates = []
        const values = []

        if (name !== undefined) {
            updates.push('name = ?')
            values.push(name)
        }
        if (description !== undefined) {
            updates.push('description = ?')
            values.push(description)
        }
        if (instructions !== undefined) {
            updates.push('instructions = ?')
            values.push(instructions)
        }

        updates.push('updated_at = CURRENT_TIMESTAMP')

        if (updates.length === 1 && !ingredients) {
            return this.findById(id)
        }

        if (updates.length > 1) {
            values.push(id)
            const stmt = db.prepare(`
                UPDATE ${this.tableName} 
                SET ${updates.join(', ')} 
                WHERE id = ?
            `)
            stmt.run(...values)
        }

        // Update ingredients if provided
        if (ingredients && Array.isArray(ingredients)) {
            this.clearRecipeIngredients(id)
            ingredients.forEach(ingredient => {
                this.addIngredient(id, ingredient)
            })
        }

        return this.findById(id)
    }

    static delete(id) {
        const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
        const result = stmt.run(id)
        return result.changes > 0
    }

    static count() {
        const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`)
        return stmt.get().count
    }

    static getRecipeIngredients(recipeId) {
        const stmt = db.prepare(`
            SELECT id, product_name, quantity, unit, prep_time 
            FROM recipe_ingredients 
            WHERE recipe_id = ?
            ORDER BY id
        `)
        return stmt.all(recipeId)
    }

    static addIngredient(recipeId, ingredient) {
        const { product_name, quantity, unit, prep_time } = ingredient
        const stmt = db.prepare(`
            INSERT INTO recipe_ingredients (recipe_id, product_name, quantity, unit, prep_time)
            VALUES (?, ?, ?, ?, ?)
        `)
        return stmt.run(recipeId, product_name, quantity || null, unit || null, prep_time || null)
    }

    static removeIngredient(recipeId, ingredientId) {
        const stmt = db.prepare(`
            DELETE FROM recipe_ingredients 
            WHERE id = ? AND recipe_id = ?
        `)
        return stmt.run(ingredientId, recipeId)
    }

    static clearRecipeIngredients(recipeId) {
        const stmt = db.prepare(`DELETE FROM recipe_ingredients WHERE recipe_id = ?`)
        return stmt.run(recipeId)
    }

    static seed() {
        const count = this.count()

        if (count === 0) {
            console.log('📝 Seeding recipes table...')

            const sampleRecipes = [
                {
                    name: 'Pasta Carbonara',
                    description: 'Classic Italian pasta',
                    instructions: 'Cook pasta, mix with eggs and bacon',
                    ingredients: [
                        { product_name: 'Pasta', quantity: 400, unit: 'g', prep_time: 5 },
                        { product_name: 'Eggs', quantity: 3, unit: 'pieces', prep_time: 2 },
                        { product_name: 'Bacon', quantity: 200, unit: 'g', prep_time: 10 }
                    ]
                },
                {
                    name: 'Tomato Soup',
                    description: 'Simple tomato soup',
                    instructions: 'Blend tomatoes with cream',
                    ingredients: [
                        { product_name: 'Tomatoes', quantity: 500, unit: 'g', prep_time: 15 },
                        { product_name: 'Cream', quantity: 200, unit: 'ml', prep_time: 3 }
                    ]
                }
            ]

            sampleRecipes.forEach(recipe => this.create(recipe))
            console.log(`✅ Seeded ${sampleRecipes.length} recipes`)
        }
    }
}

export default Recipe