import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Select from "./components/Select.jsx";
import Checkbox from "./components/Checkbox.jsx";
import Tag from "./components/Tag.jsx";
import search from "./assets/search.svg";

/*
    Data Needed:
    - List of faculties and departments with their relationships
    - Save Admin to DB

  */

const AddAdvisor = () => {
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
  const [juniorAdvisors, setJuniorAdvisors] = React.useState([]);
  const [filteredJuniorAdvisors, setFilteredJuniorAdvisors] = React.useState(
    []
  );
  const [selectedJuniorAdvisors, setSelectedJuniorAdvisors] = React.useState(
    []
  );

  const handleAddAdmin = () => {};

  const filteredSeniorAdvisors = seniorAdvisor.filter(
    (item) => item[1] === SelectedDepartment
  );

  const handleAddAdvisor = (juniorAdvisor) => {
    setSelectedJuniorAdvisors([...selectedJuniorAdvisors, juniorAdvisor]);
  };

  const handleRemoveAdvisor = (juniorAdvisor) => {
    setSelectedJuniorAdvisors(
      selectedJuniorAdvisors.filter((item) => item !== juniorAdvisor)
    );
  };

  return (
    <Main userType="SystemAdmin" activeMenuItem="addAdvisor">
      <div className="flex flex-col flex-auto gap-2 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Add Advisor
        </Text>
        <div className="flex flex-auto flex-row gap-8">
          <div className="flex flex-auto justify-between flex-col gap-4 w-5/12">
            <div className="flex flex-col gap-4">
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

              <div className="flex flex-col gap-4">
                <Text type="paragraph">Advisor Type:</Text>
                <div class="flex flex-row">
                  <Checkbox
                    checked={advisorType === "senior"}
                    onValueChange={() => setAdvisorType("senior")}
                  />
                  <Text type="paragraph" classNames="mb-2">
                    Senior Advisor
                  </Text>
                </div>
                <div class="flex flex-row">
                  <Checkbox
                    checked={advisorType === "junior"}
                    onValueChange={() => setAdvisorType("junior")}
                  />
                  <Text type="paragraph" classNames="mb-2">
                    Advisor
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-8 max-w-md">
              <Button text="Save" onClick={handleAddAdmin} />
              <Button text="Back" type="secondary" />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-5/12">
            <Select
              label={"Major Advised"}
              placeholder={"Select the major advised"}
              options={filteredSeniorAdvisors.map((item) => ({
                value: item[0],
                label: item[0],
              }))}
            />
            {advisorType === "junior" ? (
              <Select
                label={"Senior Advisor"}
                placeholder={"Select your senior advisor"}
                options={filteredSeniorAdvisors.map((item) => ({
                  value: item[0],
                  label: item[0],
                }))}
              />
            ) : advisorType === "senior" ? (
              <>
                <CustomInput
                  label="Advisor Cluster"
                  placeholder="Select the advisors in your cluster"
                  icon={search}
                  onValueChange={(value) => setJuniorAdvisors(value)}
                  value={juniorAdvisors}
                />
                <div>
                  {filteredJuniorAdvisors.length >= 1 && (
                    <div class="absolute bg-gray-400 rounded-2xl p-4 max-w-80">
                      {filteredJuniorAdvisors.map((juniorAdvisor) => (
                        <Text
                          onClick={() => {
                            handleAddAdvisor(juniorAdvisor);
                            setFilteredJuniorAdvisors(
                              filteredJuniorAdvisors.filter(
                                (item) => item !== juniorAdvisor
                              )
                            );
                          }}
                        >
                          {juniorAdvisor}
                        </Text>
                      ))}
                    </div>
                  )}
                </div>
                <div class="flex flex-row flex-wrap gap-4 ">
                  {selectedJuniorAdvisors.map((juniorAdvisor) => (
                    <Tag
                      text={juniorAdvisor}
                      onClick={() => handleRemoveAdvisor(juniorAdvisor)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AddAdvisor;
