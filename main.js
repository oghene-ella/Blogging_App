// call all the modules including the config module
const express = require("express");
const connectBlogMongo = require("./config/config");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const UsersRouterHandler = require("./users/user.route");
const BlogRouteHandler = require("./blogs/blog.routes");
const blogService = require("./blogs/blog.service");
const blogModel = require("./models/blogModel");

// port
const PORT = process.env.PORT;

// create express app
const app = express();
app.use(morgan("common"));

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
	} else if (response.statusCode == 200) {
		res.render("index", { blogs: response.blogs });
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
			} else {
				res.render("index", {
					blogs: [],
					query: req_query,
					message: "No matching blogs found.",
				});
			}
		} else {
			// If no search query, get all blogs
			const response = await blogService.getBlogs(user);
			console.log(response, "my response");

			if (response.statusCode == 409) {
				res.redirect("/index");
			} else if (response.statusCode == 200) {
				res.render("index", {
					blogs: response.blog,
				});
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
	} else if (response.statusCode == 200) {
		res.render("sub", { blogs: response.blogList});
	}
});


// get method for the login page
app.get("/login", (req, res) => {
	res.render("login");
});

// get method for the sign_up page
app.get("/signup", (req, res) => {
	res.render("signup");
});


app.get("/create", (req, res) => {
	res.render("create");
});

// use users routes
app.use("/users", UsersRouterHandler);
app.use("/dashboard", BlogRouteHandler);


// logout
app.get("/logout", (req, res) => {
	res.clearCookie("jwt");
	res.redirect("/");
});

// error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		data: null,
		error: "Server Error",
	});
});

// establish connection to mongodb
connectBlogMongo.connectBlogMongo();

// listener
app.listen(PORT, () => {
	console.log(`server listening at http://localhost:${PORT}`);
});
