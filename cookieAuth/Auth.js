const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("../log/logger");

const CookieAuth = (req, res, next) => {
	try {
        const token = req.cookies.jwt;

        if (!token) {
            res.cookie("Error when trying to login")
            res.redirect('/login')
            logger.error("unable to login");
        }
        
        const validToken = jwt.verify(token, process.env.JWT_TOKEN);
        
        if (!validToken) {
			res.cookie("Error when trying to login");
			res.redirect("/login");
            logger.error("unable to login, invalid jwt");
		}
        
        res.locals.user = validToken;
        logger.error("successfully logged in");
        next();
	}
	catch (error) {
        res.cookie("Try logging in again!");
        logger.error(err);
        res.redirect('/login')
    }
};
module.exports = {
	CookieAuth,
};
