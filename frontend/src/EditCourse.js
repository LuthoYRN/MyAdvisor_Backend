import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import search from "./assets/search.svg";
import Button from "./components/Button.jsx";
import Checkbox from "./components/Checkbox.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Tag from "./components/Tag.jsx";
import Text from "./components/Text.jsx";
import config from "./config.js";
import Main from "./layout/Main.jsx";

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
  const [specialRequirements, setSpecialRequirements] = React.useState("");
  const [availableBoth, setAvailableBoth] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [specialRequirementsChoice, setSpecialRequirementsChoice] =
    React.useState("");
  const [courses, setCourses] = React.useState([]);
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
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
        setCourses(data.data.allCourses);
        setFilteredEquivalents(data.data.allCourses);
        setFilteredPrerequisites(data.data.allCourses);
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

  const handleSearchPrerequisites = (searchText) => {
    setPrerequisite(searchText);
    // Filter the prerequisites list based on the search text
    setFilteredPrerequisites(
      courses
        .filter((prerequisite) =>
          prerequisite.id.toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((prerequisite) => !selectedPrerequisites.includes(prerequisite))
    );
  };

  const handleAddPrerequisite = (prerequisite) => {
    setSelectedPrerequisites([...selectedPrerequisites, prerequisite.id]);
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
        .filter((equivalent) =>
          equivalent.id.toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((equivalent) => !selectedEquivalents.includes(equivalent))
    );
  };

  const handleAddEquivalent = (equivalent) => {
    setSelectedEquivalents([...selectedEquivalents, equivalent.id]);
    setEquivalents("");
  };

  const handleRemoveEquivalent = (equivalent) => {
    setSelectedEquivalents(
      selectedEquivalents.filter((item) => item !== equivalent)
    );
  };

  const handleSaveCourse = () => {
    if (!courseName || !courseCode || !courseCredits || !nqfLevel) {
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
      prerequisites:
        selectedPrerequisites.length && specialRequirementsChoice !== "complex"
          ? selectedPrerequisites
          : null,
      equivalents: selectedEquivalents.length ? selectedEquivalents : null,
      bothSemesters: availableBoth,
      specialRequirement:
        specialRequirements && specialRequirementsChoice !== ""
          ? {
              condition: specialRequirementsChoice.toUpperCase(),
              requirement: specialRequirements,
            }
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
        setShowConfirmationModal(true);
      })
      .catch((error) => {
        console.error("Error updating course:", error);
      });
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData"))?.advisor?.advisor_level ||
        "FacultyAdmin"
      }
    >
      <div class="flex flex-col flex-auto gap-4 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames={"mb-8"}>
          Edit Course
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
                    classNames={
                      specialRequirementsChoice === "complex" && "hidden"
                    }
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
                                  courses.filter(
                                    (item) => item !== prerequisite
                                  )
                                );
                              }}
                            >
                              {prerequisite.id}
                            </p>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {selectedPrerequisites.length > 0 &&
                    specialRequirementsChoice !== "complex" && (
                      <div class="flex flex-wrap flex-row gap-4 ">
                        {selectedPrerequisites.map((prerequisite) => (
                          <Tag
                            text={prerequisite}
                            onClick={() =>
                              handleRemovePrerequisite(prerequisite)
                            }
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
                            specialRequirementsChoice === "complex"
                              ? ""
                              : "complex"
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
                    classNames={specialRequirementsChoice === "" && "hidden"}
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
                    <div class="absolute bg-gray-200 rounded-2xl p-4 max-h-60 overflow-y-auto">
                      {filteredEquivalents.map((equivalent) => (
                        <p
                          onClick={() => {
                            handleAddEquivalent(equivalent);
                            setFilteredEquivalents(
                              courses.filter((item) => item !== equivalent)
                            );
                          }}
                        >
                          {equivalent.id}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div class="flex flex-wrap flex-row gap-4">
                  {selectedEquivalents.length >= 1 &&
                    selectedEquivalents.map((equivalent) => (
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
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div
            className="bg-white rounded-2xl p-8 relative"
            style={{
              width: "30%",
              minWidth: "320px",
              maxWidth: "600px",
              padding: "2rem",
            }}
          >
            <div className="flex flex-row items-center gap-2 mb-4 justify-center">
              <FaCheckCircle className="text-green-500 text-3xl" />{" "}
              {/* Success Icon */}
              <Text type="sm-heading" classNames="text-center">
                Success
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl text-center">
              Course updated successfully.
            </Text>
            <div className="flex justify-center">
              <Button
                text="Close"
                onClick={() => {
                  setShowConfirmationModal(false);
                  navigate(-1); // Assuming you want to navigate back after closing
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Main>
  );
};

export default EditCourse;
