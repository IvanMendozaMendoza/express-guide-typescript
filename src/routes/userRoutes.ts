import { Router } from "express";
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/usersController.js";
import { signUp, logIn } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;

// #################################
// TODO Only admins can create users
// router.route("/").post(createUser)
// #################################
