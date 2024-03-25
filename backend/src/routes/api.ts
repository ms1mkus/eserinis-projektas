import express from "express";
import "express-async-errors";

import authRoutes from "./auth";
import usersRoutes from "./users";
import { AppDataSource } from "../data-source";
import { Lake } from "../entities/lake";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

router.route("/health").get((req, res) => res.send("martynas!"));
router.route("/lakes").get(isAuthenticated, async function (request, response) {
  const databaseConnection = AppDataSource.getRepository(Lake);
  const lakes = await databaseConnection.find();
  response.send(lakes);
});

export default router;
