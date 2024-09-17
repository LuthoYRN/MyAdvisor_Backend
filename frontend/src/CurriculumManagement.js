import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Table from "./components/Table";
import { useEffect, useState } from "react";
import config from "./config";

const CurriculumManagement = () => {
  const [curriculums, setCurriculums] = useState([]);

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const advisorID = 1; // Replace with dynamic ID if needed
        const response = await fetch(`${config.backendUrl}/api/advisor/${advisorID}/curriculums`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCurriculums(data.data);
        console.log("Curriculums:", data.data);
      } catch (error) {
        console.error("Error fetching curriculums:", error);
      }
    };

    fetchCurriculums();
  }, []);

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
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
    >
      <Text type="heading" classNames="mb-16">
        Curriculum Management
      </Text>

      <Table classNames="" Tabledata={mockData} column={defaultColumns} />
    </Main>
  );
};

export default CurriculumManagement;
