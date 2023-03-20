/**
 * @file Implementation of club search by club tags.
 */

import connection from "/lib/connection";

/**
 * Find club information from database based on club tags.
 *
 * @param {IncomingMessage} req - Client's data request.
 * @param {ServerResponse} res - Server's response to the client's request.
 */
async function clubSearchTagsHandler(req, res) {
    const client = await connection;
    const collection = client.db("db").collection("clubs");

    switch (req.method) {
    case "GET":
	try {
	    const { tags } = req.query;
	    const documents = await collection.find({ tags: { $all: tags } }).toArray();
	    res.status(200).json(documents);
	} catch (err) {
	    console.error(err);
	    res.status(503).send("Encountered error during data retrieval");
	}

	break;

    default:
	res.setHeader("Allow", "GET");
	res.status(405).send("Request method not supported");
	break;
    }
}

export default clubSearchTagsHandler;
