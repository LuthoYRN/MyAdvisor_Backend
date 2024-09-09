import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Select from "./components/Select.jsx";
import Checkbox from "./components/Checkbox.jsx";

/*
    Data Needed:
    - List of faculties and departments with their relationships
    - Save Admin to DB

  */

const AddCourse = () => {
  // Mock data Need to give list of faculties and departments
  const faculties = [
    "Science",
    "Engineering",
    "Humanities",
    "Commerce",
    "Health Sciences",
  ];

  const departments = [
    ["Computer Science", "Science"],
    ["Mathematics", "Science"],
    ["Physics", "Science"],
    ["Chemistry", "Science"],
    ["Biology", "Science"],
    ["English", "Humanities"],
    ["History", "Humanities"],
    ["Geography", "Humanities"],
    ["Mechanical Engineering", "Engineering"],
    ["Civil Engineering", "Engineering"],
    ["Electrical Engineering", "Engineering"],
    ["Chemical Engineering", "Engineering"],
    ["Industrial Engineering", "Engineering"],
    ["Mining Engineering", "Engineering"],
    ["Geology", "Science"],
    ["Economics", "Commerce"],
    ["Business Management", "Commerce"],
    ["Marketing", "Commerce"],
    ["Finance", "Commerce"],
    ["Accounting", "Commerce"],
    ["Human Resources", "Commerce"],
  ];

  const seniorAdvisor = [
    ["John Doe", "Computer Science"],
    ["Jane Doe", "Mathematics"],
    ["James Doe", "Physics"],
    ["Jill Doe", "Chemistry"],
    ["Jack Doe", "Biology"],
    ["Jenny Doe", "English"],
    ["Jared Doe", "History"],
    ["Jasmine Doe", "Geography"],
    ["Micheal Doe", "Mechanical Engineering"],
    ["Micheal Doe", "Civil Engineering"],
    ["Micheal Doe", "Electrical Engineering"],
    ["Micheal Doe", "Chemical Engineering"],
    ["Micheal Doe", "Industrial Engineering"],
    ["Micheal Doe", "Mining Engineering"],
    ["Micheal Doe", "Geology"],
    ["Micheal Doe", "Economics"],
    ["Micheal Doe", "Business Management"],
    ["Micheal Doe", "Marketing"],
    ["Micheal Doe", "Finance"],
    ["Micheal Doe", "Accounting"],
    ["Micheal Doe", "Human Resources"],
  ];

  const [Name, setName] = React.useState("");
  const [Surname, setSurname] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Department, setDepartment] = React.useState(
    departments
      .filter((item) => item[1] === faculties[0])
      .map((item) => item[0])
  );
  const [SelectedDepartment, setSelectedDepartment] = React.useState("");
  const [Faculty, setSelectedFaculty] = React.useState("");
  const [advisorType, setAdvisorType] = React.useState("");
  const [equivalents, setEquivalents] = React.useState("");

  const handleAddAdmin = () => {};

  const filteredSeniorAdvisors = seniorAdvisor.filter(
    (item) => item[1] === SelectedDepartment
  );

  return (
    <Main>
      <div className="flex flex-col flex-auto gap-2 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Add Admin
        </Text>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-1 w-5/12">
            <CustomInput
              label="Name"
              placeholder="Enter name"
              value={Name}
              onValueChange={setName}
            />
            <CustomInput
              label="Surname"
              placeholder="Enter surname"
              value={Surname}
              onValueChange={setSurname}
            />
            <CustomInput
              label="Email"
              placeholder="Enter email"
              value={Email}
              onValueChange={setEmail}
            />

            <Select
              label="Faculty"
              options={faculties.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(value) => {
                setDepartment(
                  departments
                    .filter((item) => item[1] === value)
                    .map((item) => item[0])
                );
                setSelectedFaculty(value);
              }}
            />

            <Select
              label="Department"
              options={Department.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(value) => {
                setSelectedDepartment(value);
              }}
            />

            <div className="flex flex-row gap-4">
              <div class="flex flex-row">
                <Text type="paragraph" classNames="mb-2">
                  Senior Advisor
                </Text>
                <Checkbox onChange={() => setAdvisorType("senior")} />
              </div>
            </div>
            <div className="flex flex-row gap-8 max-w-md">
              <Button text="Save" onClick={handleAddAdmin} />
              <Button text="Back" type="secondary" />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-5/12">
            <Select
              label={"Senior Advisor"}
              options={filteredSeniorAdvisors.map((item) => ({
                value: item[0],
                label: item[0],
              }))}
            ></Select>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AddCourse;
