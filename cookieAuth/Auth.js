const jwt = require("jsonwebtoken");
require("dotenv").config();

const CookieAuth = (req, res, next) => {
	const token = req.cookies.jwt;
	console.log("cookie jwt: ", token)

	const validToken = jwt.verify(token, process.env.JWT_TOKEN);

	res.locals.user = validToken;
	console.log("user info: ", res.locals.user);

	next();
};
module.exports = {
	CookieAuth,
};
