const app = require("./main");
require("dotenv").config();

const connectBlogMongo = require("./config/config");
const logger = require("./log/logger");

// port
const PORT = process.env.PORT;

// establish connection to mongodb
connectBlogMongo.connectBlogMongo();

// listener
app.listen(PORT, () => {
	console.log(`server listening at http://localhost:${PORT}`);
	logger.info("Successfully running the server! :)");
});
