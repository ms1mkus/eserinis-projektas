import express from "express";
import "express-async-errors";

import authRoutes from "./auth";
import usersRoutes from "./users";
import fishRoutes from "./fish";
import lakesRoutes from "./lakes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/fish", fishRoutes);
router.use("/lake", lakesRoutes);

router.route("/health").get((req, res) => res.send("povilas"));

export default router;
