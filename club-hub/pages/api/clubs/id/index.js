/**
 * @file Simplified API for finding clubs by ID.
 */

import connection from "/lib/connection";
import { toClub } from "/lib/conversions";

/**
 * Find club by ID from database.
 *
 * @param {string} id - Club ID.
 * @return {Club} Club with specified ID.
 */
async function findClubById(id) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("clubs");
	const document = await collection.findOne({ _id: id });

	if (!document) {
	    return null;
	}

	return toClub(document);
    } catch (err) {
	console.error(err);
    }
}

export default findClubById;

//export class findClubById {}
