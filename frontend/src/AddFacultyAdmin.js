import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import ErrorModal from "./components/errorModal.jsx";
import Select from "./components/Select.jsx";
import SuccessModal from "./components/successModal.jsx";
import Text from "./components/Text.jsx";
import config from "./config.js";
import Main from "./layout/Main.jsx";

const AddFacultyAdmin = () => {
  // Mock data Need to give list of faculties and departments

  const [Name, setName] = React.useState("");
  const [Surname, setSurname] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [faculties, setFaculties] = React.useState([]);
  const [selectedFaculty, setSelectedFaculty] = React.useState("");
  const [successModal, setSuccessModal] = React.useState(false);
  const [showRequiredFieldsModal, setShowRequiredFieldsModal] =
    React.useState(false);
  const [showEmailMismatchModal, setEmailMismatchModal] = React.useState(false);
  const [showEmailInUse, setEmailInUse] = React.useState(false);
  const [showNameSurname, setNameSurname] = React.useState(false);

  let navigate = useNavigate();

  React.useEffect(() => {
    fetch(`${config.backendUrl}/api/sysAdmin/users/add/admin`)
      .then((response) => response.json())
      .then((data) => {
        setFaculties(data.data);
        setSelectedFaculty(data.data[0].id);
      })
      .catch((error) => console.error("Error fetching faculties:", error));
  }, []);

  const handleAddAdmin = async () => {
    if (!Name || !Surname || !Email || !selectedFaculty) {
      setShowRequiredFieldsModal(true); // Show required fields modal if any field is empty
      return;
    }

    const adminData = {
      name: Name,
      surname: Surname,
      email: Email,
      facultyID: selectedFaculty,
    };

    try {
      const response = await fetch(
        `${config.backendUrl}/api/sysAdmin/users/add/admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminData),
        }
      );

      // Parse response into JSON
      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors based on the parsed data
        if (data.message.includes("Invalid email address")) {
          setEmailMismatchModal(true);
        } else if (data.message.includes("Email is already in use")) {
          setEmailInUse(true);
        } else if (
          data.message.includes(
            "Name must only contain letters and spaces (no numbers)."
          ) ||
          data.message.includes(
            "Surname must only contain letters and spaces (no numbers)."
          )
        ) {
          setNameSurname(true);
        } else {
          throw new Error("Unexpected error occurred");
        }
        return;
      }

      // If everything is OK, show the success modal and reset form fields
      setSuccessModal(true);
      setName("");
      setSurname("");
      setEmail("");
      setSelectedFaculty(faculties[0]?.id || "");
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  return (
    <Main userType="SystemAdmin" activeMenuItem="addAdmin">
      <div className="flex flex-col flex-auto gap-2 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Add Faculty Admin
        </Text>
        <div className="flex flex-auto flex-col justify-between gap-8">
          <div className="flex flex-col gap-4 w-5/12">
            <CustomInput
              label="Name"
              placeholder="Enter name"
              value={Name}
              onValueChange={setName}
            />
            <CustomInput
              label="Surname"
              placeholder="Enter surname"
              value={Surname}
              onValueChange={setSurname}
            />
            <CustomInput
              label="Email"
              placeholder="Enter email"
              value={Email}
              onValueChange={setEmail}
            />

            <Select
              label="Faculty"
              options={faculties.map((item) => ({
                value: item.id,
                label: item.facultyName,
              }))}
              onChange={(value) => {
                setSelectedFaculty(value);
              }}
            />
          </div>
          <div className="flex flex-row gap-8 max-w-md">
            <Button text="Save" onClick={handleAddAdmin} />
            <Button text="Back" type="secondary" onClick={() => navigate(-1)} />
          </div>
        </div>
      </div>
      <ErrorModal
        isOpen={showRequiredFieldsModal}
        title={"Error"}
        message={"Please fill in all required fileds."}
        onContinue={() => setShowRequiredFieldsModal(false)}
      />
      <SuccessModal
        isOpen={successModal}
        title={"Success"}
        message={"Admin added successfully."}
        onClose={() => {
          setSuccessModal(false);
          navigate(-1);
        }}
      />
      <ErrorModal
        isOpen={showNameSurname}
        title={"Error"}
        message={
          "Name and Surname must only contain letters and spaces (no numbers)."
        }
        onContinue={() => {
          setNameSurname(false);
        }}
      />
      <ErrorModal
        isOpen={showEmailInUse}
        title={"Error"}
        message={"Email is already in use."}
        onContinue={() => {
          setEmailInUse(false);
        }}
      />
      <ErrorModal
        isOpen={showEmailMismatchModal}
        title={"Error"}
        message={"Invalid email address"}
        onContinue={() => {
          setEmailMismatchModal(false);
        }}
      />
    </Main>
  );
};

export default AddFacultyAdmin;
