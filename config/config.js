const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../log/logger");

const connectBlogMongo = async () => {
	mongoose.connect(process.env.MONGO_URL);

	mongoose.connection.on("connected", () => {
		console.log("Connected to MongoDB Successfully");
		logger.info("successfully Connected to MongoDB Successfully");
	});

	mongoose.connection.on("error", (err) => {
		console.log("An error occurred while connecting to MongoDB");
		console.log(err);
		logger.error("Unable to connect to MongoDB");
	});
};

module.exports = {
	connectBlogMongo,
};
