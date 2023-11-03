// call all the modules including the config module
const express = require("express");
const connectBlogMongo = require("./config/config");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const UsersRouterHandler = require("./users/user.route");
const BlogRouteHandler = require("./blogs/blog.routes");
const blogService = require("./blogs/blog.service");
const blogModel = require("./models/blogModel");
const logger = require("./log/logger");

// port
const PORT = process.env.PORT;

// create express app
const app = express();

// use ejs as view engine
app.set("view engine", "ejs");
app.set("views", "views");

// parses incoming requests/data to JSON payloads
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// static folder path
app.use("/src", express.static("src"));


app.get("/", async (req, res) => {
	const page = 1;
	
	const limit = 20;
	const response = await blogService.getPublishedBlogsLandingPage(page, limit);

	if (response.statusCode == 409) {
		res.redirect("/404");
		logger.error("unable to fetch published blogs on the landing page");
	} else if (response.statusCode == 200) {
		const totalPages = Math.ceil(response.blogCount / limit);
		res.render("index", { blogs: response.blogs, totalPages, currentPage: page });
		logger.info("Successfully fetched published blogs on the landing page");
	}
});

app.get("/search", async (req, res) => {
	try {
		const req_query = req.query.search;
		const user = res.locals.user;

		console.log("req query", req_query);

		if (req_query) {
			const searchResponse = await blogService.searchBlog(req_query);

			if (searchResponse.statusCode == 200) {
				res.render("index", {
					blogs: searchResponse.searchBlogs,
					query: req_query,
				});
				logger.info("successfully fetched the search query");
			} else {
				res.render("index", {
					blogs: [],
					query: req_query,
					message: "No matching blogs found.",
				});
				logger.error("unable to search for a blog");
			}
		} else {
			// If no search query, get all blogs
			const response = await blogService.getBlogs(user);
			console.log(response, "my response");

			if (response.statusCode == 409) {
				res.render("index");
				logger.info("you did not input a search query");
			} else if (response.statusCode == 200) {
				res.render("index", {
					blogs: response.blog,
				});
				logger.info("return all blogs");
			}
		}
	}

	catch (err) {
		return res.redirect("/404")
	}
});

app.get("/published/:req_id", async (req, res) => {
	const req_id = req.params.req_id;
	
	const response = await blogService.getSinglePublishedBlogs(req_id);

	const getBlogCount = await blogModel.findOne({ _id: req_id });
	getBlogCount.readCount = getBlogCount.readCount + 1;

	// Save back to the database
	await getBlogCount.save();

	if (response.statusCode == 409) {
		res.redirect("/404");
		logger.error("unable to get a particular published blog");
	} else if (response.statusCode == 200) {
		res.render("sub", { blogs: response.blogList});
		logger.info("successfully fetched a blogs info");
	}
});


// get method for the login page
app.get("/login", (req, res) => {
	res.render("login");
	logger.info("login");
});

// get method for the sign_up page
app.get("/signup", (req, res) => {
	res.render("signup");
	logger.info("sign up");
});


app.get("/create", (req, res) => {
	res.render("create");
	logger.error("create blog");
});

// use users routes
app.use("/users", UsersRouterHandler);
app.use("/dashboard", BlogRouteHandler);


// logout
app.get("/logout", (req, res) => {
	res.clearCookie("jwt");
	res.redirect("/");
	logger.info("logged out");
});

// error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		data: null,
		error: "Server Error",
	});
	logger.error("error handler");
});

// establish connection to mongodb
connectBlogMongo.connectBlogMongo();


// listener
app.listen(PORT, () => {
	console.log(`server listening at http://localhost:${PORT}`);
	logger.info("Successfully running the server! :)");
});