import express from "express";
import {
  forgotPassword,
  getUserDetails,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
  updateUserDetails,
  updateUserPassword,
  verifyEmail,
} from "../controllers/userController";
import { isAuthenticatedUser } from "../middleware/auth";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticatedUser, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify/email/:token").get(verifyEmail);
router.route("/forgot/password").post(forgotPassword);
router.route("/reset/password/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateUserDetails);

export default router;
