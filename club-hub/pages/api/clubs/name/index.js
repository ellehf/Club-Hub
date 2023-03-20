/**
 * @file Simplified API to find clubs by name.
 */

import connection from "/lib/connection";
import { toClub } from "/lib/conversions";

/**
 * Find clubs by name from database with limited fuzzy search capabilities.
 *
 * @param {string} name - Club name.
 * @return {Club[]} List of clubs with closely matched names.
 */
async function findClubsByName(name) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("clubs");
	const documents = await collection.aggregate([
	    {
		$search: {
		    index: "club_name",
		    text: {
			query: name,
			path: "name",
			fuzzy: {
			    maxEdits: 1,
			},
		    },
		},
	    },
	]).toArray();

	return documents.map((document) => toClub(document));
    } catch (err) {
	console.error(err);
    }
}

export default findClubsByName;
