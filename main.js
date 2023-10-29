// call all the modules including the config module
const express = require("express");
const connectBlogMongo = require("./config/config");
require("dotenv").config();

const UsersRouterHandler = require("./users/user.route");
const BlogRouteHandler = require("./blogs/blog.routes");
const blogService = require("./blogs/blog.service");

// port
const PORT = process.env.PORT;

// create express app
const app = express();

// use ejs as view engine
app.set("view engine", "ejs");
app.set("views", "views");

// parses incoming requests/data to JSON payloads
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// static folder path
app.use("/src", express.static("src"));

// get landing page  route
// app.get("/", (req, res) => {
// 	res.render("index");
// });

app.get("/", async (req, res) => {
	// const req_id = req.params.req_id;
	const response = await blogService.getPublishedBlogs();

	if (response.statusCode == 409) {
		res.redirect("/404");
	} else if (response.statusCode == 200) {
		res.render("index", { blogs: response.blogs });
	}
});

app.get("/published/:req_id", async (req, res) => {
	const req_id = req.params.req_id;
	
	const response = await blogService.getSinglePublishedBlogs(req_id);

	console.log("request id", req_id);
	console.log("response single", response)

	if (response.statusCode == 409) {
		res.redirect("/404");
	} else if (response.statusCode == 200) {
		res.render("sub", { blogs: response.blogList });
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

// get method for the dashboard page
// app.get("/dashboard", (req, res) => {
// 	res.render("dashboard");
// });

app.get("/edit", (req, res) => {
	res.render("edit");
});


app.get("/create", (req, res) => {
	res.render("create");
});

// use users routes
app.use("/users", UsersRouterHandler);
app.use("/dashboard", BlogRouteHandler);
app.use("/dashboard/create", BlogRouteHandler);

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
