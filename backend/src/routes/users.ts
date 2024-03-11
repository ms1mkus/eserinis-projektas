import express from "express";

import UsersController from "../controllers/users";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

const multer = require("multer");
const upload = multer();

router.route("/").post(UsersController.create);

router.route("/profile").get(isAuthenticated, UsersController.getProfileById);

router
  .route("/profile")
  .post(
    isAuthenticated,
    upload.single("avatar"),
    UsersController.updateProfile
  );

export default router;
