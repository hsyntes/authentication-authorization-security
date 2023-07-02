const ErrorProvider = require("../classes/ErrorProvider");
const User = require("../models/userModel");

exports.getUsers = async (req, res, next) => {
  try {
    const queries = { ...req.query };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((excludedField) => delete queries[excludedField]);

    let Query;

    Query = User.find(
      JSON.parse(
        JSON.stringify(queries).replace(
          /\b(gt|gte|lt|le)\b/,
          (match) => `$${match}`
        )
      )
    );

    if (req.query.sort) {
      const { sort } = req.query;
      Query = Query.sort(sort.split(",").join(" "));
    }

    if (req.query.fields) {
      const { fields } = req.query;
      Query = Query.select(fields.split(",").join(" "));
    }

    // const users = await User.find();
    const users = await Query;

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "+active"
    );

    if (!user) return next(new ErrorProvider(404, "fail", "User not found."));

    if (!user.active)
      return res.status(200).json({
        status: "success",
        message: "Inactive user.",
        data: null,
      });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (e) {
    next(e);
  }
};
