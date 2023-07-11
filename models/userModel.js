const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const generateResetToken = require("../utils/generateResetToken");

// * Mongoose Schema Structure
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required."],
      minlength: [2, "Firstname must be minimum 2 characters."],
      trim: true,
    },

    lastname: {
      type: String,
      required: [true, "Lastname is required."],
      minlength: [2, "Lastname must be minimum 2 characters."],
      trim: true,
    },

    username: {
      type: String,
      required: [true, "@username is required."],
      lowercase: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      lowercase: true,
      trim: true,
      unique: true,
      validator: [validator.isEmail, "Please type a valid email address"],
    },

    birthDate: {
      type: Date,
      required: [true, "Birth date is required."],
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password cannot be less than 8 characters."],
      trim: true,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      trim: true,
      validate: {
        validator: function (value) {
          return value === this.password;
        },

        message: "Password doesn't match.",
      },
    },

    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,

    emailResetToken: String,
    emailResetTokenExpiresIn: Date,

    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { versionKey: false }
);

// * Document Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// * Query Middleware
userSchema.pre("find", function (next) {
  this.find({ active: { $ne: false } });

  next();
});

// * Instance Methods
userSchema.methods.isPasswordCorrect = async (candidate, password) =>
  await bcrypt.compare(candidate, password);

// * Generating token to reset password
userSchema.methods.generatePasswordResetToken = function () {
  // const passwordResetToken = crypto.randomBytes(32).toString("hex");

  // this.passwordResetToken = crypto
  //   .createHash("sha256")
  //   .update(passwordResetToken)
  //   .digest("hex");

  // this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  // return passwordResetToken;

  const { token, resetToken, resetTokenExpiresIn } = generateResetToken();

  this.passwordResetToken = resetToken;
  this.passwordResetTokenExpiresIn = resetTokenExpiresIn;

  return token;
};

userSchema.methods.generateEmailResetToken = function () {
  const { token, resetToken, resetTokenExpiresIn } = generateResetToken();

  this.emailResetToken = resetToken;
  this.emailResetTokenExpiresIn = resetTokenExpiresIn;

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
