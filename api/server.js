// BUILD YOUR SERVER HERE
const Users = require('./users/model');
const express = require('express');

const app = express();

module.exports = app; // EXPORT YOUR SERVER instead of {}


// ENDPOINTS

/* ---- POST - Creates then returns a new user ---- */
app.post('/api/users', async (req, res) => {
	const user = req.body;

	if (!user.name || !user.bio) {
		res.status(400).json({ message: 'Please provide name and bio for user' });
	} else {
		try {
			const newUser = await Users.insert(user);
			res.status(201).json(newUser);
		} catch (err) {
			console.log(err);
			res
				.status(500)
				.json({
					message: 'There was an error while saving user to the database',
				});
		}
	}
});

/* ---- GET - Gets all users ---- */
app.get('/api/users', async (req, res) => {
	try {
		const allUsers = await Users.find();
		res.status(200).json(allUsers);
	} catch (err) {
		res
			.status(500)
			.json({ message: 'The user information could not be retrieved. ' });
	}
});


/* ---- GET - Gets user by ID ---- */
app.get('/api/users/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const foundUser = await Users.findById(id);
		if (foundUser) {
			res.status(200).json(foundUser);
		} else {
			res
				.status(404)
				.json({ message: 'The user with the specified ID does not exist. ' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'The user information could not be retrieved. ' });
	}
});


/* ---- DELETE - Deletes user by id ---- */
app.delete('/api/users/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const deletedUser = await Users.remove(id);
		if (deletedUser) {
			res.status(200).json(deletedUser);
		} else {
			res
				.status(404)
				.json({ message: 'The user with the specified ID does not exist. ' });
		}
	} catch (err) {
		res.status(500).json({ message: 'The user could not be removed' });
	}
});


/* ---- PUT - Updates user by ID with provided data ---- */
app.put('/api/users/:id', async (req, res) => {
	const { id } = req.params;
	const userChanges = req.body;

	if (!userChanges.name || !userChanges.bio) {
		res
			.status(400)
			.json({ message: 'Please provide name and bio for the user.' });
	} else {
		try {
			const updatedUser = await Users.update(id, userChanges);
			if (updatedUser) {
				res.status(200).json(updatedUser);
			} else {
				res
					.status(404)
					.json({ message: 'The user with the specified ID does not exist.' });
			}
		} catch (err) {
			res
				.status(500)
				.json({ message: 'The user information could not be modified.' });
		}
	}
});