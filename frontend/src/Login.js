import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import image from "./assets/advisor.png";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import Text from "./components/Text";
import config from "./config";
import Container from "./layout/Container";

function Login() {
  let navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [usernameError, setUsernameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [usernamePasswordError, setUsernamePasswordError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleLogin = () => {
    setUsernameError("");
    setPasswordError("");
    setUsernamePasswordError("");

    if (!username) {
      setUsernameError("Username is required");
      return; // Stop the function if the username is missing
    }

    if (!password) {
      setPasswordError("Password is required");
      return; // Stop the function if the password is missing
    }
    const data = {
      email: username,
      password: password,
    };
    setIsLoading(true); // Start loading
    fetch(`${config.backendUrl}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Allow the specified HTTP methods
        "Access-Control-Allow-Headers": "Content-Type", // Allow the specified headers
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // Handle the response from the API
        if (result.status === "fail") {
          // Display a specific error based on the failure reason
          setIsLoading(false); // Start loading
          if (result.message === "Incorrect email or password") {
            setPasswordError("Incorrect password");
          } else if (result.message === "User not found") {
            setUsernameError("User not found");
          } else {
            setUsernamePasswordError("Login failed, please try again.");
          }
        }
        if (result.status === "success") {
          // Redirect the user to the appropriate page
          setIsLoading(false); // Start loading
          localStorage.setItem("user_id", result.user_id);
          if (result.user_type === "student") {
            navigate("/dashboard");
          } else if (result.user_type === "advisor") {
            navigate("/advisorDashboard", { state: result.user_id });
          } else if (result.user_type === "systemAdmin") {
            navigate("/userManagement");
          } else if (result.user_type === "facultyAdmin") {
            navigate("/facultyAdminDashboard");
          }
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        setIsLoading(false); // Start loading
        alert(error);
      });
  };

  return (
    <Container>
      <form class="col-span-3 gap-4 flex flex-col h-full justify-center my-auto">
        <Text classNames="mb-8" type={"heading"}>
          Login
        </Text>
        <CustomInput
          classNames="mb-1"
          label={"Username"}
          placeholder="Enter your username"
          onValueChange={handleUsernameChange}
        />
        {usernameError && (
          <Text classNames="text-red-500">{usernameError}</Text>
        )}
        <CustomInput
          classNames="mb-1"
          label={"Password"}
          placeholder="Enter your password"
          onValueChange={handlePasswordChange}
          type="password" // This ensures the password is masked
        />
        {passwordError && (
          <Text classNames="text-red-500">{passwordError}</Text>
        )}

        <Button
          text={"Login"}
          loading={isLoading} // If true, show the spinner
          disabled={isLoading}
          onClick={handleLogin}
        />

        {usernameError && passwordError && (
          <Text classNames="text-red-500">{usernamePasswordError}</Text>
        )}

        <Text classNames="mt-2" type={"paragraph"}>
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline hover:text-blue-800"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </Text>
        <Text type={"paragraph"}>
          Forgot your password?{" "}
          <span
            className="text-blue-600 cursor-pointer underline hover:text-blue-800"
            onClick={() => navigate("/forgot-password")}
          >
            Reset it
          </span>
        </Text>
      </form>
      <img class="col-span-8 col-start-7  my-auto" src={image} alt="advisor" />
    </Container>
  );
}

export default Login;
