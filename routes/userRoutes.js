const express = require("express");
const { getUsers, getUser } = require("../controllers/userController");
const {
  signup,
  login,
  deactivate,
  verifyToken,
  close,
  updatePassword,
  forgotPassword,
  resetPassword,
  restrict,
} = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getUsers);

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:passwordResetToken", resetPassword);

router.use(verifyToken);
// * Protect after this

router
  .route("/:username")
  .get(restrict("admin", "lead-guide", "user", "guide"), getUser);

router.patch("/update-password", updatePassword);
router.delete("/deactivate", deactivate);
router.delete("/close", close);

module.exports = router;
