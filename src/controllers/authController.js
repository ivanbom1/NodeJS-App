/******************** 
This is your data (normally would come from a service/database)
*********************/

const users = [
	{ id: 1, name: "Alice" },
	{ id: 2, name: "Bob" },
	{ id: 3, name: "Charlie" },
	{ id: 4, name: "Dave" },
]

// Get all users
export const getAllUsers = (req, res) => {
	res.json(users)
}

// Get single user
export const getUserById = (req, res) => {
	const { id } = req.params
	const user = users.find(u => u.id === parseInt(id))
	
	if (!user) {
		return res.status(404).json({ message: "User not found" })
	}
	
	res.json(user)
}

// Create new user
export const createUser = (req, res) => {
	const newUser = {
		id: users.length + 1,
		name: req.body.name
	}
	users.push(newUser)
	res.status(201).json(newUser)
}