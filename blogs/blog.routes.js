const express = require("express");
const Router = express.Router();
const cookieParser = require("cookie-parser");

const CookieAuth = require("../cookieAuth/Auth");
const blogService = require("./blog.service");

Router.use(cookieParser());

Router.use(CookieAuth.CookieAuth);

Router.get("/", async (req, res) => {
	const user = res.locals.user;
	const response = await blogService.getBlogs(user);

	if (response.statusCode == 409) {
		res.redirect("/404"); 
	} else if (response.statusCode == 200) {
		res.render("dashboard", {blogs: response.blog , user: response.user});
	}
});

Router.post("/create", async (req, res) => {
	const req_body = req.body;
	const user = res.locals.user;
	console.log("user and req body", user, req_body)

	const response = await blogService.createBlog(user, req_body);

	console.log("response from post add:", response)

	if (response.statusCode == 422) {
		res.redirect("/404");
	} else if (response.statusCode == 409) {
		res.redirect("/404");
	} else if (response.statusCode == 201) {
		res.redirect("/dashboard");
	}
});

Router.post("/edit", async (req, res) => {
	const req_body = req.body;
	const user = res.locals.user;

	console.log("req body update", req_body);

	console.log("user for update", user);

	const response = await blogService.createBlog(user, req_body);

	console.log("response from post add:", response);

	if (response.statusCode == 422) {
		res.redirect("/404");
	} else if (response.statusCode == 409) {
		res.redirect("/404");
	} else if (response.statusCode == 201) {
		res.render("dashboard", { blogs: response.blog, user: response.user });
	}
});

Router.post("/del/:req_id", async (req, res) => {
	const req_id = req.params.req_id;

	const user = res.locals.user;
	const response = await blogService.deleteBlog(user, req_id);

	if (response.statusCode == 422) {
		res.redirect("/404");
	} else if (response.statusCode == 406) {
		res.redirect("/404");
	} else if (response.statusCode == 200) {
		res.redirect("/dashboard");
	}
});

module.exports = Router;
