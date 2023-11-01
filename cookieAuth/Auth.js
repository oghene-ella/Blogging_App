const jwt = require("jsonwebtoken");
require("dotenv").config();

const CookieAuth = (req, res, next) => {
	try {
        const token = req.cookies.jwt;

        if (!token) {
            res.cookie("Error when trying to login")
            res.redirect('/login')
        }
        
        const validToken = jwt.verify(token, process.env.JWT_TOKEN);
        
        if (!validToken) {
			res.cookie("Error when trying to login");
			res.redirect("/login");
		}
        
        res.locals.user = validToken;
        next();
	}
	catch (error) {
        res.cookie("Try logging in again!");
        res.redirect('/login')
    }
};
module.exports = {
	CookieAuth,
};
