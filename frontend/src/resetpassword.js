import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import image from "./assets/advisor.png";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import Text from "./components/Text";
import Container from "./layout/Container";
import config from "./config";
import SuccessModal from "./components/successModal";
import ErrorModal from "./components/errorModal";

function ResetPassword() {
  let navigate = useNavigate();
  const { token } = useParams(); // Extract token from URL

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleResetPassword = async () => {
    // No need to pass token here
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    const password_data = {
      newPassword: password,
    };

    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `${config.backendUrl}/api/auth/reset-password/${token}`, // Token in the URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(password_data),
        }
      );

      const data = await response.json();
      setIsLoading(false);
      if (data.status === "success") {
        setShowSuccessModal(true);
      } else if (data.status === "fail") {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setIsLoading(false);
      setShowErrorModal(true); // Show error modal in case of failure
    }
  };

  return (
    <Container>
      <form className="col-span-3 gap-4 flex flex-col h-full justify-center my-auto">
        <Text type={"heading"}>Reset Password</Text>
        <CustomInput
          classNames="mb-1"
          label={"New Password"}
          placeholder="Enter your new password"
          onValueChange={handlePasswordChange}
          type="password"
        />
        {passwordError && (
          <Text classNames="text-red-500">{passwordError}</Text>
        )}
        <CustomInput
          classNames="mb-1"
          label={"Confirm Password"}
          placeholder="Confirm your new password"
          onValueChange={handleConfirmPasswordChange}
          type="password"
        />
        {confirmPasswordError && (
          <Text classNames="text-red-500">{confirmPasswordError}</Text>
        )}

        <Button
          text={"Reset Password"}
          loading={isLoading}
          disabled={isLoading}
          onClick={handleResetPassword} // Now using the token correctly
        />

        <Text classNames="mt-2" type={"paragraph"}>
          Remember your password?{" "}
          <span
            className="text-blue-600 cursor-pointer underline hover:text-blue-800"
            onClick={() => navigate("/")}
          >
            Log in
          </span>
        </Text>
      </form>
      <img
        className="col-span-8 col-start-7 my-auto"
        src={image}
        alt="advisor"
      />

      {/* Error modal */}
      <ErrorModal
        isOpen={showErrorModal}
        title="Error"
        message="Password reset failed"
        onContinue={() => setShowErrorModal(false)}
      />

      {/* Success modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Success"
        message="Password reset successfully."
        onClose={() => navigate("/")}
      />
    </Container>
  );
}

export default ResetPassword;
