const nodemailer = require("nodemailer");

module.exports = async (headers) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Huseyin Ates - Software Engineer <se.hsyntes@gmail.com>",
    ...headers,
  });
};
