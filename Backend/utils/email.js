const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetLink) => {
  // Gmail SMTP Transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  // Mail Options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's Gmail address
    to: email, // Recipient's email address
    subject: "Password Reset Request",
    text: `You requested for a password reset. Click here to reset your password: ${resetLink}`,
    html: `<p>You requested for a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    headers: {
      "Reply-To": process.env.EMAIL_USER, // Reply-to address (Gmail)
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email.");
  }
};

module.exports = { sendResetEmail };
