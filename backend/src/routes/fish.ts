import express from "express";
import fishController from "../controllers/fish/fishController";

const router = express.Router();

router.route("/").get(fishController.getFishes);
router.route("/create-caught-entry").post(fishController.createCaughtFishEntry);

export default router;
