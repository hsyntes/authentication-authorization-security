const ErrorProvider = require("../classes/ErrorProvider");
const User = require("../models/userModel");
const jsonwebtoken = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const sendToken = (res, statusCode, user) => {
  // * Generate token
  const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // * Save the token cookie
  res.cookie("jsonwebtoken", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  });

  // * Removing sensetive or unneccessary data from the response object
  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    // * Creating user
    const user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      birthDate: req.body.birthDate,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    sendToken(res, 201, user);
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !req.body.password)
      return next(
        new ErrorProvider(
          403,
          "fail",
          "Type your email address or username and password"
        )
      );

    let user;

    if (!user)
      return next(new ErrorProvider(404, "fail", "That user doesn't exist."));

    // * Allow both email and username to log in
    if (email.includes("@"))
      user = await User.findOne({ email }).select("+password");
    else user = await User.findOne({ username: email }).select("+password");

    if (!(await user.isPasswordCorrect(req.body.password, user.password)))
      return next(new ErrorProvider(401, "fail", "Email or password wrong."));

    // * If the user's status not active, activate it
    user.active = true;

    // * Saving on the document as well
    await user.save({ validateBeforeSave: false });

    sendToken(res, 200, user);
  } catch (e) {
    next(e);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return next(
        new ErrorProvider(403, "fail", "Please type your email address.")
      );

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorProvider(404, "fail", "User not found."));

    const passwordResetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // * Sending email with reset link
    try {
      const passwordResetLink = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/reset-password/${passwordResetToken}`;

      await sendEmail({
        to: email,
        subject: "Reset Password",
        text: `Please click on the following link to reset your password. ${passwordResetLink}`,
      });

      res.status(200).json({
        status: "success",
        message: "Token has been sent to your email address.",
      });
    } catch (e) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiresIn = undefined;

      await user.save({ validateBeforeSave: false });

      return next(
        new ErrorProvider(
          500,
          "fail",
          "Token couldn't send to your email address."
        )
      );
    }
  } catch (e) {
    next(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // * Hash the token which is come from params (url) and
    // * not hashed
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(req.params.passwordResetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: passwordResetToken,
      passwordResetTokenExpiresIn: { $gte: Date.now() },
    }).select("+password");

    if (!user)
      return next(
        new ErrorProvider(400, "fail", "Password reset token has expired.")
      );

    if (await user.isPasswordCorrect(req.body.password, user.password))
      return next(
        new ErrorProvider(400, "fail", "Password is alredy the same.")
      );

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // * Remove the sensetive or unneccessary data from the document
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    await user.save();

    sendToken(res, 200, user);
  } catch (e) {
    next(e);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ").at(1);

    if (!token)
      return next(
        new ErrorProvider(
          401,
          "fail",
          "Couldn't authenticated. Please try to log in."
        )
      );

    // * Verifying token
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select("+password");

    if (!currentUser)
      return next(
        new ErrorProvider(401, "fail", "You are not logged in. Please log in.")
      );

    // * Grand access to the current user.
    req.user = currentUser;

    next();
  } catch (e) {
    next(e);
  }
};

// * Role-based access control
exports.restrict =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorProvider(
          403,
          "fail",
          "You do not have permission to perform this action"
        )
      );
    }

    next();
  };

exports.updatePassword = async (req, res, next) => {
  try {
    if (!req.body.currentPassword)
      return next(
        new ErrorProvider(403, "fail", "Please confirm your password.")
      );

    if (!req.body.password)
      return next(new ErrorProvider(403, "fail", "Please set a new password."));

    if (
      !(await req.user.isPasswordCorrect(
        req.body.currentPassword,
        req.user.password
      ))
    )
      return next(new ErrorProvider(401, "fail", "Wrong password."));

    if (await req.user.isPasswordCorrect(req.body.password, req.user.password))
      return next(
        new ErrorProvider(
          401,
          "fail",
          "The new password cannot be the same with previous password."
        )
      );

    req.user.password = req.body.password;
    req.user.passwordConfirm = req.body.password;

    await req.user.save();

    sendToken(res, 200, req.user);
  } catch (e) {}
};
