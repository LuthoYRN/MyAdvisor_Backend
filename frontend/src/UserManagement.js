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

const UserManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };

  const mockData = [
    {
      id: 1,
      first_name: "Isador",
      last_name: "Kruger",
      email: "ikruger0@huffingtonpost.com",
      user_permission: "student",
    },
    {
      id: 2,
      first_name: "Brady",
      last_name: "Gommery",
      email: "bgommery1@amazon.de",
      user_permission: "advisor",
    },
    {
      id: 3,
      first_name: "Boycie",
      last_name: "Drei",
      email: "bdrei2@uol.com.br",
      user_permission: "student",
    },
    {
      id: 4,
      first_name: "Connie",
      last_name: "Wooffinden",
      email: "cwooffinden3@desdev.cn",
      user_permission: "advisor",
    },
  ];

  const defaultColumns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "First Name",
      accessorKey: "first_name",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "User Permission",
      accessorKey: "user_permission",
    },
  ];

  return (
    <Main>
      <Text type="heading" classNames="mb-16">
        User Management
      </Text>
      <div class="flex gap-8 mb-8 h-10 flex-row">
        <CustomInput
          classNames="w-5/6 !h-10"
          placeholder="Search for users"
          icon={search}
        />
        <Select
          options={[
            { value: "student", label: "Student" },
            { value: "advisor", label: "Advisor" },
          ]}
        />
        <Button text="Add User" onClick={handleAddUser} />
      </div>
      <Table classNames="" Tabledata={mockData} column={defaultColumns} />
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
              <div>
                <Text type="paragraph" classNames="mb-2">
                  Admin
                </Text>
                <img class="cursor-pointer" src={admin} alt="video" />
              </div>
              <div>
                <Text type="paragraph" classNames="mb-2">
                  Advisor
                </Text>
                <img class="cursor-pointer" src={advisor} alt="video" />
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
