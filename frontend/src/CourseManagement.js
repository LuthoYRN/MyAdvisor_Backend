import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Table from "./components/Table";
import { useEffect, useState } from "react";
import config from "./config";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DeleteModal from "./components/DeleteModal";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import Tag from "./components/Tag";
import search from "./assets/search.svg";
import { set } from "date-fns";
import ConfirmationModal from "./components/ConfirmationModal";

const CurriculumManagement = () => {
  const [courses, setCourses] = useState(null);
  const [allCourses, setAllCourses] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workingID, setWorkingID] = useState(null);
  let navigate = useNavigate();
  let location = useLocation();
  const [showAddExistingCourseModal, setShowAddExistingCourseModal] =
    useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showCourseDependencyModal, setShowCourseDependencyModal] =
    useState(false);
  const [courseDependencies, setCourseDependencies] = useState([]);
  const [prerequisiteSearch, setPrerequisiteSearch] = useState("");
  const [filteredPrerequisites, setFilteredPrerequisites] = useState([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/curriculum/${JSON.parse(localStorage.getItem("curriculum") || "{}").curriculumID}/courses`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        console.error("Error fetching curriculums:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/curriculum/${JSON.parse(localStorage.getItem("curriculum")).curriculumID}/courses/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setCourses(courses.filter((course) => courses.id !== course));
      setShowDeleteModal(false);
      setShowDeleteConfirmation(true);
    } catch (error) {
      console.error("Error deleting curriculum:", error);
    }
  };

  const checkDependencies = async (id) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/curriculum/${JSON.parse(localStorage.getItem("curriculum")).curriculumID}/courses/${id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.proceed) {
        setShowDeleteModal(true);
      } else {
        setShowCourseDependencyModal(true);
        setCourseDependencies(data.data.map((course) => course.courseID));
        console.log("Course dependencies:", data);
      }
    } catch (error) {
      console.error("Error checking course dependencies:", error);
    }
  };

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/curriculum/${JSON.parse(localStorage.getItem("curriculum")).curriculumID}/courses/addExisting`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFilteredCourses(data.data);
        setAllCourses(data.data);
      } catch (error) {
        console.error("Error fetching filtered courses:", error);
      }
    };

    fetchFilteredCourses();
  }, [showAddExistingCourseModal]);

  const handleAddExistingCourse = async () => {
    console.log("Adding existing course:", selectedCourses[0].id);
    try {
      const response = await fetch(
        `${config.backendUrl}/api/curriculum/${JSON.parse(localStorage.getItem("curriculum")).curriculumID}/courses/addExisting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseID: selectedCourses[0].id,
            prerequisiteFor:
              selectedPrerequisites.length >= 1
                ? selectedPrerequisites.map((course) => course.id)
                : null,
          }),
        }
      );
      if (!response.ok) {
        throw alert("Network response was not ok: ", response.status);
      }
      const data = await response.json();
      setCourses([...courses, data.data]);
      setShowAddExistingCourseModal(false);
      setSelectedCourses([]);
      setSelectedPrerequisites([]);
    } catch (error) {
      console.error("Error adding existing course:", error);
    }
  };
  const defaultColumns = [
    {
      header: "Course ID",
      accessorKey: "id",
    },
    {
      header: "Course Name",
      accessorKey: "courseName",
    },
    {
      header: "Credits",
      accessorKey: "credits",
    },
    {
      header: "NQF Level",
      accessorKey: "nqfLevel",
    },
  ];

  const handleAddPrerequisites = (course) => {
    setSelectedPrerequisites([...selectedPrerequisites, course]);
  };

  const handleRemovePrerequisite = (course) => {
    setSelectedPrerequisites(
      selectedPrerequisites.filter(
        (selectedCourse) => selectedCourse !== course
      )
    );
  };
  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData"))?.advisor?.advisor_level ||
        "FacultyAdmin"
      }
      activeMenuItem={"manageMajors"}
    >
      <div className="flex justify-between items-center mb-16">
        <Text type="heading">Course Management</Text>
        <div className="flex justify-end w-96 gap-4 ">
          <Button
            text="+ Add New Course"
            onClick={() =>
              navigate("/addCourse", {
                state: {
                  curriculumID: JSON.parse(localStorage.getItem("curriculum"))
                    .curriculumID,
                  facultyID: location.state.facultyID,
                },
              })
            }
          />
          <Button
            text="+ Add Existing Course"
            onClick={() => setShowAddExistingCourseModal(true)}
          />
        </div>
      </div>
      {courses ? (
        <Table
          classNames=""
          Tabledata={courses}
          column={defaultColumns}
          idRow={"id"}
          handleRowDelete={(id) => {
            setWorkingID(id);
            checkDependencies(id);
          }}
          handleRowEdit={(id) =>
            navigate("/editCourse", {
              state: { courseID: id },
            })
          }
        />
      ) : null}
      {showDeleteModal && (
        <DeleteModal
          message={"Are you sure you want to delete this course?"}
          returnMessage={(status) => {
            if (status === "yes") {
              handleDelete(workingID);
            } else {
              setShowDeleteModal(false);
            }
          }}
        />
      )}
      {showAddExistingCourseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Add Existing Course
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Select which course you want to add
            </Text>
            <CustomInput
              label="Course Name"
              placeholder="Enter Course Name"
              icon={search}
              value={courseSearch}
              onValueChange={(value) => {
                setCourseSearch(value);
                setFilteredCourses(
                  allCourses.filter((course) =>
                    course.id.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
            />
            <div>
              {courseSearch && filteredCourses.length >= 1 && (
                <div class="absolute z-20 bg-gray-200 overflow-y-auto rounded-2xl p-4 max-w-48 max-h-60">
                  {filteredCourses.map((course, index) => (
                    <p
                      onClick={() => {
                        setSelectedCourses([course]);
                        setFilteredCourses([]);
                        setCourseSearch("");
                      }}
                      key={index}
                    >
                      {course.id}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {selectedCourses.length > 0 && (
              <div class="flex flex-row gap-4 my-4">
                <Tag
                  text={selectedCourses[0].id}
                  onClick={() => setSelectedCourses([])}
                />
              </div>
            )}
            <CustomInput
              label="Prerequisite for:"
              placeholder="Prerequisite for"
              icon={search}
              value={prerequisiteSearch}
              onValueChange={(value) => {
                setPrerequisiteSearch(value);
                setFilteredPrerequisites(
                  allCourses.filter((course) =>
                    course.id.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
            />
            <div>
              {prerequisiteSearch && filteredPrerequisites.length >= 1 && (
                <div class="absolute z-20 bg-gray-200 rounded-2xl p-4 overflow-y-auto max-w-48">
                  {filteredPrerequisites.map((course) => (
                    <p
                      onClick={() => {
                        handleAddPrerequisites(course);
                        setFilteredPrerequisites(
                          filteredPrerequisites.filter(
                            (item) => item !== course
                          )
                        );
                        setPrerequisiteSearch("");
                      }}
                    >
                      {course.id}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {selectedPrerequisites && (
              <div class="flex flex-row gap-4 my-4">
                {selectedPrerequisites.map((course) => (
                  <Tag
                    text={course.id}
                    onClick={() => handleRemovePrerequisite(course)}
                  />
                ))}
              </div>
            )}

            <div class="flex flex-row gap-4 mt-8">
              <Button text="Add" onClick={() => handleAddExistingCourse()} />
              <Button
                text="Cancel"
                onClick={() => {
                  setShowAddExistingCourseModal(false);
                  setCourseSearch("");
                  setPrerequisiteSearch("");
                  setSelectedPrerequisites([]);
                  setSelectedCourses([]);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {showCourseDependencyModal && (
        <ConfirmationModal
          status={"Warning"}
          message={`The course is a prerequisite or special requirement for ${courseDependencies.join(", ")}. Remove the dependencies first.`}
          close={() => setShowCourseDependencyModal(false)}
        />
      )}
      {showDeleteConfirmation && (
        <ConfirmationModal
          status={"Success"}
          message={"Course deleted successfully."}
          close={() => setShowDeleteConfirmation(false)}
        />
      )}
    </Main>
  );
};

export default CurriculumManagement;
