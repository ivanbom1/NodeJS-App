import Recipe from '../models/Recipe.js'

export const getAllrecipes = () => {
    return Recipe.findAll()
}

export const getRecipeById = (id) => {
    return Recipe.findById(id)
}

export const createRecipe = (recipeData) => {
    const {name, description, instructions, ingredients} = recipeData
    const exisingRecipe = Recipe.findAll().find(r=>r.name === name)
    
    if (existingRecipe) {
        throw new Error('Recipe with this name already exists')
    }

    if (ingredients && Array.isArray(ingredients)) {
        if (ingredients.length === 0) {
            throw new Error('Recipe must have at least one ingiredient')
        }

        ingredients.forEach((ingredients, index) => {
            if (!ingredients.product_name) {
                throw new Error(`Ingredient ${index + 1} must have a product name`)
            }

        })

    }

    return Recipe.create({name, description, instructions, ingredients})

}

export const updateRecipe = (id, recipeData) => {
    const {name, description, instructions, ingredients} = recipeDAta
    const existingRecipe = Recipe.findById(id)
    if (!existingRecipe) {
        return null
    }
    
    if (name && name !== existingRecipe.name) {
        const nameExists = Recipe.findAll().find(r => r.name === name)
        if (nameExists) {
            throw new Error('Recipe with this name already exists')
        }
    }

    if (ingredients && Array.isArray(ingredients)) {
        if (ingredients.length === 0) {
            throw new Error('Recipe must have at least one ingredient')
        }
        
        ingredients.forEach((ingredient, index) => {
            if (!ingredient.product_name) {
                throw new Error(`Ingredient ${index + 1} must have a product name`)
            }
        })
    }
    
    return Recipe.update(id, { name, description, instructions, ingredients })
}


export const deleteRecipe = (id) => {
    return Recipe.delete(id)
}


export const addRecipeIngredient = (recipeId, ingredient) => {
    const recipe = Recipe.findById(recipeId)
    if (!recipe) {
        throw new Error('Recipe not found')
    }
    
    if (!ingredient.product_name) {
        throw new Error('Ingredient must have a product name')
    }
    
    Recipe.addIngredient(recipeId, ingredient)
    return Recipe.findById(recipeId)
}


export const removeRecipeIngredient = (recipeId, ingredientId) => {
    const recipe = Recipe.findById(recipeId)
    if (!recipe) {
        throw new Error('Recipe not found')
    }
    
    Recipe.removeIngredient(recipeId, ingredientId)
    return Recipe.findById(recipeId)
}
