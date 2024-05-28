import express from "express";

import { isAuthenticated } from "../middlewares/auth";
import commentController from "../controllers/comment/commentController";

const router = express.Router();

router.route("/").post(isAuthenticated, commentController.postComment);
router.route("/:lakeId").get(commentController.getLakeComments);

router.route("/:lakeId").get(commentController.getLakeComments);

export default router;
