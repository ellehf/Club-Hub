/**
 * @file Implementation of club search by name.
 */

import connection from "/lib/connection";

/**
 * Find club information from database based on name with limited fuzzy search capabilities.
 *
 * @param {IncomingMessage} req - Client's data request.
 * @param {ServerResponse} res - Server's response to the client's request.
 */
async function clubSearchNameHandler(req, res) {
    const client = await connection;
    const collection = client.db("db").collection("clubs");

    switch(req.method) {
    case "GET":
	try {
	    const { name } = req.query;
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

export default clubSearchNameHandler;
