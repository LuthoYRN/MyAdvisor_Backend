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

const CurriculumManagement = () => {
  const [courses, setCourses] = useState(null);
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
  const [prerequisiteSearch, setPrerequisiteSearch] = useState("");
  const [filteredPrerequisites, setFilteredPrerequisites] = useState([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/curriculum/${location.state.curriculumID}/courses`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCourses(data.data);
        console.log("Curriculums:", data);
      } catch (error) {
        console.error("Error fetching curriculums:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/curriculums/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setCourses(courses.filter((course) => courses.id !== course));
    } catch (error) {
      console.error("Error deleting curriculum:", error);
    }
  };

  const checkDependencies = async (id) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/curriculum/${location.state.curriculumID}/courses/${id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.proceed) {
        setShowDeleteModal(true);
      } else {
        setShowCourseDependencyModal(true);
      }
    } catch (error) {
      console.error("Error checking course dependencies:", error);
    }
  };

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/curriculum/${location.state.curriculumID}/courses/addExisting`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFilteredCourses(data.data);
        console.log("Filtered Courses:", filteredCourses);
      } catch (error) {
        console.error("Error fetching filtered courses:", error);
      }
    };

    fetchFilteredCourses();
  }, [showAddExistingCourseModal]);

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

  const handleAddCourse = (course) => {
    setSelectedCourses([...selectedCourses, course]);
  };

  const handleRemoveCourse = (course) => {
    setSelectedCourses(
      selectedCourses.filter((selectedCourse) => selectedCourse !== course)
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
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
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
                state: { curriculumID: location.state.curriculumID },
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
              onValueChange={(value) => setCourseSearch(value)}
            />
            <div>
              {courseSearch && filteredCourses.length >= 1 && (
                <div class="absolute bg-gray-200 rounded-2xl p-4 max-w-80">
                  {filteredCourses.map((course) => (
                    <p
                      onClick={() => {
                        handleAddCourse(course);
                        setFilteredCourses(
                          filteredCourses.filter((item) => item !== course)
                        );
                      }}
                    >
                      {course}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div class="flex flex-row gap-4">
              {selectedCourses.map((course) => (
                <Tag text={course} onClick={() => handleRemoveCourse(course)} />
              ))}
            </div>
            <CustomInput
              label="Course Pre-requisites"
              placeholder="Enter Course Pre-requisites"
              icon={search}
              value={prerequisiteSearch}
              onValueChange={(value) => setCourseSearch(value)}
            />
            <div>
              {prerequisiteSearch && filteredPrerequisites.length >= 1 && (
                <div class="absolute bg-gray-200 rounded-2xl p-4 max-w-80">
                  {filteredPrerequisites.map((course) => (
                    <p
                      onClick={() => {
                        handleAddPrerequisites(course);
                        setFilteredPrerequisites(
                          filteredPrerequisites.filter(
                            (item) => item !== course
                          )
                        );
                      }}
                    >
                      {course}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div class="flex flex-row gap-4">
              {selectedPrerequisites.map((course) => (
                <Tag
                  text={course}
                  onClick={() => handleRemovePrerequisite(course)}
                />
              ))}
            </div>
           
            <div class="flex flex-row gap-4 mt-8">
              <Button
                text="Add"
                onClick={() => navigate("/addExistingCourse")}
              />
              <Button
                text="Cancel"
                onClick={() => setShowAddExistingCourseModal(false)}
              />
            </div>
          </div>
        </div>
      )}
      {showCourseDependencyModal && (
        <DeleteModal
          status={"Warning"}
          message={
            "The course is a prerequisite or special requirement for other courses. Are you sure you want to delete it?"
          }
          returnMessage={(status) => {
            status === "yes"
              ? handleDelete(workingID)
              : setShowCourseDependencyModal(false);
          }}
        />
      )}
    </Main>
  );
};

export default CurriculumManagement;
