import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import search from "./assets/search.svg";
import Tag from "./components/Tag.jsx";
import Select from "./components/Select.jsx";
import config from "./config.js";
import { useLocation } from "react-router-dom";
import Checkbox from "./components/Checkbox.jsx";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./components/ConfirmationModal.jsx";

const AddCourse = () => {
  const [prerequisite, setPrerequisite] = React.useState("");
  const [filteredPrerequisites, setFilteredPrerequisites] = React.useState([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = React.useState([]);
  const [filteredEquivalents, setFilteredEquivalents] = React.useState([]);
  const [selectedEquivalents, setSelectedEquivalents] = React.useState([]);
  const [courseName, setCourseName] = React.useState("");
  const [courseCode, setCourseCode] = React.useState("");
  const [courseCredits, setCourseCredits] = React.useState("");
  const [nqfLevel, setNqfLevel] = React.useState("");
  const [equivalents, setEquivalents] = React.useState("");
  const [faculty, setFaculty] = React.useState("");
  const [specialRequirements, setSpecialRequirements] = React.useState("");
  const [availableBoth, setAvailableBoth] = React.useState(false);
  const [specialRequirementsChoice, setSpecialRequirementsChoice] =
    React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  let location = useLocation();
  let navigate = useNavigate();

  React.useEffect(() => {
    const fetchPrerequisitesAndEquivalents = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/courses/add`);
        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        console.error("Error fetching prerequisites and equivalents:", error);
      }
    };

    fetchPrerequisitesAndEquivalents();
  }, []);

  const handleSearchPrerequisites = (searchText) => {
    setPrerequisite(searchText);
    // Filter the prerequisites list based on the search text
    setFilteredPrerequisites(
      courses
        .filter((course) =>
          course.id.toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((course) => !selectedPrerequisites.includes(course.id))
        .map((course) => course.id)
    );
  };

  const handleAddPrerequisite = (prerequisite) => {
    setSelectedPrerequisites([...selectedPrerequisites, prerequisite]);
    setPrerequisite("");
  };

  const handleRemovePrerequisite = (prerequisite) => {
    setSelectedPrerequisites(
      selectedPrerequisites.filter((item) => item !== prerequisite)
    );
  };

  const handleSearchEquivalents = (searchText) => {
    // Filter the equivalents list based on the search text
    setEquivalents(searchText);
    setFilteredEquivalents(
      courses
        .filter((course) =>
          course.id.toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((course) => !selectedEquivalents.includes(course.id))
        .map((course) => course.id)
    );
  };

  const handleAddEquivalent = (equivalent) => {
    setSelectedEquivalents([...selectedEquivalents, equivalent]);
    setEquivalents("");
  };

  const handleRemoveEquivalent = (equivalent) => {
    setSelectedEquivalents(
      selectedEquivalents.filter((item) => item !== equivalent)
    );
  };

  const handleSaveCourse = () => {
    if (!courseCode || !courseName || !courseCredits || !nqfLevel) {
      alert("Please fill in all required fields.");
      return;
    }

    const newCourse = {
      courseCode,
      courseName,
      courseCredits,
      nqfLevel,
      specialRequirements:
        specialRequirements && specialRequirementsChoice
          ? {
            condition: specialRequirementsChoice,
            requirement: specialRequirements,
          }
          : null,
      bothSemesters: availableBoth,
      prerequisites:
        specialRequirementsChoice !== "complex" && selectedPrerequisites
          ? selectedPrerequisites
          : null,
      equivalents: selectedEquivalents,
      currID: location.state.curriculumID,
    };

    fetch(`${config.backendUrl}/api/courses/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setShowSuccessModal(true);
        } else {
          console.error("Failed to add course.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while adding the course.");
      });
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
      activeMenuItem={"manageMajors"}
    >
      <div class="flex flex-col flex-auto gap-4 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames={"mb-8"}>
          Add Course
        </Text>
        <div class="flex flex-row gap-8">
          <div class="flex flex-col gap-4 w-1/2">
            <CustomInput
              label="Course Name"
              placeholder="Enter course name"
              value={courseName}
              onValueChange={setCourseName}
            />
            <CustomInput
              label="Course Code"
              placeholder="Enter course code"
              value={courseCode}
              onValueChange={setCourseCode}
            />
            <CustomInput
              label="Course Credits"
              placeholder="Enter course credits"
              value={courseCredits}
              onValueChange={setCourseCredits}
              numeric={true}
            />
            <CustomInput
              label="NQF Level"
              placeholder="Enter NQF Level"
              onValueChange={setNqfLevel}
              numeric={true}
            />
            <Select
              label="Faculty"
              options={[
                { value: "science", label: "Science" },
                { value: "arts", label: "Arts" },
                { value: "commerce", label: "Commerce" },
                // Add more options as needed
              ]}
              value={faculty}
              onValueChange={setFaculty}
            />
            <div class="flex flex-row">
              <Checkbox
                checked={availableBoth}
                onValueChange={() => setAvailableBoth(!availableBoth)}
              />
              <Text type="paragraph" classNames="mb-2">
                Available both semesters
              </Text>
            </div>
          </div>
          <div class="flex flex-col gap-4 w-1/2">
            <div class="border flex flex-col border-gray-200 rounded-2xl p-4 gap-4">
              <CustomInput
                label="Prerequisites"
                placeholder="Enter course Prerequisites"
                icon={search}
                onValueChange={handleSearchPrerequisites}
                value={prerequisite}
                classNames={specialRequirementsChoice === "complex" && "hidden"}
              />
              {prerequisite && filteredPrerequisites.length >= 1 && (
                <>
                  <div>
                    <div class="absolute z-20 max-h-60 overflow-y-auto bg-gray-200 rounded-2xl p-4 max-w-80">
                      {filteredPrerequisites.map((prerequisite) => (
                        <p
                          onClick={() => {
                            handleAddPrerequisite(prerequisite);
                            setFilteredPrerequisites(
                              filteredPrerequisites.filter(
                                (item) => item !== prerequisite
                              )
                            );
                          }}
                        >
                          {prerequisite}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {selectedPrerequisites.length > 0 &&
                specialRequirementsChoice !== "complex" && (
                  <div class="flex flex-row gap-4 ">
                    {selectedPrerequisites.map((prerequisite) => (
                      <Tag
                        text={prerequisite}
                        onClick={() => handleRemovePrerequisite(prerequisite)}
                      />
                    ))}
                  </div>
                )}
              <div class="flex gap-4 flex-row">
                <div class="flex flex-row">
                  <Checkbox
                    checked={specialRequirementsChoice === "and"}
                    onValueChange={() =>
                      setSpecialRequirementsChoice(
                        specialRequirementsChoice === "and" ? "" : "and"
                      )
                    }
                  />
                  <Text type="paragraph" classNames="mb-2">
                    And
                  </Text>
                </div>
                <div class="flex flex-row">
                  <Checkbox
                    checked={specialRequirementsChoice === "or"}
                    onValueChange={() =>
                      setSpecialRequirementsChoice(
                        specialRequirementsChoice === "or" ? "" : "or"
                      )
                    }
                  />
                  <Text type="paragraph" classNames="mb-2">
                    Or
                  </Text>
                </div>
                <div class="flex flex-row">
                  <Checkbox
                    checked={specialRequirementsChoice === "complex"}
                    onValueChange={() =>
                      setSpecialRequirementsChoice(
                        specialRequirementsChoice === "complex" ? "" : "complex"
                      )
                    }
                  />
                  <Text type="paragraph" classNames="mb-2">
                    Complex
                  </Text>
                </div>
              </div>
              <CustomInput
                label={"Special Requirements"}
                placeholder={"Enter Special Requirements"}
                value={specialRequirements}
                onValueChange={(value) => setSpecialRequirements(value)}
                classNames={specialRequirementsChoice ? "" : "hidden"}
              />
            </div>
            <CustomInput
              label="Equivalents"
              placeholder="Enter Equivalents"
              icon={search}
              value={equivalents}
              onValueChange={handleSearchEquivalents}
            />
            <div>
              {equivalents && filteredEquivalents.length >= 1 && (
                <div class="absolute bg-gray-200 max-h-60 overflow-y-auto rounded-2xl p-4 max-w-80">
                  {filteredEquivalents.map((equivalent) => (
                    <p
                      onClick={() => {
                        handleAddEquivalent(equivalent);
                        setFilteredEquivalents(
                          filteredEquivalents.filter(
                            (item) => item !== equivalent
                          )
                        );
                      }}
                    >
                      {equivalent}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div class="flex flex-row gap-4">
              {selectedEquivalents.map((equivalent) => (
                <Tag
                  text={equivalent}
                  onClick={() => handleRemoveEquivalent(equivalent)}
                />
              ))}
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Save" onClick={handleSaveCourse} />
          <Button text="Back" type="secondary" onClick={() => navigate(-1)} />
        </div>
      </div>
      {showSuccessModal && (
        <ConfirmationModal
          status="Success"
          message="Course added successfully"
          onConfirm={"/courseManagement"}
        />
      )}
    </Main>
  );
};

export default AddCourse;
