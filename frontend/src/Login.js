import "./App.css";
import React from "react";
import CustomInput from "./components/CustomInput";
import Button from "./components/Button";
import Container from "./layout/Container";
import Text from "./components/Text";
import image from "./assets/advisor.png";
import Select from "./components/Select";
import { useNavigate } from "react-router-dom";
import config from "./config";

function Login() {
  let navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleLogin = () => {
    const data = {
      email: username,
      password: password,
    };

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
        console.log(result);
        if (result.status === "fail") {
          // Redirect the user to the appropriate page
          console.log("Login Failed");
        }
        if (result.status === "success") {
          // Redirect the user to the appropriate page
          console.log("Login Success");
          console.log(result);

          localStorage.setItem("user_id", result.user_id);
          if (result.user_type === "student") {
            navigate("/dashboard");
          } else if (result.user_type === "advisor") {
            navigate("/advisorDashboard", { state: result.user_id });
          }
          //add facultyAdmin later
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
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
        <CustomInput
          classNames="mb-1"
          label={"Password"}
          placeholder="Enter your password"
          onValueChange={handlePasswordChange}
          type="password" // This ensures the password is masked
        />
        <Button text={"Login"} onClick={handleLogin} />
        <Text classNames="mt-2" type={"paragraph"}>
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
    </Container>
  );
}

export default Login;
