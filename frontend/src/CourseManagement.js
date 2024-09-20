import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";
import search from "./assets/search.svg";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import Table from "./components/Table";
import Tag from "./components/Tag";
import Text from "./components/Text";
import config from "./config";
import Main from "./layout/Main";


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
      const responseData = await response.json();
      if (!response.ok) {
        throw alert(responseData.message);
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

  const DeleteModal = ({ message, returnMessage }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div
          className="bg-white rounded-2xl p-6 relative"
          style={{ width: '30%', minWidth: '350px', maxWidth: '400px' }}
        >
          <div className="flex flex-row items-center justify-center mb-4">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mr-2" />
            <Text type="sm-heading" classNames="text-center">
              Warning
            </Text>
          </div>
          <Text type="paragraph" classNames="text-center mb-8">
            {message}
          </Text>
          <div className="flex justify-center gap-4">
            <Button
              text="Yes"
              onClick={() => {
                setShowDeleteModal(false); // Close modal immediately when clicked
                returnMessage('yes');      // Then proceed with action
              }}
              className="bg-red-500 text-white"
            />
            <Button
              text="No"
              onClick={() => {
                setShowDeleteModal(false); // Close modal immediately when clicked
                returnMessage('no');
              }}
              className="bg-blue-500 text-white"
            />
          </div>
        </div>
      </div>
    );
  };


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
            }
            // Modal will close regardless of whether 'yes' or 'no' is clicked
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative" style={{ width: '40%', height: 'auto', padding: '2rem' }}>
            <div className="flex flex-row items-center gap-2 mb-4 justify-center">
              <FaExclamationCircle className="text-yellow-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Warning
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl text-center">
              The course is a prerequisite or special requirement for {courseDependencies.join(", ")}.
              Remove the dependencies first.
            </Text>
            <div className="flex justify-center">
              <Button text="Close" onClick={() => setShowCourseDependencyModal(false)} />
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative" style={{ width: '40%', padding: '2rem' }}>
            <div className="flex flex-row items-center gap-2 mb-4 justify-center">
              <FaCheckCircle className="text-green-500 text-3xl" />  {/* Success Icon */}
              <Text type="sm-heading" classNames="text-center">
                Success
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl text-center">
              Course deleted successfully.
            </Text>
            <div className="flex justify-center">
              <Button text="Close" onClick={() => setShowDeleteConfirmation(false)} />
            </div>
          </div>
        </div>
      )}

    </Main>
  );
};

export default CurriculumManagement;
