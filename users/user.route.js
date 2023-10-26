const userService = require("./user.service");
const Router = require("express").Router();
const cookieParser = require("cookie-parser");

Router.use(cookieParser());

Router.post("/signup", async (req, res) => {
    const { firstname, lastname, password, email } = req.body;

    const response = await userService.SignUp({
			firstname,
			lastname,
			password,
			email,
		});
    console.log("response:", response);

    if(response.statusCode == 409){
        res.redirect("/404")
    }
    else if (response.statusCode == 500) {
        res.redirect('/404')
    }

    else {
        console.log("hello!");
        res.redirect('/login');
    }
})

Router.post("/login", async (req, res) => {
    const { password, email } = req.body;

    const response = await userService.Login({
        password, email
    })

    if(response.statusCode == 404){
        res.redirect("/404")
    }
    else if (response.statusCode == 422) {
		res.redirect("/404");
	} 
    else if (response.statusCode == 401) {
		res.redirect("/404");
	} 
    else {
        res.cookie("jwt", response.token)
        res.redirect("/dashboard/blog");
	}
})

module.exports = Router;