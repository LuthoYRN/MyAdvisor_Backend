const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetLink) => {
  const emailDomain = email.split("@")[1];

  let transporter;

  if (emailDomain.includes("gmail.com")) {
    // Gmail SMTP settings
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Gmail user
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
    });
  } else {
    // Outlook/Office365 SMTP settings
    transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.OTHER_EMAIL_USER, // Outlook/Office365 user
        pass: process.env.OTHER_EMAIL_PASS, // App password for Outlook
      },
      tls: {
        ciphers: "TLSv1.2",
      },
    });
  }

  const mailOptions = {
    from: emailDomain.includes("gmail.com")
      ? process.env.EMAIL_USER
      : process.env.OTHER_EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `You requested for a password reset. Click here to reset your password: ${resetLink}`,
    html: `<p>You requested for a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    headers: {
      "Reply-To": emailDomain.includes("gmail.com")
        ? process.env.EMAIL_USER
        : process.env.OTHER_EMAIL_USER,
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