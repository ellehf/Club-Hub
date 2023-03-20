/**
 * @file Simplified API to find club by ID.
 */

import connection from "/lib/connection";
import { toUser } from "/lib/conversions";

/**
 * Find club by ID from database.
 *
 * @param {string} id - Club ID.
 * @return {User} User with specified ID.
 */
async function findUserById(id) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("users");
	const document = await collection.findOne({ _id: id });

	if (!document) {
	    return null;
	}

	return toUser(document);
    } catch (err) {
	console.error(err);
    }
}

export default findUserById;
