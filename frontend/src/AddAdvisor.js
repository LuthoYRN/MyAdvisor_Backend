import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Select from "./components/Select.jsx";
import Checkbox from "./components/Checkbox.jsx";
import Tag from "./components/Tag.jsx";
import search from "./assets/search.svg";
import config from "./config.js";
import { useNavigate } from "react-router-dom";

/*
    Data Needed:
    - List of faculties and departments with their relationships
    - Save Admin to DB

  */

const AddAdvisor = () => {
  // Mock data Need to give list of faculties and departments
 
const [faculties, setFaculties] = React.useState([]);
const [seniorAdvisors, setSeniorAdvisors] = React.useState([]);
const [Faculty, setSelectedFaculty] = React.useState("");
let navigate = useNavigate();

React.useEffect(() => {
  const fetchFaculties = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/sysAdmin/users/add/advisor`);
      const data = await response.json();
      if (data.status === "success") {
        setFaculties(data.data);
        console.log("Faculties:", faculties);
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  fetchFaculties();
}, []);

React.useEffect(() => {
  // Fetch faculties and senior advisors data
  const fetchFacultiesAndAdvisors = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/sysAdmin/users/add/advisor/${Faculty}/senior`);
      const data = await response.json();
      if (data.status === "success") {
        setSeniorAdvisors(data.data);
        // Assuming faculties are part of the response or fetched from another endpoint
        setFaculties(["Faculty of Science", "Faculty of Engineering"]); // Example faculties
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchFacultiesAndAdvisors();
}, []);

React.useEffect(() => {
  if (Faculty) {
    const fetchJuniorAdvisors = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/sysAdmin/users/add/advisor/${Faculty}/junior`);
        const data = await response.json();
        if (data.status === "success") {
          setJuniorAdvisors(data.data.map(advisor => `${advisor.name} ${advisor.surname}`));
        }
      } catch (error) {
        console.error("Error fetching junior advisors:", error);
      }
    };

    fetchJuniorAdvisors();
  }
}, [Faculty]);

React.useEffect(() => {
  if (Faculty) {
    const fetchMajors = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/sysAdmin/users/add/advisor/${Faculty}`);
        const data = await response.json();
        if (data.status === "success") {
          setFilteredSeniorAdvisors(data.data.map(major => [major.majorName, major.id]));
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
  }
}, [Faculty]);

const handleAddAdmin = async () => {
  const advisorData = {
    name: Name,
    surname: Surname,
    email: Email,
    faculty: Faculty,
    advisorType: advisorType,
    equivalents: equivalents,
    juniorAdvisors: selectedJuniorAdvisors,
  };

  try {
    const response = await fetch(`${config.backendUrl}/api/sysAdmin/users/add/advisor/${Faculty}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(advisorData),
    });

    const data = await response.json();
    if (data.status === "success") {
      console.log("Advisor added successfully:", data);
      // Optionally, reset form or give feedback to the user
    } else {
      console.error("Error adding advisor:", data.message);
    }
  } catch (error) {
    console.error("Error adding advisor:", error);
  }
};
  
  const [Name, setName] = React.useState("");
  const [Surname, setSurname] = React.useState("");
  const [Email, setEmail] = React.useState("");

  
  const [advisorType, setAdvisorType] = React.useState("");
  const [equivalents, setEquivalents] = React.useState("");
  const [juniorAdvisors, setJuniorAdvisors] = React.useState([]);
  const [filteredJuniorAdvisors, setFilteredJuniorAdvisors] = React.useState(
    []
  );
  const [selectedJuniorAdvisors, setSelectedJuniorAdvisors] = React.useState(
    []
  );
  const [filteredSeniorAdvisors, setFilteredSeniorAdvisors] = React.useState(
    []
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
                  value: item.id,
                  label: item.facultyName,
                }))}
                value={Faculty}
                onChange={(value) => {setSelectedFaculty(value)}}
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
              <Button text="Back" onClick={()=>navigate(-1)} type="secondary" />
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
