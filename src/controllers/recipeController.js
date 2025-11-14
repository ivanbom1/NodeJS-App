import * as recipeService from '../services/recipeService.js'

export const getAllRecipes = (req, res) => {
    try {
        const recipes = recipeService.getAllrecipes()
        res.status(200).json(recipes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getRecipeById = (req, res) => {
    try {
        const { id } = req.params
        const recipe = recipeService.getRecipeById(id)
        
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        
        res.status(200).json(recipe)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createRecipe = (req, res) => {
    try {
        const { name, description, instructions, ingredients } = req.body

        if (!name) {
            return res.status(400).json({ message: "Recipe name is required" })
        }
        
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ message: "Recipe must have at least one ingredient" })
        }
        
        const newRecipe = recipeService.createRecipe({ name, description, instructions, ingredients })
        res.status(201).json(newRecipe)
    } catch (error) {

        if (error.message === 'Recipe with this name already exists') {
            return res.status(409).json({ message: error.message })
        }
        res.status(400).json({ message: error.message })
    }
}

export const updateRecipe = (req, res) => {
    try {
        const { id } = req.params
        const { name, description, instructions, ingredients } = req.body
        
        const updatedRecipe = recipeService.updateRecipe(id, { name, description, instructions, ingredients })
        
        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        
        res.status(200).json(updatedRecipe)
    } catch (error) {
        if (error.message === 'Recipe with this name already exists') {
            return res.status(409).json({ message: error.message })
        }
        res.status(400).json({ message: error.message })
    }
}

export const deleteRecipe = (req, res) => {
    try {
        const { id } = req.params
        const deleted = recipeService.deleteRecipe(id)
        
        if (!deleted) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const addRecipeIngredient = (req, res) => {
    try {
        const { id } = req.params
        const { product_name, quantity, unit, prep_time } = req.body

        if (!product_name) {
            return res.status(400).json({ message: "Product name is required" })
        }
        
        const updatedRecipe = recipeService.addRecipeIngredient(id, { product_name, quantity, unit, prep_time })
        res.status(200).json(updatedRecipe)
    } catch (error) {
        if (error.message === 'Recipe not found') {
            return res.status(404).json({ message: error.message })
        }
        res.status(400).json({ message: error.message })
    }
}

export const removeRecipeIngredient = (req, res) => {
    try {
        const { id } = req.params
        const { ingredientId } = req.body
        
        if (!ingredientId) {
            return res.status(400).json({ message: "Ingredient ID is required" })
        }
        
        const updatedRecipe = recipeService.removeRecipeIngredient(id, ingredientId)
        res.status(200).json(updatedRecipe)
    } catch (error) {
        if (error.message === 'Recipe not found') {
            return res.status(404).json({ message: error.message })
        }
        res.status(500).json({ message: error.message })
    }
}