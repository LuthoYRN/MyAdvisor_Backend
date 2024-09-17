import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Table from "./components/Table";
import { useEffect, useState } from "react";
import config from "./config";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DeleteModal from "./components/DeleteModal";

const CurriculumManagement = () => {
  const [courses, setCourses] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workingID, setWorkingID] = useState(null);
  let navigate = useNavigate();
  let location = useLocation();

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
        console.log("Curriculums:", courses);
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

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
    >
      <Text type="heading" classNames="mb-16">
        Course Management
      </Text>
      {courses ? (
        <Table
          classNames=""
          Tabledata={courses}
          column={defaultColumns}
          idRow={"id"}
          handleRowDelete={(id) => {
            setWorkingID(id);
            setShowDeleteModal(true);
          }}
        />
      ) : null}
      {showDeleteModal && (
        <DeleteModal
          returnMessage={(status) => {
            if (status === "yes") {
              handleDelete(workingID);
            } else {
              setShowDeleteModal(false);
            }
          }}
        />
      )}
    </Main>
  );
};

export default CurriculumManagement;
