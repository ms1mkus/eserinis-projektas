import express from "express";
import fishController from "../controllers/fish/fishController";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(fishController.getFishes);
router
  .route("/create-caught-entry")
  .post(isAuthenticated, fishController.createCaughtFishEntry);

export default router;
