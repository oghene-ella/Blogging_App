const mongoose = require("mongoose");
const shortid = require("shortid");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate,
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

UserSchema.pre("save", async function (next) {
	const hash = await bcrypt.hash(this.password, 10);

	this.password = hash;
	next();
});

UserSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);
	return compare;
};


const UsersModel = mongoose.model("users", UserSchema);

module.exports = UsersModel;
