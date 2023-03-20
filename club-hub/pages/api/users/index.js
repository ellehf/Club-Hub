/**
 * @file User database API.
 */

import connection from "/lib/connection";
import { toUser } from "/lib/conversions";

/**
 * API that allows the client to interact with the database to get a list of all users,
 * insert a new user, update user information, and delete a user.
 *
 * @param {IncomingMessage} req - Client's data request.
 * @param {ServerResponse} res - Server's response to the client's request.
 */
async function userDatabaseHandler(req, res) {
    const client = await connection;
    const collection = client.db("db").collection("users");

    switch (req.method) {
    case "GET":
	// Retrieve list of all users
	try {
	    const documents = await collection.find({}).toArray();
	    res.status(200).json(documents);
	} catch (err) {
	    console.error(err);
	    res.status(503).send("Encountered error during data retrieval");
	}

	break;

    case "POST":
	// Insert newly created user
	try {
	    const document = req.body;
	    await collection.insertOne(document);
	    res.status(201).send();
	} catch (err) {
	    console.error(err);
	    res.status(503).send("Encountered error during data insertion");
	}

	break;

    case "PATCH":
	// Update user information
	try {
	    const { filter, update } = req.body;
	    await collection.updateOne(filter, update);
	    res.status(200).send();
	} catch (err) {
	    console.error(err);
	    res.status(503).send("Encountered error during data update");
	}

	break;

    case "DELETE":
	// Remove user from database
	try {
	    const filter = req.body;
	    await collection.deleteOne(filter);
	    res.status(200).send();
	} catch (err) {
	    console.error(err);
	    res.status(503).send("Encountered error during data deletion");
	}

	break;

    default:
	res.setHeader("Allow", "GET, POST, PATCH, DELETE");
	res.status(405).send("Request method not supported");
	break;
    }
}

/**
 * Get list of all users from database.
 *
 * @return {User[]} List of users.
 */
async function getUserList() {
    try {
	const client = await connection;
	const collection = client.db("db").collection("users");
	const documents = await collection.find({}).toArray();
	return documents.map((document) => toUser(document));
    } catch (err) {
	console.error(err);
    }
}

/**
 * Insert user into database.
 *
 * @param {User} user - Newly created user.
 */
async function insertUser(user) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("users");
	await collection.insertOne(user.toJson());
    } catch (err) {
	console.error(err);
    }
}

/**
 * Update user information in database.
 *
 * @param {User} user - User to update.
 * @param {Object} update - Update operator.
 */
async function updateUser(user, update) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("users");
	await collection.updateOne({ _id: user.getId() }, update);
    } catch (err) {
	console.error(err);
    }
}

/**
 * Delete user from database.
 *
 * @param {User} user - User to delete.
 */
async function deleteUser(user) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("users");
	await collection.deleteOne({ _id: user.getId() });
    } catch (err) {
	console.error(err);
    }
}

export { getUserList, insertUser, updateUser, deleteUser };
export default userDatabaseHandler;
