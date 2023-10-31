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

		console.log("actual tags: ", req_body.tags)

		const tags = req_body.tags.split(',').map(tag => tag.trim());

		console.log("split tags: ", tags)

		const newBlog = await BlogModel.create({
			title: req_body.title,
			description: req_body.description,
			author: req_body.author,
			body: req_body.body,
			tags: [...tags],
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

		const deleteBlog = await BlogModel.findByIdAndDelete(req_id);

		console.log("del blog", deleteBlog);

		if (!deleteBlog) {
			return {
				statusCode: 406,
				message: "Unable to delete Blog",
				success: false,
			};
		}

		const BlogList = await BlogModel.find({ userId: user._id });

		console.log("blog list: ", BlogList)

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

const PublishBlog = async (user, req_id) => {
	try {
		if (!req_id) {
			return {
				statusCode: 422,
				message: "No Blog to Delete",
				success: false,
			};
		}
		console.log("blog id:", req_id);

		const publishBlog = await BlogModel.findByIdAndUpdate(req_id,
			{
				state: "published"
			}
		);

		console.log("publish blog", publishBlog);

		if (!publishBlog) {
			return {
				statusCode: 406,
				message: "Unable to publish Blog",
				success: false,
			};
		}

		const BlogList = await BlogModel.find({ userId: user._id });

		console.log("blog list: ", BlogList);

		return {
			statusCode: 200,
			message: "Blog published successfully",
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
				blogCount: 0,
			};
		}

		if (blog.length != 0) {
			return {
				statusCode: 200,
				message: null,
				blog: blog,
				user,
				blogCount: blog.length,
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

const getBlog = async (user, blog_id) => {
	try {
		const getBlog = await BlogModel.findOne({
			userId: user._id,
			_id: blog_id,
		});

		return {
			statusCode: 200,
			message: "Blog was successfully retrieved",
			blog: getBlog,
			user,
		};

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

const updateBlog = async (req_id, req_body, user) => {
	try {
		if (!req_body) {
			return {
				statusCode: 422,
				message: "Update your Blog",
				success: false,
			};
		}

		const updateBlog = await BlogModel.findByIdAndUpdate(
			{ _id: req_id },
			{
				title: req_body.title,
				description: req_body.description,
				body: req_body.body,
				author: req_body.author,
				tags: req_body.tags,
			},
		);

		console.log("updated blog: ", updateBlog);

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
			updateBlog: updateBlog,
			user,
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
				blogCount: 0,
			};
		}

		if (blogs.length != 0) {
			return {
				statusCode: 200,
				message: null,
				blogs: blogs,
				blogCount: blogs.length,
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

const getDraftBlogs = async () => {
	try {
		const blogs = await BlogModel.find({ state: "draft" });

		if (blogs.length === 0) {
			return {
				statusCode: 200,
				message: "There are no blog's",
				blogs: blogs,
				blogCount: 0,
			};
		}

		return {
			statusCode: 200,
			message: null,
			blogs: blogs,
			blogCount: blogs.length,
		};

	} catch (error) {
		return {
			statusCode: 409,
			message:
				"Something went wrong with getting the drafted blog list, try again later.",
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
	getBlog,
	updateBlog,
	getDraftBlogs,
	getPublishedBlogs,
	getSinglePublishedBlogs,
	PublishBlog,
};
