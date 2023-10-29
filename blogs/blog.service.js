const BlogModel = require("../models/blogModel");

const createBlog = async (user, req_body) => {
	try {
		if (!req_body) {
			return {
				statusCode: 422,
				message: "Add a Blog already!",
				success: false,
			};
		}
		console.log("req body: ", req_body);

		const newBlog = await BlogModel.create({
			title: req_body.title,
			description: req_body.description,
			author: req_body.author,
			body: req_body.body,
			tags: [...req_body.tags],
			userId: user._id,
		});

		console.log("new blog: ", newBlog)

		return {
			message: "Blog successfully created",
			statusCode: 201,
			success: true,
			newBlog,
			user,
		};
	} catch (err) {
		console.log("error o:", err)
		return {
			message: "Something went wrong while creating. Go back to your dashboard",
			err,
			statusCode: 409,
			success: false,
		};
	}
};

const deleteBlog = async (user, req_id) => {
	try {
		if (!req_id) {
			return {
				statusCode: 422,
				message: "No Blog to Delete",
				success: false,
			};
		}
		console.log("blog id:", req_id);

		const deleteBlog = await BlogModel.findOneAndDelete(req_id);

		console.log("del blog", deleteBlog);

		if (!deleteBlog) {
			return {
				statusCode: 406,
				message: "Unable to delete Blog",
				success: false,
			};
		}

		const BlogList = await BlogModel.find({ userId: user._id });

		return {
			statusCode: 200,
			message: "Blog deleted successfully",
			success: true,
			BlogList,
		};
	} catch (err) {
		console.log("del error: ", err);
		return {
			statusCode: 409,
			message: "Something went wrong with deleting the blog, try again later.",
			err,
			success: false,
		};
	}
};

const getBlogs = async (user) => {
	try {
		const blog = await BlogModel.find({ userId: user._id });

		if (blog.length === 0) {
			return {
				statusCode: 200,
				message: "There are no blog's",
				blog: blog,
				user,
			};
		}

		if (blog.length != 0) {
			return {
				statusCode: 200,
				message: null,
				blog: blog,
				user,
			};
		}
	} catch (error) {
		return {
			statusCode: 409,
			message:
				"Something went wrong with getting the blog list, try again later.",
			error,
			success: false,
		};
	}
};

const updateBlog = async ({ req_body, user }) => {
	try {
		if (!req_body) {
			return {
				statusCode: 422,
				message: "Add a Blog",
				success: false,
			};
		}

		const updateBlog = await BlogModel.findByIdAndUpdate(user._id, {
			status: user.status,
		});

		if (!updateBlog) {
			return {
				statusCode: 406,
				message: "Unable to Update Blog",
				success: false,
			};
		}

		return {
			statusCode: 204,
			message: "Blog has been Updated Successfully",
			updateBlog: [updateBlog],
		};
	} catch (err) {
		return {
			statusCode: 409,
			message: "Something went wrong with deleting the blog, try again later.",
			err,
			success: false,
		};
	}
};

const getPublishedBlogs = async () => {
	try {
		const blogs = await BlogModel.find({ state: "published"});

		if (blogs.length === 0) {
			return {
				statusCode: 200,
				message: "There are no blog's",
				blogs: blogs,
			};
		}

		if (blogs.length != 0) {
			return {
				statusCode: 200,
				message: null,
				blogs: blogs,
			};
		}

	} catch (error) {
		return {
			statusCode: 409,
			message:
				"Something went wrong with getting the published blog list, try again later.",
			error,
			success: false,
		};
	}
};

const getSinglePublishedBlogs = async (req_id) => {
	try {
		const blogList = await BlogModel.find({_id: req_id});

		console.log("single blog", blogList);

		return {
			statusCode: 200,
			message: "Blog found successfully",
			success: true,
			blogList,
		};
	} catch (error) {
		return {
			statusCode: 409,
			message:
				"Something went wrong with getting the published blog list, try again later.",
			error,
			success: false,
		};
	}
};

module.exports = {
	createBlog,
	deleteBlog,
	getBlogs,
	updateBlog,
	getPublishedBlogs,
	getSinglePublishedBlogs,
};
