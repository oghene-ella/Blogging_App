const supertest = require("supertest");
const app = require("../main");
const { connect } = require("./database");
const UserModel = require("../models/userModel");

// Test suite
describe("Authentication Tests", () => {
	let connection;
	// before hook
	beforeAll(async () => {
		connection = await connect();
	});

	afterEach(async () => {
		await connection.cleanup();
	});

	// after hook
	afterAll(async () => {
		await connection.disconnect();
	});

	// Test case
	it("should successfully register a user", async () => {
		const response = await supertest(app)
			.post("/users/signup")
			.set("content-type", "application/json")
			.send({
				firstname: "Oghenekaro",
				lastname: "Emmanuella",
				password: "123",
				email: "emmanuella@gmail.com",
			});

		// expectations
		expect(response.status).toEqual(201);
		expect(response.body.user).toMatchObject({
			firstname: "Oghenekaro",
			lastname: "Emmanuella",
			password: "123",
			email: "emmanuella@gmail.com",
		});
	});

	// Test case
	it("should successfully login a user", async () => {
		await UserModel.create({
			firstname: "Oghenekaro",
			lastname: "Emmanuella",
			password: "123",
			email: "emmanuella@gmail.com",
		});

		const response = await supertest(app)
			.post("/users/login")
			.set("content-type", "application/json")
			.send({
				password: "123",
				email: "emmanuella@gmail.com",
			});

		// expectations
		expect(response.status).toEqual(200);
		expect(response.body).toMatchObject({
			message: "Login successful",
			token: expect.any(String),
			user: expect.any(Object),
		});

		expect(response.body.user.firstname).toEqual("Oghenekaro");
		expect(response.body.user.email).toEqual("emmanuella@gmail.com");
	});

	it("should not successfully login a user, when user does not exist", async () => {
		await UserModel.create({
			firstname: "Oghenekaro",
			lastname: "Emmanuella",
			password: "123",
			email: "emmanuella@gmail.com",
		});

		const response = await supertest(app)
			.post("/users/login")
			.set("content-type", "application/json")
			.send({
				email: "ellahhh@example.com",
				password: "12345",
			});

		// expectations
		expect(response.status).toEqual(404);
		expect(response.body).toMatchObject({
			message: "User not found",
		});
	});
});
