import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Table from "./components/Table";
import { useEffect, useState } from "react";
import config from "./config";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./components/DeleteModal";
import Button from "./components/Button";

const FacultyCurriculumManagement = () => {
  const [curriculums, setCurriculums] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workingID, setWorkingID] = useState(null);
  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [curriculumType, setCurriculumType] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculums = async () => {
      console.log(localStorage.getItem("userData"));
      try {
      const response = await fetch(
        `${config.backendUrl}/api/facultyAdmin/${JSON.parse(localStorage.getItem("userData")).facultyID}/curriculums`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCurriculums(data.data);
      setCurriculumType(data.curriculumType);
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
      console.log(`Deleted curriculum with ID: ${curriculumID}`);
    } catch (error) {
      console.error("Error deleting curriculum:", error);
    }
  };

  const handleEdit = (curriculumID) => {
    const curriculum = curriculums.find(c => c.id === curriculumID);
    if (curriculum) {
      navigate(`/courseManagement`, { state: { facultyName: localStorage.getItem("userData").facultyName } });
      localStorage.setItem("curriculum", JSON.stringify({curriculumID: curriculumID, facultyID:JSON.parse(localStorage.getItem("userData")).facultyID,facultyName: localStorage.getItem("userData").facultyName}));
    }
   
  };

  const defaultColumns = [
    {
      header: "Curriculum ID",
      accessorKey: "id",
    },
    {
      header: "Major Name",
      accessorKey: "majorName",
    },
    
  ];

  return (
    <Main
      userType="FacultyAdmin"
      activeMenuItem={"manageMajors"}
    >
      <div className="flex justify-between items-center mb-16">
        <Text type="heading">Faculty Curriculum Management</Text>
        <div className="flex justify-end w-96 gap-4 ">
          <Button
            text="+ Add New Curriculum"
            onClick={() =>
              navigate("/addCurriculum", {
                state: { curriculumType: curriculumType},
              })
            }
          />
         
        </div>
      </div>
      {curriculums ? (
        <Table
          classNames=""
          Tabledata={curriculums}
          column={defaultColumns}
          idRow={"id"}
          handleRowDelete={(id) => {
            setWorkingID(id);
            setShowDeleteModal(true);
          }}
          handleRowEdit={(id) => handleEdit(id)}
          canDelete={false}
        />
      ) : null}
      {showDeleteModal && (
        <DeleteModal
        message={`Are you sure you want to delete ${curriculums.find(c => c.curriculumID === workingID).majorName}`}
        
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

export default FacultyCurriculumManagement;
