import express from "express"
import { logMiddleware } from "../middleware/logger.js"
import * as recipeController from "../controllers/recipeController.js"


const router = express.Router()

router.get("/", logMiddleware, recipeController.getAllRecipes) // GET /recipes
router.get("/:id", recipeController.getRecipeById) // GET /recipes/:id
router.post("/", recipeController.createRecipe) // POST /recipes
router.put("/:id", recipeController.updateRecipe) // PUT /recipes/:id
router.delete("/:id", recipeController.deleteRecipe) // DELETE /recipes/:id

router.post("/:id/ingredients", recipeController.addRecipeIngredient) // POST /recipes/:id/ingredients
router.delete("/:id/ingredients", recipeController.removeRecipeIngredient) // DELETE /recipes/:id/ingredients

export default router