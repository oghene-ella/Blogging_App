const express = require("express");
const Router = express.Router();
const cookieParser = require("cookie-parser");

const CookieAuth = require("../cookieAuth/Auth");
const blogService = require("./blog.service");
const logger = require("../log/logger");

Router.use(express.json());

Router.use(cookieParser());

Router.use(CookieAuth.CookieAuth);

Router.get("/", async (req, res) => {
	const user = res.locals.user;
	const response = await blogService.getBlogs(user);

	if (response.statusCode == 409) {
		res.redirect("/404"); 
		logger.error("Unable to get blogs")
	} else if (response.statusCode == 200) {
		res.render(
			"dashboard",
			{ blogs: response.blog, user: response.user, blogCount: response.blogCount }
		);
		logger.info("gotten the blogs")
	}
});

Router.get("/published", async (req, res) => {
	const user = res.locals.user;
	const response = await blogService.getPublishedBlogs(user);

	if (response.statusCode == 409) {
		res.redirect("/404");
		logger.error("unable to get published blogs")
	} else if (response.statusCode == 200) {
		res.render(
			"dashboard",
			{ blogs: response.blogs, blogCount: response.blogCount}
		);
		logger.info("successfully fetched published blogs ")
	}
});

Router.get("/draft", async (req, res) => {
	const user = res.locals.user;
	const response = await blogService.getDraftBlogs(user);

	if (response.statusCode == 409) {
		res.redirect("/404");
		logger.error("unable to get drafted blog")
	} else if (response.statusCode == 200) {
		res.render("dashboard", { blogs: response.blogs, blogCount: response.blogCount});
		logger.info("successfully fetched drafted blog ")
	}
});

Router.post("/create", async (req, res) => {
	const user = res.locals.user;
	const req_body = req.body;

	const response = await blogService.createBlog(user, req_body);

	if (response.statusCode == 422) {
		res.redirect("/404");
		logger.error("unable to create blogs")
	} else if (response.statusCode == 409) {
		res.redirect("/404");
		logger.error("unable to create blogs");
	} else{
		res.redirect("/dashboard");
		logger.error("successfully created the blogs");
	}
});


Router.get("/edit/:blog_id", async (req, res) => {
	const blog_id = req.params.blog_id;
	const user = res.locals.user;

	const response = await blogService.getBlog(user, blog_id);

	if (response.statusCode == 409) {
		res.redirect("/404");
		logger.error("unable to get edited blog");
	} else {
		res.render("edit", {blog: response.blog});
		logger.info("successfully fetched edited blog");
	}
});

Router.post("/edit/:req_id", async (req, res) => {
	const req_body = req.body;

	const user = res.locals.user;

	const req_id = req.params.req_id;

	const response = await blogService.updateBlog(req_id, req_body, user);

	if (response.statusCode == 422) {
		res.redirect("/404");
		logger.error("unable to update blog");
	} else if (response.statusCode == 406) {
		res.redirect("/404");
		logger.error("unable to update blog");
	} else if (response.statusCode == 409 ) {
		res.redirect("/404");
		logger.error("unable to update blog");
	} else {
		res.redirect("/dashboard");
		logger.info("successfully updated the blog");
	}
});

Router.post("/del/:req_id", async (req, res) => {
	const req_id = req.params.req_id;

	const user = res.locals.user;
	const response = await blogService.deleteBlog(user, req_id);


	if (response.statusCode == 422) {
		res.redirect("/404");
		logger.error("unable to delete blog");
	} else if (response.statusCode == 406) {
		res.redirect("/404");
		logger.error("unable to deleted blog");
	} else if (response.statusCode == 200) {
		res.redirect("/dashboard");
		logger.info("successfully deleted the blog");
	}
});

Router.post("/publish/:req_id", async (req, res) => {
	const req_id = req.params.req_id;

	const user = res.locals.user;
	const response = await blogService.PublishBlog(user, req_id);


	if (response.statusCode == 422) {
		res.redirect("/404");
		logger.error("unable to publish the blog");
	} else if (response.statusCode == 406) {
		res.redirect("/404");
		logger.error("unable to publish the blog");
	} else if (response.statusCode == 200) {
		res.redirect("/dashboard");
		logger.info("successfully published the blog");
	}
});


module.exports = Router;
