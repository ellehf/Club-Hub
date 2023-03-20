/**
 * @file Club database API.
 */

import connection from "/lib/connection";
import { toClub } from "/lib/conversions";

/**
 * API that allows the client to interact with the database to get a list of all clubs,
 * insert a new club, update club information, and delete a club.
 *
 * @param {IncomingMessage} req - Client's data request.
 * @param {ServerResponse} res - Server's response to the client's request.
 */
async function clubDatabaseHandler(req, res) {
    const client = await connection;
    const collection = client.db("db").collection("clubs");

    switch (req.method) {
    case "GET":
	// Retrieve list of all clubs
	try {
	    const documents = await collection.find({}).toArray();
	    res.status(200).json(documents);
	} catch (err) {
	    console.error(err);
	    res.status(503).send("Encountered error during data retrieval");
	}

	break;

    case "POST":
	// Insert newly created club
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
	// Update club information
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
	// Remove club from database
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
 * Get list of all clubs from database.
 *
 * @return {Club[]} List of clubs.
 */
async function getClubList() {
    try {
	const client = await connection;
	const collection = client.db("db").collection("clubs");
	const documents = await collection.find({}).toArray();
	return documents.map((document) => toClub(document));
    } catch (err) {
	console.error(err);
    }
}

/**
 * Insert club into database.
 *
 * @param {Club} club - Newly created club.
 */
async function insertClub(club) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("clubs");
	await collection.insertOne(club.toJson());
    } catch (err) {
	console.error(err);
    }
}

/**
 * Update club information in database.
 *
 * @param {Club} club - Club to update.
 * @param {Object} update - Update operator.
 */
async function updateClub(club, update) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("clubs");
	await collection.updateOne({ _id: club.getId() }, update);
    } catch (err) {
	console.error(err);
    }
}

/**
 * Delete club from database.
 *
 * @param {Club} club - Club to delete.
 */
async function deleteClub(club) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("clubs");
	await collection.deleteOne({ _id: club.getId() });
    } catch (err) {
	console.error(err);
    }
}

export { getClubList, insertClub, updateClub, deleteClub };
export default clubDatabaseHandler;
