const userService = require("./user.service");
const Router = require("express").Router();
const cookieParser = require("cookie-parser");
const logger = require("../log/logger");

Router.use(cookieParser());

Router.post("/signup", async (req, res) => {
    const { firstname, lastname, password, email } = req.body;

    const response = await userService.SignUp({
			firstname,
			lastname,
			password,
			email,
		});

    if(response.statusCode == 409){
        res.redirect("/404");
        logger.error("unable to sign up, email exists");
    }
    else if (response.statusCode == 500) {
        res.redirect('/404')
        logger.error("unable to sign up");
    }
    else {
        res.redirect('/login');
        logger.info("successfully signed up");
    }
})

Router.post("/login", async (req, res) => {
    const { password, email, firstname } = req.body;

    const response = await userService.Login({
        password, email, firstname
    })

    if(response.statusCode == 200){
        res.cookie("jwt", response.token);
        res.redirect("/dashboard");
        logger.info("Successfully logged in");
    }
    else if (response.statusCode == 404) {
		res.redirect("/login");
        logger.error("unable to login, invalid email or password");
	} 
    else if (response.statusCode == 401) {
		res.redirect("/login");
        logger.error("unable to login, unauthorized user");
	} 
    else {
        res.redirect("/login");
        logger.error("unable to login, incorrect email or password");
	}
})

module.exports = Router;