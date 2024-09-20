import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Select from "./components/Select.jsx";
import Checkbox from "./components/Checkbox.jsx";
import Tag from "./components/Tag.jsx";
import search from "./assets/search.svg";
import config from "./config.js";
import ConfirmationModal from "./components/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const AddFacultyAdmin = () => {
  // Mock data Need to give list of faculties and departments

  const [Name, setName] = React.useState("");
  const [Surname, setSurname] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [faculties, setFaculties] = React.useState([]);
  const [selectedFaculty, setSelectedFaculty] = React.useState("");
  const [successModal, setSuccessModal] = React.useState(false);
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

  const handleAddAdmin = () => {
    const adminData = {
      name: Name,
      surname: Surname,
      email: Email,
      facultyID: selectedFaculty,
    };

    fetch(`${config.backendUrl}/api/sysAdmin/users/add/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSuccessModal(true);
        setName("");
        setSurname("");
        setEmail("");
        setSelectedFaculty(faculties[0]?.id || "");
        // Optionally, reset form fields or show success message
      })
      .catch((error) => {
        console.error("Error adding admin:", error);
      });
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
            <Button text="Back" type="secondary" onClick={navigate(-1)}/>
          </div>
        </div>
      </div>
      {successModal && (
        <ConfirmationModal
          status={"Success"}
          message={"Admin added successfully."}
          close={() => setSuccessModal(false)}
        />
      )}
    </Main>
  );
};

export default AddFacultyAdmin;
