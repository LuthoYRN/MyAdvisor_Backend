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
import { useNavigate } from "react-router-dom";
import config from "./config";

const UserManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };
  let navigate = useNavigate();

  React.useEffect(() => {
    localStorage.setItem("isFacultyAdmin", true);

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/sysAdmin/users`);
        const result = await response.json();
        if (result.status === 'success') {
          const formattedData = result.data.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            permission: user.permission.toLowerCase(),
          }));
          setUsers(formattedData);
          setFilteredUsers(formattedData);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [users, setUsers] = React.useState(null);

  const defaultColumns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "User Permission",
      accessorKey: "permission",
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
        users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedPermission ? user.permission === selectedPermission : true)
        )
      );
    }
  }, [users, searchTerm, selectedPermission]);

  return (
    <Main userType="SystemAdmin" activeMenuItem="home">
      <Text type="heading" classNames="mb-8">
        User Management
      </Text>
      <div className="flex gap-8 mb-8 h-10 flex-row">
        <CustomInput
          classNames="w-5/6 !h-10"
          placeholder="Search for users"
          icon={search}
          value={searchTerm}
          onValueChange={(value) => setSearchTerm(value)}
        />
        <Select
          options={[
            { value: "", label: "All" },
            { value: "student", label: "Student" },
            { value: "advisor", label: "Advisor" },
          ]}
          value={selectedPermission}
          onChange={handlePermissionChange}
        />
        <Button text="Add User" onClick={handleAddUser} />
      </div>
      {filteredUsers.length > 0 && filteredUsers && <Table classNames="" Tabledata={filteredUsers} column={defaultColumns} />}
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
    </Main>
  );
};

export default UserManagement;
