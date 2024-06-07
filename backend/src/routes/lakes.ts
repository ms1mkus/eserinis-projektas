import express from "express";
import lakeController from "../controllers/lake/lakeController";
const router = express.Router();

router.route("/").get(lakeController.getLakeInfo);

export default router;
