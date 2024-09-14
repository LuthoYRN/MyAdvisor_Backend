import "./App.css";
import React from "react";
import CustomInput from "./components/CustomInput";
import Button from "./components/Button";
import Container from "./layout/Container";
import Text from "./components/Text";
import image from "./assets/advisor.png";
import Select from "./components/Select";
import config from "./config";
import { useNavigate } from "react-router-dom";

function App() {
  const [firstName, setFirstName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [faculty, setFaculty] = React.useState("");
  const [majors, setMajors] = React.useState([]);
  const [firstMajor, setFirstMajor] = React.useState("");
  const [secondMajor, setSecondMajor] = React.useState("");
  const [thirdMajor, setThirdMajor] = React.useState("");
  const navigate = useNavigate();

  const handleFacultyChange = (value) => {
    setFaculty(value);
    const fetchMajors = async (facultyID) => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/auth/signup/${facultyID}`
        );
        const data = await response.json();
        setMajors(data.data);
        console.log("Majors:", data);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors(value);
  };

  const handleRegister = () => {
    fetch(`${config.backendUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      name: firstName,
      surname: surname,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      majors: [firstMajor, secondMajor, thirdMajor],
      programmeID: null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
      if (data.status === "fail") {
        alert(data.message);
      } else {
        localStorage.setItem("user_id", data.user_id);
        navigate("/courseSelection");
      }
      })
      .catch((error) => {
      console.error("Error:", error);
      });
  };

  React.useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/auth/signup/`);
        const data = await response.json();

        setFaculties(data.data);
        console.log("Faculties:", data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    fetchFaculties();
  }, []);

  const [faculties, setFaculties] = React.useState([]);
  return (
    <div className="App">
      <Container>
        <form
          className="col-span-5 flex flex-col h-full justify-center my-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <Text classNames="mb-8" type={"heading"}>
            Let's get started!
          </Text>
          <div className="flex justify-between gap-8 mb-1">
            <CustomInput
              classNames={"w-full"}
              label={"First Name"}
              placeholder="Enter your first name"
              onValueChange={(value)=>setFirstName(value)}
            />
            <CustomInput
              classNames={"w-full"}
              label={"Surname"}
              placeholder="Enter your surname"
              onValueChange={(value)=>setSurname(value)}
            />
          </div>
          <CustomInput
            classNames=" mb-2"
            label={"Email Address"}
            placeholder="Enter your Email Address"
            onValueChange={(value)=>setEmail(value)}
          />
          <div className="flex justify-between gap-8 mb-1">
            <CustomInput
              classNames={"w-full"}
              label={"Password"}
              placeholder="Enter your password"
              onValueChange={(value)=>setPassword(value)}
            />
            <CustomInput
              classNames={"w-full"}
              label={"Confirm Password"}
              placeholder="Confirm your password"
              onValueChange={(value)=>setConfirmPassword(value)}
            />
          </div>

          <Select
            classNames=" mb-2"
            label={"Faculty"}
            options={[
              { value: "", label: "Select Faculty" },
              ...faculties.map((faculty) => ({
                value: faculty.id,
                label: faculty.facultyName,
              })),
            ]}
            onChange={handleFacultyChange}
          />
          <div className="flex flex-col gap-1 justify-between mb-1">
            <Select
              label={"First Major"}
              options={[
                { value: "", label: "Select First Major" },
                ...majors
                  .filter(
                    (major) =>
                      major.id !== secondMajor && major.id !== thirdMajor
                  )
                  .map((major) => ({
                    value: major.id,
                    label: major.majorName,
                  })),
              ]}
              onChange={(value) => setFirstMajor(value)}
            />
            <Select
              label={"Second Major"}
              options={[
                { value: "", label: "Select Second Major" },
                ...majors
                  .filter(
                    (major) =>
                      major.id !== firstMajor && major.id !== thirdMajor
                  )
                  .map((major) => ({
                    value: major.id,
                    label: major.majorName,
                  })),
              ]}
              onChange={(value) => setSecondMajor(value)}
            />
            <Select
              label={"Third Major"}
              options={[
                { value: "", label: "Select Third Major" },
                ...majors
                  .filter(
                    (major) =>
                      major.id !== firstMajor && major.id !== secondMajor
                  )
                  .map((major) => ({
                    value: major.id,
                    label: major.majorName,
                  })),
              ]}
              onChange={(value) => setThirdMajor(value)}
            />
          </div>

          <Button
            text={"Register"}
            onClick={(e) => {
              e.preventDefault();
              if (
                !firstName ||
                !surname ||
                !email ||
                !password ||
                !confirmPassword ||
                !faculty ||
                !firstMajor ||
                !secondMajor ||
                !thirdMajor
              ) {
                alert("Please fill in all required fields.");
                return;
              }
              if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
              }
              handleRegister();
            }}
          />
        </form>
        <img
          className="col-span-8 col-start-7 my-auto"
          src={image}
          alt="advisor"
        />
      </Container>
    </div>
  );
}

export default App;
