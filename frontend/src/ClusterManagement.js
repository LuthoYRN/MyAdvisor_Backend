import React from "react";
import { useNavigate } from "react-router-dom";
import advisor from "./assets/advisor.svg";
import search from "./assets/search.svg";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import DeleteModal from "./components/DeleteModal";
import ErrorModal from "./components/errorModal";
import SuccessModal from "./components/successModal";
import Table from "./components/Table";
import Tag from "./components/Tag";
import Text from "./components/Text";
import config from "./config";
import Main from "./layout/Main";

const UserManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const [workingID, setWorkingID] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showEditAdvisorModal, setShowEditAdvisorModal] = React.useState(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showReassignModal, setShowReassignModal] = React.useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    React.useState(false);
  const [advisorSearch, setAdvisorSearch] = React.useState("");
  const [filteredAdvisors, setFilteredAdvisors] = React.useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };
  let navigate = useNavigate();

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/cluster`
        );
        const result = await response.json();
        if (result.status === "success") {
          setLoading(false);
          setUsers(result.data);
          console.log("Users:", result.data);
          setFilteredUsers(result.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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

  React.useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [users, searchTerm]);

  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/cluster/${userId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
        setShowDeleteModal(false);
        const updatedUsers = users.filter((user) => user.uuid !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowDeleteConfirmationModal(true);
      } else {
        console.error("Error removing user:", result.message);
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const [courses, setCourses] = React.useState([]);
  const [filteredCourses, setFilteredCourses] = React.useState([]);
  const [selectedCourses, setSelectedCourses] = React.useState([]);
  const [curriculumSearch, setCurriculumSearch] = React.useState("");

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
          console.log(result.data.curriculumsAdvising);
        }
      } catch (error) {
        console.error("Error fetching advising courses:", error);
      }
    };

    if (showEditAdvisorModal) {
      fetchAdvisingCourses();
    }
  }, [showEditAdvisorModal, workingID]);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/cluster/${workingID}`
        );
        const result = await response.json();
        if (result.status === "success") {
          setCourses(result.data.curriculumsInFaculty);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (showEditAdvisorModal) {
      fetchCourses();
    }
  }, [showEditAdvisorModal, workingID]);

  const [juniorAdvisors, setJuniorAdvisors] = React.useState([]);

  React.useEffect(() => {
    const fetchJuniorAdvisors = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/cluster/add`
        );
        const result = await response.json();
        if (result.status === "success") {
          setJuniorAdvisors(result.data);
          console.log("Junior advisors:", juniorAdvisors);
        }
      } catch (error) {
        console.error("Error fetching junior advisors:", error);
      }
    };

    fetchJuniorAdvisors();
  }, [showAddUserModal]);

  const handleAddAdvisorToCluster = async () => {
    if (!selectedAdvisor) {
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/cluster/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            juniorID: selectedAdvisor.uuid,
          }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        setShowAddUserModal(false);
        setSelectedAdvisor(null);
        setUsers([...users, selectedAdvisor]);
        setFilteredUsers([...users, selectedAdvisor]);
        setAdvisorSearch("");
        setShowConfirmationModal(true);
        console.log("Advisor added to the cluster successfully.");
      } else {
        console.error("Error adding advisor to cluster:", result.message);
      }
    } catch (error) {
      console.error("Error adding advisor to cluster:", error);
    }
  };

  if (loading) {
    return (
      <Main userType="senior" activeMenuItem="manageCluster">
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }

  return (
    <Main userType="senior" activeMenuItem="manageCluster">
      <Text type="heading" classNames="mb-8">
        Cluster Management
      </Text>
      <div className="flex gap-8 mb-8 h-10 flex-row">
        <CustomInput
          classNames="w-5/6 !h-10"
          placeholder="Search for Advisors"
          icon={search}
          value={searchTerm}
          onValueChange={(value) => setSearchTerm(value)}
        />
        <div className="w-1/4">
          <Button text="Add Advisor" onClick={handleAddUser} />
        </div>
      </div>
      {filteredUsers.length > 0 && filteredUsers && (
        <Table
          Tabledata={filteredUsers}
          column={defaultColumns}
          handleRowDelete={(row) => {
            setWorkingID(row);
            setShowDeleteModal(true);
          }}
          handleRowEdit={(row) => {
            setWorkingID(row);
            setShowEditAdvisorModal(true);
          }}
          idRow="uuid"
        />
      )}
      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Add Advisor
            </Text>
            <Text classNames="mb-8">Search the advisor you wish to add</Text>

            <CustomInput
              label="Advisor Name"
              placeholder="Enter Advisor Name"
              icon={search}
              value={advisorSearch}
              onValueChange={(value) => {
                setAdvisorSearch(value);
                setFilteredAdvisors(
                  juniorAdvisors.filter((advisor) =>
                    advisor.name.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
            />
            <div>
              {advisor && filteredAdvisors.length >= 1 && (
                <div class="absolute z-20 bg-gray-200 overflow-y-auto rounded-2xl p-4 max-w-48">
                  {filteredAdvisors.map((advisor) => (
                    <p
                      onClick={() => {
                        setSelectedAdvisor(advisor);
                        setFilteredAdvisors([]);
                        setAdvisorSearch("");
                      }}
                    >
                      {advisor.name} {advisor.surname}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {selectedAdvisor && (
              <div class="flex flex-row gap-4 my-4">
                <Tag
                  text={`${selectedAdvisor.name} ${selectedAdvisor.surname}`}
                  onClick={() => setSelectedAdvisor(null)}
                />
              </div>
            )}
            <div class="flex flex-row gap-4 mt-8">
              <Button
                text="Add"
                onClick={() => {
                  handleAddAdvisorToCluster();
                  setShowAddUserModal(false);
                }}
              />
              <Button
                text="Cancel"
                onClick={() => setShowAddUserModal(false)}
              />
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <DeleteModal
          message={`Are you sure you want to remove ${users.find((user) => user.uuid === workingID)?.name || "this advisor"} from your advisor cluster.`}
          returnMessage={(message) =>
            message === "yes"
              ? handleRemoveUser(workingID)
              : setShowDeleteModal(false)
          }
        />
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
                    course.majorName.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
            />
            <div>
              {curriculumSearch && filteredCourses.length >= 1 && (
                <div class="absolute z-20 bg-gray-200 overflow-y-auto rounded-2xl p-4 max-w-48">
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

      <SuccessModal
        isOpen={showConfirmationModal}
        title={"Success"}
        message="Advisor added to the cluster successfully."
        onClose={() => {
          setShowConfirmationModal(false);
        }}
      />
      <ErrorModal
        isOpen={showErrorModal}
        title="Error"
        message="Please select an advisor before proceeding."
        onContinue={() => {
          setShowErrorModal(false);
          setShowAddUserModal(true);
        }}
      />
      <SuccessModal
        isOpen={showDeleteConfirmationModal}
        title={"Success"}
        message="Advisor removed from the cluster successfully."
        onClose={() => {
          setShowDeleteConfirmationModal(false);
        }}
      />
    </Main>
  );
};

export default UserManagement;
