const express = require("express");
const Router = express.Router();
const cookieParser = require("cookie-parser");

const CookieAuth = require("../cookieAuth/Auth");
const blogService = require("./blog.service");

Router.use(express.json());

Router.use(cookieParser());

Router.use(CookieAuth.CookieAuth);

Router.get("/", async (req, res) => {
	const user = res.locals.user;
	const response = await blogService.getBlogs(user);

	if (response.statusCode == 409) {
		res.redirect("/404"); 
	} else if (response.statusCode == 200) {
		res.render(
			"dashboard",
			{ blogs: response.blog, user: response.user, blogCount: response.blogCount }
		);
	}
});

Router.get("/published", async (req, res) => {
	const user = res.locals.user;
	const response = await blogService.getPublishedBlogs(user);

	if (response.statusCode == 409) {
		res.redirect("/404");
	} else if (response.statusCode == 200) {
		res.render(
			"dashboard",
			{ blogs: response.blogs, blogCount: response.blogCount}
		);
	}
});

Router.get("/draft", async (req, res) => {
	const user = res.locals.user;
	const response = await blogService.getDraftBlogs(user);

	if (response.statusCode == 409) {
		res.redirect("/404");
	} else if (response.statusCode == 200) {
		res.render("dashboard", { blogs: response.blogs, blogCount: response.blogCount});
	}
});

Router.post("/create", async (req, res) => {
	const user = res.locals.user;
	const req_body = req.body;

	const response = await blogService.createBlog(user, req_body);

	if (response.statusCode == 422) {
		res.redirect("/404");
	} else if (response.statusCode == 409) {
		res.redirect("/404");
	} else{
		res.redirect("/dashboard");
	}
});


Router.get("/edit/:blog_id", async (req, res) => {
	const blog_id = req.params.blog_id;
	const user = res.locals.user;

	const response = await blogService.getBlog(user, blog_id);

	if (response.statusCode == 409) {
		res.redirect("/404");
	} else {
		res.render("edit", {blog: response.blog});
	}
});

Router.post("/edit/:req_id", async (req, res) => {
	const req_body = req.body;

	const user = res.locals.user;

	const req_id = req.params.req_id;

	const response = await blogService.updateBlog(req_id, req_body, user);

	if (response.statusCode == 422) {
		res.redirect("/404");
	} else if (response.statusCode == 406) {
		res.redirect("/404");
	} else if (response.statusCode == 409 ) {
		res.redirect("/404");
	} else {
		res.redirect("/dashboard");
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

Router.post("/publish/:req_id", async (req, res) => {
	const req_id = req.params.req_id;

	const user = res.locals.user;
	const response = await blogService.PublishBlog(user, req_id);


	if (response.statusCode == 422) {
		res.redirect("/404");
	} else if (response.statusCode == 406) {
		res.redirect("/404");
	} else if (response.statusCode == 200) {
		res.redirect("/dashboard");
	}
});

Router.get("/search", async (req, res) => {
	const req_query = req.query.search;

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
		console.log(response, "my response")

		if (response.statusCode == 409) {
			res.redirect("/404");
		} else if (response.statusCode == 200) {
			res.render("index", {
				blogs: response.blog,
			});
		}
	}
});


module.exports = Router;
