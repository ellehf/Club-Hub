/**
 * @file Implementation of club search by ID.
 */

import connection from "/lib/connection";

/**
 * Find club information from database based on ID.
 *
 * @param {IncomingMessage} req - Client's data request.
 * @param {ServerResponse} res - Server's response to the client's request.
 */

async function clubSearchIdHandler(req, res) {
    const client = await connection;
    const collection = client.db("db").collection("clubs");

    switch (req.method) {
    case "GET":
	try {
	    const { id } = req.query;
	    const document = await collection.findOne({ _id: id });
	    res.status(200).json(document);
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

export default clubSearchIdHandler;
