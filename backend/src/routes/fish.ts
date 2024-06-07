import express from "express";
import fishController from "../controllers/fish/fishController";

const router = express.Router();

router.route("/").post(fishController.createCaughtFishEntry);

export default router;
