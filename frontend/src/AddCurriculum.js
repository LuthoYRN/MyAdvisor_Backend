import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Select from "./components/Select.jsx";
import config from "./config.js";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./components/ConfirmationModal.jsx";

const AddCourse = () => {
  const [courseName, setCourseName] = React.useState("");
  const [courseCode, setCourseCode] = React.useState("");
  const [courseCredits, setCourseCredits] = React.useState("");
  const [nqfLevel, setNqfLevel] = React.useState("");
  const [departments, setDepartments] = React.useState([]);
  const [department, setDepartment] = React.useState("");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [curriculumName, setCurriculumName] = React.useState("");
  const [curriculumID, setCurriculumID] = React.useState("");
  const [electiveCreditCount, setElectiveCreditCount] = React.useState("");
  const [prefix, setPrefix] = React.useState("");
  let location = useLocation();
  let navigate = useNavigate();

  const handleSaveCourse = () => {
    if (!courseCode || !courseName || !courseCredits || !nqfLevel) {
      alert("Please fill in all required fields.");
      return;
    }
    // Add logic to save the course here
    setShowSuccessModal(true);
  };

  React.useEffect(() => {
    console.log("Location state:", location.state);
    const fetchCourses = async () => {
      try {
        const facultyID = JSON.parse(
          localStorage.getItem("userData")
        )?.facultyID;
        const response = await fetch(
          `${config.backendUrl}/api/facultyAdmin/${facultyID}/curriculums/add`
        );
        const data = await response.json();
        setDepartments(data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSaveCurriculum = async () => {
    console.log(curriculumID, curriculumName, department);
    if (!curriculumID || !curriculumName || !department) {
      alert("Please fill in all required fields.");
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
            {location.state.curriculumType === "Major" && (
              <>
                <CustomInput
                  label="Elective Credit Count"
                  placeholder="Enter Elective Credit Count"
                  value={electiveCreditCount}
                  onValueChange={(value)=>setElectiveCreditCount(value)}
                  numeric={true}
                />
                <CustomInput
                  label="Prefix"
                  placeholder="Enter Prefix"
                  onValueChange={(value)=>setPrefix(value)}
                  numeric={true}
                />
              </>
            )}
            <Select
              label="Department"
              options={departments.map((department) => ({
                value: department.id,
                label: department.name,
              }))}
              onChange={(value) => {
                setDepartment(value);
              }}
            />
          </div>
        </div>
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Save" onClick={handleSaveCurriculum} />
          <Button text="Back" type="secondary" onClick={() => navigate(-1)} />
        </div>
      </div>
      {showSuccessModal && (
        <ConfirmationModal
          status="Success"
          message="Curriculum added successfully"
          onConfirm={-1}
          close={() => setShowSuccessModal(false)}
        />
      )}
    </Main>
  );
};

export default AddCourse;
