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
import ConfirmationModal from "./components/ConfirmationModal";

const AddAdvisor = () => {
  const [faculties, setFaculties] = React.useState([]);
  const [seniorAdvisors, setSeniorAdvisors] = React.useState([]);
  const [Faculty, setSelectedFaculty] = React.useState("");
  const [majors, setMajors] = React.useState([]);
  const [juniorAdvisorsSearch, setJuniorAdvisorsSearch] = React.useState("");
  const [selectedSeniorAdvisor, setSelectedSeniorAdvisor] = React.useState("");
  const [Office, setOffice] = React.useState("");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [selectedMajors, setSelectedMajors] = React.useState([]);
  const [majorSearch, setMajorSearch] = React.useState("");
  const [filteredMajors, setFilteredMajors] = React.useState([]);
  
  let navigate = useNavigate();

  React.useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/sysAdmin/users/add/advisor`
        );
        const data = await response.json();
        if (data.status === "success") {
          setFaculties(data.data);
          setSelectedFaculty(data.data[0].id);
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
        const response = await fetch(
          `${config.backendUrl}/api/sysAdmin/users/add/advisor/${Faculty}/senior`
        );
        const data = await response.json();
        if (data.status === "success") {
          setSeniorAdvisors(data.data);
          // Assuming faculties are part of the response or fetched from another endpoint
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFacultiesAndAdvisors();
  }, [Faculty]);

  React.useEffect(() => {
    if (Faculty) {
      const fetchJuniorAdvisors = async () => {
        try {
          const response = await fetch(
            `${config.backendUrl}/api/sysAdmin/users/add/advisor/${Faculty}/junior`
          );
          const data = await response.json();
          if (data.status === "success") {
            setJuniorAdvisors(data.data);
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
          const response = await fetch(
            `${config.backendUrl}/api/sysAdmin/users/add/advisor/${Faculty}`
          );
          const data = await response.json();
          if (data.status === "success") {
            setMajors(data.data);
          }
        } catch (error) {
          console.error("Error fetching majors:", error);
        }
      };

      fetchMajors();
    }
  }, [Faculty]);

  const handleAddAdmin = async () => {
    let advisorData = {
      name: Name,
      surname: Surname,
      email: Email,
      office: Office,
      advisor_level: advisorType,
      facultyID: Faculty,
      curriculums: selectedMajors.map((major) => major.id),
    };

    if (advisorType === "advisor") {
      advisorData = {
        ...advisorData,
        seniorAdvisorID: parseInt(selectedSeniorAdvisor, 10),
      };
    } else if (advisorType === "senior") {
      advisorData = {
      ...advisorData,
      cluster: selectedJuniorAdvisors.map((advisor) => advisor.id),
      };
    }

    console.log(advisorData);
    try {
      const response = await fetch(
        `${config.backendUrl}/api/sysAdmin/users/add/advisor/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(advisorData),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setShowSuccessModal(true);
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

  const handleAddAdvisor = (juniorAdvisor) => {
    setSelectedJuniorAdvisors([...selectedJuniorAdvisors, juniorAdvisor]);
  };

  const handleRemoveAdvisor = (juniorAdvisor) => {
    setSelectedJuniorAdvisors(
      selectedJuniorAdvisors.filter((item) => item !== juniorAdvisor)
    );
  };

  const handleAddMajor = (major) => {
    setSelectedMajors([...selectedMajors, major]);
  };

  const handleRemoveMajor = (major) => {
    setSelectedMajors(
      selectedMajors.filter((item) => item !== major)
    );
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData"))?.facultyID
          ? "FacultyAdmin"
          : "SystemAdmin"
      }
      activeMenuItem="addAdvisor"
    >
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
                onValueChange={(value) => setName(value)}
              />
              <CustomInput
                label="Surname"
                placeholder="Enter surname"
                value={Surname}
                onValueChange={(value) => setSurname(value)}
              />
              <CustomInput
                label="Email"
                placeholder="Enter email"
                value={Email}
                onValueChange={(value) => setEmail(value)}
              />
              <CustomInput
                label="Office"
                placeholder="Enter office details"
                value={Office}
                onValueChange={(value) => setOffice(value)}
              />

              <Select
                label="Faculty"
                options={faculties.map((item) => ({
                  value: item.id,
                  label: item.facultyName,
                }))}
                value={Faculty}
                onChange={(value) => {
                  setSelectedFaculty(value);
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
                    checked={advisorType === "advisor"}
                    onValueChange={() => setAdvisorType("advisor")}
                  />
                  <Text type="paragraph" classNames="mb-2">
                    Advisor
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-8 max-w-md">
              <Button text="Save" onClick={handleAddAdmin} />
              <Button
                text="Back"
                onClick={() => navigate(-1)}
                type="secondary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-5/12">
          <CustomInput
                  label="Majors Advised"
                  placeholder="Enter the majors advised"
                  icon={search}
                  onValueChange={(value) => {
                    setMajorSearch(value);
                    setFilteredMajors(
                      majors.filter(
                        (item) =>
                          item.majorName
                            .toLowerCase()
                            .includes(value.toLowerCase()) 
                      )
                    );
                  }}
                  value={majorSearch}
                />
                <div>
                  {filteredMajors.length >= 1 &&
                    majorSearch && (
                      <div class="absolute bg-gray-400 rounded-2xl p-4 max-w-80">
                        {filteredMajors.map((major) => (
                          <Text
                            onClick={() => {
                              handleAddMajor(major);
                              setFilteredMajors(
                                filteredMajors.filter(
                                  (item) => item.majorName !== major.majorName
                                )
                              );
                              setMajorSearch("");
                            }}
                            >
                            {major.majorName}
                            </Text>
                          ))}
                          </div>
                        )}
                      </div>
                      <div class="flex flex-row flex-wrap gap-4 ">
                        {selectedMajors
                        .filter((major) => major.majorName) // Filter out empty items
                        .map((major) => (
                          <Tag
                          text={major.majorName}
                          onClick={() => handleRemoveMajor(major)}
                          />
                        ))}
                      </div>
                    {advisorType === "advisor" ? (
                      <Select
                      label={"Senior Advisor"}
                      placeholder={"Select your senior advisor"}
                      options={seniorAdvisors.map((item) => ({
                        value: item.id,
                        label: `${item.name} ${item.surname}`,
                      }))}
                      onChange={(value) => setSelectedSeniorAdvisor(value)}
                      />
                    ) : advisorType === "senior" ? (
                      <>
                      <CustomInput
                        label="Advisor Cluster"
                        placeholder="Select the advisors in your cluster"
                        icon={search}
                        onValueChange={(value) => {
                    setJuniorAdvisorsSearch(value);
                    setFilteredJuniorAdvisors(
                      juniorAdvisors.filter(
                        (item) =>
                          item.name
                            .toLowerCase()
                            .includes(value.toLowerCase()) ||
                          item.surname
                            .toLowerCase()
                            .includes(value.toLowerCase())
                      )
                    );
                  }}
                  value={juniorAdvisorsSearch}
                />
                <div>
                  {filteredJuniorAdvisors.length >= 1 &&
                    juniorAdvisorsSearch && (
                      <div class="absolute bg-gray-400 rounded-2xl p-4 max-w-80">
                        {filteredJuniorAdvisors.map((juniorAdvisor) => (
                          <Text
                            onClick={() => {
                              handleAddAdvisor(juniorAdvisor);
                              setFilteredJuniorAdvisors(
                                filteredJuniorAdvisors.filter(
                                  (item) => item.name !== juniorAdvisor.name
                                )
                              );
                              setJuniorAdvisorsSearch("");
                            }}
                          >
                            {juniorAdvisor.name + " " + juniorAdvisor.surname}
                          </Text>
                        ))}
                      </div>
                    )}
                </div>
                <div class="flex flex-row flex-wrap gap-4 ">
                  {selectedJuniorAdvisors.map((juniorAdvisor) => (
                    <Tag
                      text={juniorAdvisor.name}
                      onClick={() => handleRemoveAdvisor(juniorAdvisor)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <ConfirmationModal
          status={"Success"}
          message={"Advisor added successfully."}
          close={() => setShowSuccessModal(false)}
        />
      )}
    </Main>
  );
};

export default AddAdvisor;
