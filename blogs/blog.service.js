const BlogModel = require("../models/blogModel");

const createBlog = async (user, req_body) => {
	try {

		function readingTime(text) {
			const words = text.split(/\s+/);
			const wordCount = words.length;
			let averageWPM = 200;
			let calcSec;
			let calcMin = wordCount / averageWPM;

			if (calcMin < 1) {
				calcSec = Math.floor(calcMin * 60);
				return `${calcSec} sec`;
			} else {
				return `${calcMin} min`;
			}
		}

		if (!req_body) {
			return {
				statusCode: 422,
				message: "Add a Blog already!",
				success: false,
			};
		}
		console.log("req body: ", req_body);

		console.log("actual tags: ", req_body.tags)

		const newBlog = await BlogModel.create({
			title: req_body.title,
			description: req_body.description,
			author: user.firstname,
			body: req_body.body,
			readTime: readingTime(req_body.body),
			// readCount: 0,
			tags: req_body.tags,
			userId: user._id,
			createdAt: req_body.createdAt,
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

		const deleteBlog = await BlogModel.findByIdAndDelete(req_id);

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

const PublishBlog = async (user, req_id) => {
	try {
		if (!req_id) {
			return {
				statusCode: 422,
				message: "No Blog to Delete",
				success: false,
			};
		}

		const publishBlog = await BlogModel.findByIdAndUpdate(req_id,
			{
				state: "published"
			}
		);

		if (!publishBlog) {
			return {
				statusCode: 406,
				message: "Unable to publish Blog",
				success: false,
			};
		}

		const BlogList = await BlogModel.find({ userId: user._id });


		return {
			statusCode: 200,
			message: "Blog published successfully",
			success: true,
			BlogList,
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

	function readingTime(text) {
		const words = text.split(/\s+/);
		const wordCount = words.length;
		let averageWPM = 200;
		let calcSec;
		let calcMin = wordCount / averageWPM;

		if (calcMin < 1) {
			calcSec = Math.floor(calcMin * 60);
			return `${calcSec} sec`;
		} else {
			return `${calcMin} min`;
		}
	}

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
				author: user.firstname,
				readTime: readingTime(req_body.body),
				tags: req_body.tags,
				updatedAt: req_body.updatedAt,
			},
		);


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

const getPublishedBlogs = async (user) => {
	try {
		const blogs = await BlogModel.find({ userId: user._id, state: "published" });

		if (blogs.length === 0) {
			return {
				statusCode: 200,
				message: "There are no blog's",
				blogs: blogs,
				blogCount: 0,
				user,
			};
		}

		if (blogs.length != 0) {
			return {
				statusCode: 200,
				message: null,
				blogs: blogs,
				blogCount: blogs.length,
				user,
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

const getDraftBlogs = async (user) => {
	try {
		const blogs = await BlogModel.find({userId: user._id, state: "draft" });

		if (blogs.length === 0) {
			return {
				statusCode: 200,
				message: "There are no blog's",
				blogs: blogs,
				blogCount: 0,
				user,
			};
		}

		return {
			statusCode: 200,
			message: null,
			blogs: blogs,
			blogCount: blogs.length,
			user,
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

const getPublishedBlogsLandingPage = async (page, limit) => {
	try {
		const skip = (page - 1) * limit;

		const blogs = await BlogModel.find({
			state: "published",
		})
			.skip(skip)
        	.limit(limit);

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

const searchBlog = async (req_query) => {
	try {
		const searchBlogs = await BlogModel.find({
			$or: [
				{ title: { $regex: req_query, $options: "i" } },
				{ author: { $regex: req_query, $options: "i" } }, 
				{ tags: { $in: [req_query] } },
			],
		});

		console.log("the search blogs: ", searchBlogs);

		if (searchBlogs.length === 0) {
			return {
				message: "No matching blogs found",
				statusCode: 404,
				success: true,
				searchBlogs: [],
			};
		}

		return {
			message: "Blogs found",
			statusCode: 200,
			success: true,
			searchBlogs,
		};
	} catch (err) {
		console.error("Error:", err);
		return {
			message: "Something went wrong while searching blogs",
			err,
			statusCode: 500,
			success: false,
		};
	}
}

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
	getPublishedBlogsLandingPage,
	searchBlog,
};
