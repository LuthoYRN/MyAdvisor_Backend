const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested for a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
