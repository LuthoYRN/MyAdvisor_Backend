import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import Table from "./components/Table";
import admin from "./assets/admin.svg";
import advisor from "./assets/advisor.svg";
import CustomInput from "./components/CustomInput";
import Select from "./components/Select";
import search from "./assets/search.svg";
import SuccessModal from "./components/successModal";
import Tag from "./components/Tag"; // Import the Tag component
import { useNavigate } from "react-router-dom";
import config from "./config";

const AdvisorManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const [showReassignModal, setShowReassignModal] = React.useState(false);
  const [workingID, setWorkingID] = React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [showEditAdvisorModal, setShowEditAdvisorModal] = React.useState(false);
  const [curriculumSearch, setCurriculumSearch] = React.useState("");
  const [filteredCourses, setFilteredCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCourses, setSelectedCourses] = React.useState([]);

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };
  let navigate = useNavigate();

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/facultyAdmin/${JSON.parse(localStorage.getItem("userData")).facultyID}/advisors`
        );
        const result = await response.json();
        if (result.status === "success") {
          setUsers(result.data);
          setLoading(false);
          console.log("Users:", result.data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditAdivsor = async () => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/cluster/${workingID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            curriculumsAdvised: selectedCourses.map((course) => course.id),
          }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        setShowEditAdvisorModal(false);
        setSelectedCourses([]);
        setCurriculumSearch("");
        setShowReassignModal(true);
      } else {
        console.error("Error adding course:", result.message);
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  React.useEffect(() => {
    const fetchAdvisingCourses = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/cluster/${workingID}`
        );
        const result = await response.json();
        if (result.status === "success") {
          setSelectedCourses(result.data.curriculumsAdvising);
          setCourses(result.data.curriculumsInFaculty);
        }
      } catch (error) {
        console.error("Error fetching advising courses:", error);
      }
    };

    if (showEditAdvisorModal) {
      fetchAdvisingCourses();
    }
  }, [showEditAdvisorModal, workingID]);

  const [users, setUsers] = React.useState(null);

  const defaultColumns = [
    {
      header: "ID",
      accessorKey: "uuid",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Surname",
      accessorKey: "surname",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Office",
      accessorKey: "office",
    },
    {
      header: "Advior Level",
      accessorKey: "advisor_level",
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState("");

  const [filteredUsers, setFilteredUsers] = React.useState([]);

  React.useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [users, searchTerm]);

  const [selectedPermission, setSelectedPermission] = React.useState("");

  const handlePermissionChange = (value) => {
    setSelectedPermission(value);
  };

  React.useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedPermission ? user.permission === selectedPermission : true)
        )
      );
    }
  }, [users, searchTerm, selectedPermission]);

  const handleEditAdvisor = () => {
    // Implement the function to handle editing advisor
  };

  if (loading) {
    return (
      <Main userType="FacultyAdmin" activeMenuItem="studentAdvisors">
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }

  return (
    <Main userType="FacultyAdmin" activeMenuItem="studentAdvisors">
      <Text type="heading" classNames="mb-8">
        Advisor Management
      </Text>
      <div className="flex gap-8 mb-8 h-10 flex-row">
        <CustomInput
          classNames="w-5/6 !h-10"
          placeholder="Search for Advisors"
          icon={search}
          value={searchTerm}
          onValueChange={(value) => setSearchTerm(value)}
        />
        <Select
          options={[
            { value: "", label: "All" },
            { value: "senior", label: "Senior Advisor" },
            { value: "advisor", label: "Advisor" },
          ]}
          value={selectedPermission}
          onChange={handlePermissionChange}
        />
        <Button text="Add Advisor" onClick={() => navigate("/addAdvisor")} />
      </div>
      {filteredUsers.length > 0 && filteredUsers && (
        <Table
          classNames=""
          Tabledata={filteredUsers}
          column={defaultColumns}
          handleRowEdit={(id) => {
            setWorkingID(id);
            setShowEditAdvisorModal(true);
          }}
          idRow={"uuid"}
          canDelete={false}
          hasLog={true}
          handleLog={(id) =>
            navigate("/adviceLog", { state: { advisorID: id } })
          }
        />
      )}
      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Add User
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Select which type of user you want to add
            </Text>
            <div className="flex gap-8 mb-4">
              <div onClick={() => navigate("/addFacultyAdmin")}>
                <Text type="paragraph" classNames="mb-2">
                  Admin
                </Text>
                <img className="cursor-pointer" src={admin} alt="admin" />
              </div>
              <div onClick={() => navigate("/addAdvisor")}>
                <Text type="paragraph" classNames="mb-2">
                  Advisor
                </Text>
                <img className="cursor-pointer" src={advisor} alt="advisor" />
              </div>
            </div>
            <Button text="Close" onClick={handleCloseModal} />
          </div>
        </div>
      )}
      {showEditAdvisorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Add or Remove Curriculums Advised
            </Text>
            <Text classNames="mb-8">
              Select which curriculums you want to add or remove
            </Text>
            <CustomInput
              label="Curriculums Name"
              placeholder="Enter Curriculums Name"
              icon={search}
              value={curriculumSearch}
              onValueChange={(value) => {
                setCurriculumSearch(value);
                setFilteredCourses(
                  courses.filter((course) =>
                    course.majorName
                      .toLowerCase()
                      .includes(curriculumSearch.toLowerCase())
                  )
                );
              }}
            />
            <div>
              {curriculumSearch && filteredCourses.length && (
                <div class="absolute z-20 bg-gray-200 overflow-y-auto rounded-2xl p-4 max-w-48 max-h-60">
                  {filteredCourses.map((course) => (
                    <p
                      onClick={() => {
                        if (!selectedCourses.some((c) => c.id === course.id)) {
                          setSelectedCourses([...selectedCourses, course]);
                        }
                        setFilteredCourses([]);
                        setCurriculumSearch("");
                      }}
                    >
                      {course.majorName}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {selectedCourses.length > 0 && (
              <div class="flex flex-row gap-4 my-4 flex-wrap">
                {selectedCourses.map((course) => (
                  <Tag
                    key={course.id}
                    text={course.majorName}
                    onClick={() =>
                      setSelectedCourses(
                        selectedCourses.filter((c) => c.id !== course.id)
                      )
                    }
                  />
                ))}
              </div>
            )}

            <div class="flex flex-row gap-4 mt-8">
              <Button text="Add" onClick={() => handleEditAdivsor()} />
              <Button
                text="Cancel"
                onClick={() => {
                  setShowEditAdvisorModal(false);
                  setCurriculumSearch("");
                  setSelectedCourses([]);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={showReassignModal}
        title={"Success"}
        message="Advisor reassigned successfully."
        onClose={() => {
          setShowReassignModal(false);
          window.location.reload();
        }}
      />
    </Main>
  );
};

export default AdvisorManagement;
