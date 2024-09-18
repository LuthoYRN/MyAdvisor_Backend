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
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/courses/${location.state.courseID}/edit`);
        const data = await response.json();
        console.log(data);
        setCourseName(data.courseName);
        setCourseCode(data.courseCode);
        setCourseCredits(data.courseCredits);
        setNqfLevel(data.nqfLevel);
        setSelectedPrerequisites(data.prerequisites);
        setSelectedEquivalents(data.equivalents);
        setFaculty(data.faculty);
        setSpecialRequirements(data.specialRequirements);
        setAvailableBoth(data.availableBoth);
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
    const courseData = {
      courseName,
      courseCode,
      courseCredits,
      nqfLevel,
      prerequisites: selectedPrerequisites,
      equivalents,
    };
    // TODO: Save courseData to the database
    console.log(courseData);
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
            <Select
              label="Faculty"
              placeholder="Select faculty"
              options={faculties.map((faculty) => ({
                value: faculty,
                label: faculty,
              }))}
              onChange={(value) => setFaculty(value)}
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
            <CustomInput
              label="Prerequisites"
              placeholder="Enter course Prerequisites"
              icon={search}
              onValueChange={handleSearchPrerequisites}
              value={prerequisite}
            />
            {prerequisite && filteredPrerequisites.length >= 1 && (
              <>
                {" "}
                <div>
                  <div class="absolute bg-gray-400 rounded-2xl p-4 max-w-80">
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
                <div class="flex flex-row gap-4 ">
                  {selectedPrerequisites.map((prerequisite) => (
                    <Tag
                      text={prerequisite}
                      onClick={() => handleRemovePrerequisite(prerequisite)}
                    />
                  ))}
                </div>
              </>
            )}
            <CustomInput
              label={"Special Requirements"}
              placeholder={"Enter Special Requirements"}
              value={specialRequirements}
              onValueChange={(value) => setSpecialRequirements(value)}
            />
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
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Save" onClick={handleSaveCourse} />
          <Button text="Back" type="secondary" onClick={() => navigate(-1)} />
        </div>
      </div>
    </Main>
  );
};

export default EditCourse;
