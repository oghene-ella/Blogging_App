/** @type {import('tailwindcss').Config} */
module.exports = {
	// content: ["./*.{ejs,js}"],
	content: [
		"./src/**/*.{html,js}",
		"./views/*.ejs",
		"./blogs/*.js",
	],
	theme: {
		extend: {
			fontFamily: {
				sora: ["Sora", "sans-serif"],
				playpen: ["Playpen Sans", "cursive"],
			},
			colors: {
				bg_signup: "#F5FDFF",
				my_blue: "#407BFF",
				light_blue: "#7AA3FF",
			},
		},
	},
	plugins: [],
};

