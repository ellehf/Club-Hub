/**
 * @file Simplified API for finding clubs by tags.
 */

import connection from "/lib/connection";
import { toClub } from "/lib/conversions";

/**
 * Find clubs by tags from database.
 *
 * @param {string[]} tags - List of club tags.
 * @return {Club[]} List of clubs with specified tags.
 */
async function findClubsByTags(tags) {
    try {
	const collection = await getCollection("clubs");
	const documents = await collection.find({ tags: { $all: tags } }).toArray();
	return documents.map((document) => toClub(document));
    } catch (err) {
	console.error(err);
    }
}

export default findClubsByTags;
