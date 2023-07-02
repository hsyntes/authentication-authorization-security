const express = require("express");
const {
  getUsers,
  getUser,
  deleteMe,
  deactivateMe,
  updateMe,
} = require("../controllers/userController");

const {
  signup,
  login,
  verifyToken,
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
  .route("/username/:username")
  .get(restrict("admin", "lead-guide", "user", "guide"), getUser);

router.patch("/update-password", updatePassword);
router.patch("/update", updateMe);
router.delete("/deactivate", deactivateMe);
router.delete("/delete", deleteMe);

module.exports = router;
