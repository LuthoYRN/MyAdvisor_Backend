import React, { useState, useEffect } from "react";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernamePasswordError, setUsernamePasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New states for blocking after too many failed attempts
  const [attemptCount, setAttemptCount] = useState(
    Number(localStorage.getItem("attemptCount")) || 0
  );
  const [blockTime, setBlockTime] = useState(0); // Time in seconds
  const [blockExpiresAt, setBlockExpiresAt] = useState(
    localStorage.getItem("blockExpiresAt") || null
  );

  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  // Effect to handle countdown of block time and persist block state
  useEffect(() => {
    if (blockExpiresAt) {
      const now = new Date().getTime();
      if (now < blockExpiresAt) {
        const remainingTime = Math.floor((blockExpiresAt - now) / 1000);
        setBlockTime(remainingTime);
      } else {
        // Block expired, clear it
        setBlockTime(0);
        setAttemptCount(0);
        setBlockExpiresAt(null);
        localStorage.removeItem("attemptCount");
        localStorage.removeItem("blockExpiresAt");
        setUsernamePasswordError("");
      }
    }

    // Countdown for block time
    if (blockTime > 0) {
      const interval = setInterval(() => {
        setBlockTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [blockTime, blockExpiresAt]);

  const handleLogin = () => {
    setUsernameError("");
    setPasswordError("");
    setUsernamePasswordError("");

    // If block time is active, prevent login attempt
    if (blockTime > 0) {
      setUsernamePasswordError(
        `You are blocked for ${blockTime} more seconds.`
      );
      return;
    }

    if (!username) {
      setUsernameError("Username is required");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    const data = {
      email: username,
      password: password,
    };

    setIsLoading(true);
    fetch(`${config.backendUrl}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "fail") {
          setIsLoading(false);

          // Increment failed attempt count if login fails
          const newAttemptCount = attemptCount + 1;
          setAttemptCount(newAttemptCount);
          localStorage.setItem("attemptCount", newAttemptCount);

          if (newAttemptCount >= 5) {
            // Start block time immediately after 5 failed attempts
            const newBlockTime = Math.min((newAttemptCount - 4) * 60, 300); // Example: 1 minute for 1st block, 2 for 2nd, max 5 min
            const blockExpires = new Date().getTime() + newBlockTime * 1000;
            setBlockExpiresAt(blockExpires);
            setBlockTime(newBlockTime); // Set block time to start countdown
            localStorage.setItem("blockExpiresAt", blockExpires);

            setUsernamePasswordError(
              `Too many attempts. You are blocked for ${newBlockTime} seconds.`
            );
          } else {
            setUsernamePasswordError("Incorrect username or password.");
          }
        }

        if (result.status === "success") {
          // Redirect the user to the appropriate page and reset attempts
          setIsLoading(false);
          setAttemptCount(0);
          localStorage.removeItem("attemptCount");
          localStorage.removeItem("blockExpiresAt");
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
        setIsLoading(false);
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
          type="password"
        />
        {passwordError && (
          <Text classNames="text-red-500">{passwordError}</Text>
        )}

        <Button
          text={"Login"}
          loading={isLoading}
          disabled={isLoading || blockTime > 0}
          onClick={handleLogin}
        />

        {blockTime > 0 && (
          <Text classNames="text-red-500">
            You are blocked for {blockTime} more seconds.
          </Text>
        )}

        {usernamePasswordError && (
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
      <img class="col-span-8 col-start-7 my-auto" src={image} alt="advisor" />
    </Container>
  );
}

export default Login;
