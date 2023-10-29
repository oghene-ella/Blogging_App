const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SignUp = async ({ firstname, lastname, password, email }) => {
	try {
		// check existing email
		const checkExistingEmail = await UserModel.findOne({ email: email });

		if (checkExistingEmail) {
			return {
				statusCode: 409,
				message: "Email already exists",
				success: false,
			};
		}

		const newUser = await UserModel.create({
			firstname: firstname, 
            lastname: lastname,
			email: email,
			password: password,
		});

		const token = jwt.sign(
			{ _id: newUser._id, email: newUser.email },
			process.env.JWT_TOKEN,
		);

		return {
			statusCode: 201,
			message: "User Created Successfully",
			success: true,
			newUser,
			token,
		};
	} catch (err) {
        console.log("error:", err);
		return {
			statusCode: 500,
			message: "Something went wrong, go home",
			success: false,
		};
	}
};

const Login = async ({email, password}) => {
    try {
        const existingUser = await UserModel.findOne({
            email: email,
        });
        
        if (!existingUser) {
            return {
                statusCode: 404,
                message: "Invalid Email or Password",
                success: false,
            };
}
        
        const validatePassword = await existingUser.isValidPassword(password);
    
        if (!validatePassword) {
            return {
                statusCode: 422,
                message: "Incorrect Email or Password",
                success: false,
            };
        }
        const token = jwt.sign(
            {
                email: existingUser.email,
                _id: existingUser._id,
                firstname: existingUser.firstname,
            },
            process.env.JWT_TOKEN,
            { expiresIn: "1h" },
        );

        return {
            statusCode: 200,
            message: "Login was successful",
            user: existingUser.email,
            token,
            success: true,
        };
    } catch (error) {
        return {
            statusCode: 401,
            message: "Unauthorized User",
            success: false,
        };
    }
};
module.exports = {
	SignUp,
	Login,
};