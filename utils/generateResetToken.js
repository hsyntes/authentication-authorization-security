const crypto = require("crypto");

// * Generating token
module.exports = () => {
  const token = crypto.randomBytes(32).toString("hex");

  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const resetTokenExpiresIn = Date.now() + 5 * 60 * 1000;

  return { token, resetToken, resetTokenExpiresIn };
};
