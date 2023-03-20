/**
 * @file Simplified API to find user by email.
 */

import connection from "/lib/connection";
import { toUser } from "/lib/conversions";

/**
 * Find user by email from database.
 *
 * @param {string} email - Email.
 * @return {User} user - User with specified email.
 */
async function findUserByEmail(email) {
    try {
	const client = await connection;
	const collection = client.db("db").collection("users");
	const document = await collection.findOne({ email });
	if (!document) {
	    return null;
	}

	return toUser(document);
    } catch (err) {
	console.error(err);
    }
}

export default findUserByEmail;
