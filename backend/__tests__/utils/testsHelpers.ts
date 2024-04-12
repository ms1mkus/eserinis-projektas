import type { Server } from "http";
import request from "supertest";
import type { Express } from "express";

import createServer from "../../src/config/server";
import { AppDataSource } from "../../src/data-source";
import type { TestUserAttributes } from "./userHelpers";
import { registerTestUser } from "./userHelpers";

interface OverrideExpressOptions {
  logout?: (cb: any) => unknown;
  logIn?: (user: any, cb: any) => unknown;
}

const setupExpressOverrides = (
  server: Express,
  overrideExpressOptions: OverrideExpressOptions
) => {
  if (overrideExpressOptions.logout) {
    server.request.logOut = overrideExpressOptions.logout;
  }
  if (overrideExpressOptions.logIn) {
    server.request.logIn = overrideExpressOptions.logIn;
  }
  return server;
};

//SET UP PHASE FOR INTEGRATION TESTS
export const setupServer = async (
  port = 7777,
  preventDatabaseConnection = false,
  overrideExpressOptions?: OverrideExpressOptions
) => {
  const server = createServer();
  if (overrideExpressOptions) {
    setupExpressOverrides(server, overrideExpressOptions);
  }

  if (!preventDatabaseConnection) {
    await AppDataSource.initialize();
  }

  return server.listen(port);
};

export const teardownDatabase = async () => {
  await AppDataSource.destroy();
};

//TEARN DOWN PHASE FOR ITNEGRATION TESTS
export const resetDatabase = async () => {
  const tables = AppDataSource.entityMetadatas
    .map((entity) => `"${entity.tableName}"`)
    .join(", ");
  await AppDataSource.query(`TRUNCATE ${tables} CASCADE;`);
};

//SET UP PHASE (SETUP AUTHENTICATED USER)
export const createAuthenticatedAgent = async (
  server: Server,
  testUser?: TestUserAttributes
) => {
  const userAgent = request.agent(server);
  const user = await registerTestUser(testUser);
  await userAgent
    .post("/api/auth/login")
    .send({ login: user.username, password: testUser?.password || "password" });

  return { agent: userAgent, user };
};
