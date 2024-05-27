import express from "express";
import lakeController from "../controllers/lake/lakeController";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.route("/:lakeId").get(isAuthenticated, lakeController.getLakeInfo);

router.route("/like").post(isAuthenticated, lakeController.likeLake);

router.route("/").get(isAuthenticated, lakeController.getLakes);

router
  .route("/likes/:lakeId")
  .get(isAuthenticated, lakeController.getLikesByLakeId);

export default router;
