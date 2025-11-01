import express from "express"
import { logMiddleware } from "./middleware/middleware.js"
import { getAllUsers, getUserById, createUser } from "./controllers/authController.js"  // ← Import the controller

const app = express()
const PORT = 3000

// middleware
app.use(express.json())
app.use(logMiddleware);

// Route now references the controller function
app.get("/", logMiddleware, getAllUsers)  // ← Use the controller here

app.get("/users", getAllUsers)
app.get("/users/:id", getUserById)
app.post("/users", createUser)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})