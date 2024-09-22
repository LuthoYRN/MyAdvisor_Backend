import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Table from "./components/Table";
import { useEffect, useState } from "react";
import config from "./config";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./components/DeleteModal";

const CurriculumManagement = () => {
  const [curriculums, setCurriculums] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workingID, setWorkingID] = useState(null);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/curriculums`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLoading(false);
        setCurriculums(data.data);
        console.log("Curriculums:", data.data);
      } catch (error) {
        console.error("Error fetching curriculums:", error);
      }
    };

    fetchCurriculums();
  }, []);

  const handleDelete = async (curriculumID) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/curriculums/${curriculumID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setCurriculums(
        curriculums.filter(
          (curriculum) => curriculum.curriculumID !== curriculumID
        )
      );
      setShowDeleteModal(false);
      setWorkingID(null);
      console.log(`Deleted curriculum with ID: ${curriculumID}`);
    } catch (error) {
      console.error("Error deleting curriculum:", error);
    }
  };

  const handleEdit = (curriculumID) => {
    const curriculum = curriculums.find((c) => c.curriculumID === curriculumID);
    if (curriculum) {
      navigate(`/courseManagement`, {
        state: { curriculumID: curriculumID, facultyID: curriculum.facultyID },
      });
      localStorage.setItem("curriculum", JSON.stringify(curriculum));
      console.log("Curriculum:", curriculum);
    }
  };

  const defaultColumns = [
    {
      header: "Curriculum ID",
      accessorKey: "curriculumID",
    },
    {
      header: "Curriculum Name",
      accessorKey: "curriculumName",
    },
    {
      header: "Faculty Name",
      accessorKey: "facultyName",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
  ];

  if (loading) {
    return (
      <Main
        userType={
          JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
        }
        activeMenuItem={"manageMajors"}
      >
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
      activeMenuItem={"manageMajors"}
    >
      <Text type="heading" classNames="mb-16">
        Curriculum Management
      </Text>
      {curriculums ? (
        <Table
          classNames=""
          Tabledata={curriculums}
          column={defaultColumns}
          idRow={"curriculumID"}
          handleRowDelete={(id) => {
            setWorkingID(id);
            setShowDeleteModal(true);
          }}
          handleRowEdit={(id) => handleEdit(id)}
        />
      ) : null}
      {showDeleteModal && (
        <DeleteModal
          message={`Are you sure you want to stop being an advisor for ${curriculums.find((c) => c.curriculumID === workingID)?.curriculumName}?`}
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
