import express from "express";
import lakeController from "../controllers/lake/lakeController";
const router = express.Router();

router.route("/:lakeId").get(lakeController.getLakeInfo);

export default router;
