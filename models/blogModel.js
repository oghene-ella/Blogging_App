const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;
const { ObjectId } = Schema;

const BlogSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate,
	},
	userId: {
		type: String,
		ref: "users",
	},
	title: {
		type: String,
		unique: true,
		required: true,
	},
	description: {
		type: String,
	},
	author: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		enum: ["draft", "published"],
		default: "draft",
	},
	readCount: {
		type: Number,
		default: 0,
	},
	readTime: {
		type: String,
		default: 0,
	},
	tags: {
		type: [String],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Blog = mongoose.model("blogs", BlogSchema);

module.exports = Blog;
