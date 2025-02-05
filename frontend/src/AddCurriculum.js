import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import ErrorModal from "./components/errorModal.jsx";
import Select from "./components/Select.jsx";
import SuccessModal from "./components/successModal.jsx";
import Text from "./components/Text.jsx";
import config from "./config.js";
import Main from "./layout/Main.jsx";

const AddCourse = () => {
  const [departments, setDepartments] = React.useState([]);
  const [department, setDepartment] = React.useState("");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [curriculumName, setCurriculumName] = React.useState("");
  const [curriculumID, setCurriculumID] = React.useState("");
  const [electiveCreditCount, setElectiveCreditCount] = React.useState("");
  const [prefix, setPrefix] = React.useState("");
  const [showRequiredFieldsModal, setShowRequiredFieldsModal] =
    React.useState(false);
  let location = useLocation();
  let navigate = useNavigate();

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const facultyID = JSON.parse(
          localStorage.getItem("userData")
        )?.facultyID;
        const response = await fetch(
          `${config.backendUrl}/api/facultyAdmin/${facultyID}/curriculums/add`
        );
        const data = await response.json();
        setDepartments(data.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSaveCurriculum = async () => {
    console.log(curriculumID, curriculumName, department);
    if (!curriculumID || !curriculumName || !department) {
      setShowRequiredFieldsModal(true);
      return;
    }

    const facultyID = JSON.parse(localStorage.getItem("userData"))?.facultyID;
    const curriculumData = {
      curriculumID,
      curriculumName,
      departmentID: department,
    };

    if (location.state.curriculumType === "Major") {
      curriculumData.electiveCreditCount = electiveCreditCount;
      curriculumData.prefix = prefix;
    }

    try {
      const response = await fetch(
        `${config.backendUrl}/api/facultyAdmin/${facultyID}/curriculums/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(curriculumData),
        }
      );

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving curriculum:", error);
      alert("An error occurred while saving the curriculum.");
    }
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData"))?.advisor?.advisor_level ||
        "FacultyAdmin"
      }
      activeMenuItem={"manageMajors"}
    >
      <div class="flex flex-col flex-auto gap-4 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames={"mb-8"}>
          Add Curriculum
        </Text>
        <div class="flex flex-row gap-8">
          <div class="flex flex-col gap-4 w-1/2">
            <CustomInput
              label="Curriculum Name"
              placeholder="Enter Curriculum name"
              value={curriculumName}
              onValueChange={(value) => setCurriculumName(value)}
            />
            <CustomInput
              label="Curriculum ID"
              placeholder="Enter Curriculum ID"
              value={curriculumID}
              onValueChange={(value) => setCurriculumID(value)}
            />
            {location.state.curriculumType === "Programme" && (
              <>
                <CustomInput
                  label="Elective Credit Count"
                  placeholder="Enter Elective Credit Count"
                  value={electiveCreditCount}
                  onValueChange={(value) => setElectiveCreditCount(value)}
                  numeric={true}
                />
                <CustomInput
                  label="Prefix"
                  placeholder="Enter Prefix"
                  onValueChange={(value) => setPrefix(value)}
                  numeric={true}
                />
              </>
            )}
            <Select
              label="Department"
              options={[
                { value: "", label: "Select a Department" }, // Default empty option
                ...departments.map((department) => ({
                  value: department.id,
                  label: department.name,
                })),
              ]}
              value={department} // Keep this bound to state
              onChange={(value) => {
                setDepartment(value); // Update state when selected
              }}
            />
          </div>
        </div>
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Save" onClick={handleSaveCurriculum} />
          <Button text="Back" type="secondary" onClick={() => navigate(-1)} />
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        title="Success"
        message="Course added successfully"
        onClose={() => navigate(-1)}
      />
      <ErrorModal
        isOpen={showRequiredFieldsModal}
        title={"Error"}
        message={"Please fill in all required fields."}
        onContinue={() => {
          setShowRequiredFieldsModal(false);
        }}
      />
    </Main>
  );
};

export default AddCourse;
