import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./App.css";
import image from "./assets/advisor.png";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import Select from "./components/Select";
import Text from "./components/Text";
import config from "./config";
import Container from "./layout/Container";

function App() {
  const [firstName, setFirstName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [faculty, setFaculty] = React.useState("");
  const [majors, setMajors] = React.useState(null);
  const [firstMajor, setFirstMajor] = React.useState("");
  const [secondMajor, setSecondMajor] = React.useState("");
  const [thirdMajor, setThirdMajor] = React.useState("");
  const [programme, setProgramme] = React.useState("");
  const [curriculums, setCurriculums] = React.useState([]);
  const navigate = useNavigate();
  const [showRequiredFieldsModal, setShowRequiredFieldsModal] = React.useState(false);
  const [showPasswordMismatchModal, setShowPasswordMismatchModal] = React.useState(false);
  const [showEmailMismatchModal, setEmailMismatchModal] = React.useState(false);
  const [showPasswordLengthModal, setPasswordLengthModal] = React.useState(false);
  const [showEmailInUse, setEmailInUse] = React.useState(false);
  const [showNameSurname, setNameSurname] = React.useState(false);


  const handleFacultyChange = (value) => {
    setFaculty(value);
    setFirstMajor(null);
    setSecondMajor(null);
    setThirdMajor(null);
    setProgramme(null);
    const fetchMajors = async (facultyID) => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/auth/signup/${facultyID}`
        );
        const data = await response.json();
        if (data.curriculumsOffered === "Programmes") {
          setCurriculums(data.data);
          setMajors(null);
        } else {
          setMajors(data.data);
          setCurriculums(null);
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors(value);
  };

  const handleRegister = () => {
    const selectedMajors = [firstMajor, secondMajor, thirdMajor].filter(
      Boolean
    );

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
        majors: selectedMajors.length >= 1 ? selectedMajors : null,
        programmeID: programme ? programme : null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {

        if (data.status === "fail") {
          if (data.message[0] === "Invalid email format.") {
            setEmailMismatchModal(true);
            return;
          }
          if (data.message === "Password should be between 6 and 255 characters long.") {
            setPasswordLengthModal(true);
            return;
          }
          if (data.message === "Email is already in use") {
            setEmailInUse(true);
            return;
          }
          if (data.message[0] === "Name must only contain letters." || data.message[1] === "Surname must only contain letters.") {
            setNameSurname(true);
            return;
          }
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
              onValueChange={(value) => setFirstName(value)}
            />
            <CustomInput
              classNames={"w-full"}
              label={"Surname"}
              placeholder="Enter your surname"
              onValueChange={(value) => setSurname(value)}
            />
          </div>
          <CustomInput
            classNames=" mb-2"
            label={"Email Address"}
            placeholder="Enter your Email Address"
            onValueChange={(value) => setEmail(value)}
          />
          <div className="flex justify-between gap-8 mb-1">
            <CustomInput
              classNames={"w-full"}
              label={"Password"}
              placeholder="Enter your password"
              onValueChange={(value) => setPassword(value)}
              type="password" // This ensures the password is masked
            />
            <CustomInput
              classNames={"w-full"}
              label={"Confirm Password"}
              placeholder="Confirm your password"
              onValueChange={(value) => setConfirmPassword(value)}
              type="password" // This ensures the password is masked
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
          {majors ? (
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
          ) : curriculums ? (
            <Select
              label={"Curriculum"}
              options={[{ value: "", label: "Select Curriculum" }, ...curriculums.map((curriculum) => ({
                value: curriculum.id,
                label: curriculum.programmeName,
              }))
              ]}
              onChange={(value) => setProgramme(value)}
              classNames={"mb-2"}
            />
          ) : null}
          <div class="flex gap-8">
            <Button
              text={"Register"}
              onClick={(e) => {
                e.preventDefault();
                // Array of selected majors
                const selectedMajors = [
                  firstMajor,
                  secondMajor,
                  thirdMajor,
                ].filter(Boolean);
                if (
                  !firstName ||
                  !surname ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !faculty ||
                  (!programme && selectedMajors.length < 1) // Ensure at least one major is selected if no program is selected
                ) {
                  setShowRequiredFieldsModal(true);
                  return;
                }
                if (password !== confirmPassword) {
                  setShowPasswordMismatchModal(true);
                  return;
                }
                handleRegister();
              }}
            />
            <Button text="Back" type={"secondary"} onClick={() => navigate(-1)} />
          </div>
        </form>
        <img
          className="col-span-8 col-start-7 my-auto"
          src={image}
          alt="advisor"
        />

        {showRequiredFieldsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="flex flex-row items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-3xl" />
                <Text type="sm-heading" classNames="text-center">
                  Error
                </Text>
              </div>
              <Text type="sm-subheading" classNames="mb-8 text-xl">
                Please fill in all required fields.
              </Text>
              <Button text="Close" onClick={() => setShowRequiredFieldsModal(false)} />
            </div>
          </div>
        )}

        {showPasswordMismatchModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="flex flex-row items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-3xl" />
                <Text type="sm-heading" classNames="text-center">
                  Error
                </Text>
              </div>
              <Text type="sm-subheading" classNames="mb-8 text-xl">
                Passwords do not match. Please try again.
              </Text>
              <Button text="Close" onClick={() => setShowPasswordMismatchModal(false)} />
            </div>
          </div>
        )}

        {showEmailMismatchModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="flex flex-row items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-3xl" />
                <Text type="sm-heading" classNames="text-center">
                  Error
                </Text>
              </div>
              <Text type="sm-subheading" classNames="mb-8 text-xl">
                Invalid emaill address. Please try again.
              </Text>
              <Button text="Close" onClick={() => setEmailMismatchModal(false)} />
            </div>
          </div>
        )}

        {showPasswordLengthModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="flex flex-row items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-3xl" />
                <Text type="sm-heading" classNames="text-center">
                  Error
                </Text>
              </div>
              <Text type="sm-subheading" classNames="mb-8 text-xl">
                Password should be between 6 and 255 characters long.
              </Text>
              <Button text="Close" onClick={() => setPasswordLengthModal(false)} />
            </div>
          </div>
        )}

        {showEmailInUse && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="flex flex-row items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-3xl" />
                <Text type="sm-heading" classNames="text-center">
                  Error
                </Text>
              </div>
              <Text type="sm-subheading" classNames="mb-8 text-xl">
                Email is already in use
              </Text>
              <Button text="Close" onClick={() => setEmailInUse(false)} />
            </div>
          </div>
        )}

        {showNameSurname && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="flex flex-row items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-3xl" />
                <Text type="sm-heading" classNames="text-center">
                  Error
                </Text>
              </div>
              <Text type="sm-subheading" classNames="mb-8 text-xl">
                Name and Surname must only contain letters
              </Text>
              <Button text="Close" onClick={() => setNameSurname(false)} />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;
