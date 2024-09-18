import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import search from "./assets/search.svg";
import Tag from "./components/Tag.jsx";
import Select from "./components/Select.jsx";
import Checkbox from "./components/Checkbox.jsx";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import config from "./config.js";
import ConfirmationModal from "./components/ConfirmationModal.jsx";
import { set } from "date-fns";

const EditCourse = () => {
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
  const [loading, setLoading] = React.useState(true);
  const [specialRequirementsChoice, setSpecialRequirementsChoice] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/courses/${location.state.courseID}/edit`
        );
        const data = await response.json();
        setLoading(false);
        console.log("API Response:", data);
  
        setCourseName(data.data.courseName);
        setCourseCode(data.data.courseCode);
        setCourseCredits(data.data.credits);
        setNqfLevel(data.data.nqfLevel);
  
        // Handle prerequisites
        const prerequisitesData = data.data.prerequisites;
        const normalizedPrerequisites = Array.isArray(prerequisitesData)
          ? prerequisitesData
          : prerequisitesData
          ? [prerequisitesData]
          : [];
        setSelectedPrerequisites(normalizedPrerequisites);
        console.log("Prerequisites:", normalizedPrerequisites);
  
        // Handle equivalents
        const equivalentsData = data.data.equivalents;
        const normalizedEquivalents = Array.isArray(equivalentsData)
          ? equivalentsData
          : equivalentsData
          ? [equivalentsData]
          : [];
        setSelectedEquivalents(normalizedEquivalents);
  
        setSpecialRequirements(data.data.specialRequirement?.requirement || "");
        setSpecialRequirementsChoice(
          data.data.specialRequirement?.condition?.toLowerCase() || ""
        );
        setAvailableBoth(data.data.bothSemesters?.toLowerCase() || false);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
  
    fetchCourseData();
  }, []);
  

  // Mock data Need to give list of prerequisites and equivalents
  const prerequisites = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Geography",
  ];

  const equivalentCourses = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Geography",
  ];

  const faculties = [
    "Engineering",
    "Science",
    "Humanities",
    "Commerce",
    "Law",
    "Medicine",
  ];

  const handleSearchPrerequisites = (searchText) => {
    setPrerequisite(searchText);
    // Filter the prerequisites list based on the search text
    setFilteredPrerequisites(
      prerequisites
        .filter((prerequisite) =>
          prerequisite.toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((prerequisite) => !selectedPrerequisites.includes(prerequisite))
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
      equivalentCourses
        .filter((equivalent) =>
          equivalent.toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((equivalent) => !selectedEquivalents.includes(equivalent))
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
    if (!courseName || !courseCode || !courseCredits || !nqfLevel ) {
      alert(
        "All fields except special requirements and prerequisites must be filled."
      );
      return;
    }

    const courseData = {
      courseName,
      courseCode,
      credits: courseCredits,
      nqfLevel,
      faculty,
      prerequisites: selectedPrerequisites.length
        ? selectedPrerequisites
        : null,
      equivalents: selectedEquivalents.length ? selectedEquivalents : null,
      bothSemesters: availableBoth,
      specialRequirement: specialRequirements
        ? { condition: "OR", requirement: specialRequirements }
        : null,
    };

    fetch(`${config.backendUrl}/api/courses/${location.state.courseID}/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    })
      .then((response) => response.json())
      .then((data) => {
        <ConfirmationModal
          status={"Success"}
          message="Course updated successfully"
          onConfirm={-1}
        />;
      })
      .catch((error) => {
        console.error("Error updating course:", error);
      });
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
    >
      <div class="flex flex-col flex-auto gap-4 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames={"mb-8"}>
          Add Course
        </Text>
        {loading ? (
          <div className="flex justify-center">
            <div className="loader"></div>{" "}
          </div>
        ) : (
          <>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col gap-4 w-1/2">
                <CustomInput
                  label="Course Name"
                  placeholder="Enter course name"
                  value={courseName}
                  onValueChange={(value) => setCourseName(value)}
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
                  value={nqfLevel}
                  onValueChange={setNqfLevel}
                  numeric={true}
                />
                <div class="flex flex-row">
                  <Checkbox
                    checked={availableBoth}
                    onValueChange={() => setAvailableBoth(!availableBoth)}
                  />
                  <Text type="paragraph" classNames="mb-2">
                    Available both semesers
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
                    <div class="absolute z-20 max-h-60 overflow-y-auto bg-gray-400 rounded-2xl p-4 max-w-80">
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
                    onValueChange={() => setSpecialRequirementsChoice("and")}
                  />
                  <Text type="paragraph" classNames="mb-2">
                    And
                  </Text>
                </div>
                <div class="flex flex-row">
                  <Checkbox
                    checked={specialRequirementsChoice === "or"}
                    onValueChange={() => setSpecialRequirementsChoice("or")}
                  />
                  <Text type="paragraph" classNames="mb-2">
                    Or
                  </Text>
                </div>
                <div class="flex flex-row">
                  <Checkbox
                    checked={specialRequirementsChoice === "complex"}
                    onValueChange={() =>
                      setSpecialRequirementsChoice("complex")
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
                    <div class="absolute bg-gray-200 rounded-2xl p-4 max-w-80">
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
          </>
        )}
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Save" onClick={handleSaveCourse} />
          <Button text="Back" type="secondary" onClick={() => navigate(-1)} />
        </div>
      </div>
    </Main>
  );
};

export default EditCourse;
