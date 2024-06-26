import type { Server } from "http";
import request from "supertest";

import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entities/user";
import {
  resetDatabase,
  teardownDatabase,
  createAuthenticatedAgent,
  setupServer,
} from "../utils/testsHelpers";
import { registerTestUser } from "../utils/userHelpers";

let server: Server;

beforeAll(async () => {
  server = await setupServer();
});

afterAll(async () => {
  await teardownDatabase();
  server.close();
});

describe("Auth routes", () => {
  afterEach(async () => {
    await resetDatabase();
  });

  test("Log user by username", async () => {
    const name = "testUser";
    const password = "testUserPwd";
    const user = await registerTestUser({ name, password });

    const res = await request(server)
      .post("/api/auth/login")
      .send({ login: name, password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("Log user by email", async () => {
    const emailAddress = "testUser@gmail.com";
    const password = "testUserPwd";
    const user = await registerTestUser({ emailAddress, password });

    const res = await request(server)
      .post("/api/auth/login")
      .send({ login: emailAddress, password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("Login fails if wrong credentials", async () => {
    const name = "testUser";
    const password = "testUserPwd";
    await registerTestUser({ name, password });

    // Wrong login
    const res1 = await request(server)
      .post("/api/auth/login")
      .send({ login: "wrongLogin", password });

    expect(res1.statusCode).toEqual(401);
    expect(res1.body.message).toEqual("Neteisingi prisijungimo duomenys");

    // Wrong password
    const res2 = await request(server)
      .post("/api/auth/login")
      .send({ login: name, password: "wrongPassword" });

    expect(res2.statusCode).toEqual(401);
    expect(res2.body.message).toEqual("Neteisingi prisijungimo duomenys");
  });

  test("Login fails if request body is invalid", async () => {
    // Missing login
    const res1 = await request(server)
      .post("/api/auth/login")
      .send({ password: "password" });

    expect(res1.statusCode).toEqual(400);
    expect(res1.body.message).toEqual(
      "Reikalingas vartotojo vardas arba el. pašto adresas"
    );

    // Missing password
    const res2 = await request(server)
      .post("/api/auth/login")
      .send({ login: "login" });

    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual("Slaptažodis reikalingas");
  });

  test("Throw an error if authenticated user tries to login", async () => {
    const name = "testUser";
    const password = "testUserPwd";
    const { agent } = await createAuthenticatedAgent(server, {
      name,
      password,
    });

    const res = await agent
      .post("/api/auth/login")
      .send({ login: name, password });
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual("Vartotojas turi būti ne autentifikuotas");
  });

  test("Throw an error if an error occurs during Passport authentication", async () => {
    const username = "testUser";
    const password = "testUserPwd";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jest.spyOn(AppDataSource, "getRepository").mockImplementationOnce((_) => {
      throw "Repo error";
    });

    const res = await request(server)
      .post("/api/auth/login")
      .send({ login: username, password });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual("Unexpected error");
  });

  test("Throw an error if an error occurs during Express login", async () => {
    const serverFailingLogIn = await setupServer(7778, true, {
      logIn: (_, cb) => {
        cb("Error");
      },
    });

    const name = "testUser";
    const password = "testUserPwd";
    await registerTestUser({ name, password });

    const res = await request(serverFailingLogIn)
      .post("/api/auth/login")
      .send({ login: name, password });

    try {
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual("Unexpected error");
    } finally {
      // Use finally to always close the server, even if the tests fail
      serverFailingLogIn.close();
    }
  });

  test('Send "Jūs nesate autentifikuotas" for non authenticated user', async () => {
    const res = await request(server).get("/api/auth/authenticated");

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Jūs nesate autentifikuotas");
  });

  test("Authenticated user is considered as non authenticated if user has been deleted", async () => {
    const name = "testUser";
    const { agent } = await createAuthenticatedAgent(server, { name });

    const repo = AppDataSource.getRepository(User);
    await repo.delete({ username: name });

    const res = await agent.get("/api/auth/authenticated");

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Jūs nesate autentifikuotas");
  });

  test("Throw an error if unauthenticated user tries to logout", async () => {
    const res = await request(server).post("/api/auth/logout");
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual("Vartotojas turi būti autentifikuotas");
  });

  test("Throw an error if an error occurs during Express logout", async () => {
    const serverFailingLogout = await setupServer(7778, true, {
      logout: (cb) => {
        cb("Error");
      },
    });
    const { agent } = await createAuthenticatedAgent(serverFailingLogout);
    const res = await agent.post("/api/auth/logout");

    try {
      expect(res.statusCode).toEqual(403);
    } finally {
      // Use finally to always close the server, even if the tests fail
      serverFailingLogout.close();
    }
  });
});
