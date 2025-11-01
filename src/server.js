import express from "express"
import { logMiddleware } from "./middleware/middleware.js"
const app = express()
const PORT = 3000

const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Dave" },
]

app.use(express.json())

app.use(logMiddleware);

app.get("/", logMiddleware, (req, res) => {
	const data = req.data
	res.json({ users, data })
})

app.post("/", (req, res) => {
    console.log(req)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
