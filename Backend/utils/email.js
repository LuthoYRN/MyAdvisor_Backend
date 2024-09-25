const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 465, // Secure port for Gmail
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use app password if 2FA is enabled
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `You requested for a password reset. Click here to reset your password: ${resetLink}`,
    html: `<p>You requested for a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    headers: {
      "Reply-To": process.env.EMAIL_USER, // Ensure you add the Reply-To header
    },
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
