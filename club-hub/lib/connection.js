/**
 * @file MongoDB connection definition.
 */

// Adapted from: https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

const { MONGODB_URI, NODE_ENV } = process.env;


if (!MONGODB_URI) {
    throw new Error("Missing environment variable: MONGODB_URI");
}


let client;
let connection;

if (NODE_ENV === "development") {
    // Use global variable to preserve value across HMR module reloads in development mode
    if (!global._mongoConnection) {
	client = new MongoClient(MONGODB_URI);
	global._mongoConnection = client.connect();
    }

    connection = global._mongoConnection;
} else {
    // Avoid global variables in production mode
    client = new MongoClient(MONGODB_URI);
    connection = client.connect();
}

export default connection;
