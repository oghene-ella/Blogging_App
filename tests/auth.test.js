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
            .type("form")
            .send({
                firstname: "oghenekaro",
                lastname: "emmanuella",
                password: "12345",
                email: "ellahhh@example.com",
            });

        expect(response.status).toEqual(302);
        expect(response.header.location).toBe("/login");
    });

    it('should successfully login a user', async () => {
        await UserModel.create({
            firstname: "oghenekaro",
            lastname: "emmanuella",
            password: "12345",
            email: "ellahhh@example.com",
            
        });

        const response = await supertest(app)
        .post('/users/login')
        .type('form')
        .send({
            password: "12345",
            email: "ellahhh@example.com",
        })

        expect(response.status).toEqual(302)
        
        expect(response.header.location).toBe("/dashboard")
    })

    it('should not successfully login a user, when user does not exist', async () => {
        await UserModel.create({
            firstname: "oghenekaro",
            lastname: "emmanuella",
            password: "12345",
            email: "ellahhh@example.com",
        });

        const response = await supertest(app)
        .post('/users/login')
        .type('form')
        .send({
            password: "123",
            email: "ella@example.com",
        })
        .expect(302);
        expect(response.header.location).toBe("/login");
    })
});