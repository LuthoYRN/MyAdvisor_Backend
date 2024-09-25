const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetLink) => {
  // Extract the domain from the recipient's email
  const emailDomain = email.split("@")[1];

  let transporter;

  // Determine which email service to use based on the recipient's email domain
  if (emailDomain.includes("gmail.com")) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP server
      port: 465, // Secure port for Gmail
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // Gmail user
        pass: process.env.EMAIL_PASS, // Gmail password or app password
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: "smtp.office365.com", // Outlook/Office365 SMTP server
      port: 587, // Secure port for Outlook
      secure: false, // Use STARTTLS (not SSL)
      auth: {
        user: process.env.OTHER_EMAIL_USER, // Outlook user
        pass: process.env.OTHER_EMAIL_PASS, // Outlook password
      },
    });
  }

  // Common mail options
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
