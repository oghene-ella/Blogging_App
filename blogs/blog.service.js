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

		const newBlog = await BlogModel.create({
			title: req_body.title,
			description: req_body.description,
			author: req_body.author,
			authorId: req_body.authorId,
			body: req_body.body,
			state: req_body.state,
			readCount: req_body.readCount,
			readTime: req_body.readTime,
			tags: req_body.tags,
			createdAt: req_body.createdAt,
			updatedAt: req_body.updatedAt,
			userId: user._id,
		});

		return {
			message: "Blog successfully created",
			statusCode: 201,
			success: true,
			newBlog,
		};
	} catch (err) {
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

		const deleteBlog = await BlogModel.findOneAndDelete({
			_id: req_id,
		});


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

const updateBlog = async ({ status, user }) => {
	try {
		if (!blog) {
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


module.exports = {
	createBlog,
	deleteBlog,
	getBlogs,
	updateBlog,
};
