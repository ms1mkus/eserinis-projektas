import express from "express";
import lakeController from "../controllers/lake/lakeController";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.route("/:lakeId").get(isAuthenticated, lakeController.getLakeInfo);

export default router;
