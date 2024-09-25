import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import image from "./assets/advisor.png";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import Text from "./components/Text";
import config from "./config";
import Container from "./layout/Container";
import SuccessModal from "./components/successModal";
import ErrorModal from "./components/errorModal";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handleForgotPassword = async () => {
    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    let email_data = {
      email: email,
    };

    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `${config.backendUrl}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email_data),
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
      console.error("Error resetting link:", error);
    }
  };

  return (
    <Container>
      <form class="col-span-3 gap-4 flex flex-col h-full justify-center my-auto">
        <Text type={"heading"}>Forgot Password</Text>
        <CustomInput
          classNames="mb-1"
          label={"Email"}
          placeholder="Enter your email"
          onValueChange={handleEmailChange}
        />
        {emailError && <Text classNames="text-red-500">{emailError}</Text>}

        <Button
          text={"Send Reset Link"}
          loading={isLoading} // If true, show the spinner
          disabled={isLoading}
          onClick={handleForgotPassword}
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
        <Text type={"paragraph"}>
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline hover:text-blue-800"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </Text>
      </form>
      <img class="col-span-8 col-start-7  my-auto" src={image} alt="advisor" />
      <ErrorModal
        isOpen={showErrorModal}
        title="Error"
        message="Failed to send password reset link. Try again."
        onContinue={() => setShowErrorModal(false)} // Fix: use the state setter function
      />
      <SuccessModal
        isOpen={showSuccessModal}
        title="Success"
        message="Password reset link sent to your email."
        onClose={() => navigate(-1)}
      />
    </Container>
  );
}

export default ForgotPassword;
