// call all the modules including the config module
const express = require("express");
const connectBlogMongo = require("./config/config");
require("dotenv").config();

const UsersRouterHandler = require("./users/user.route");
const BlogRouteHandler = require("./blogs/blog.routes");


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
app.get("/", (req, res) => {
	res.render("index");
});

app.get("/sub", (req, res) => {
	res.render("sub_page");
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

// use users routes
app.use("/users", UsersRouterHandler)
app.use("/dashboard", BlogRouteHandler);

// logout
app.get("/logout", (req, res) => {
	res.clearCookie("jwt");
	res.redirect("/");
})

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
