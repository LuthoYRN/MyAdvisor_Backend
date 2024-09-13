import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import UserCard from "./components/UserCard";
import { useNavigate } from "react-router-dom";
import config from "./config";
/* 
Data Needed:
- Student Name
- Date
- Time
- Reason for Appointment
- Uploaded Documents

*/

const Appointment = () => {
  const [advisors, setAdvisors] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedAdvisor, setSelectedAdvisor] = React.useState(null);

  let navigate = useNavigate();

  const handleAdvisorClick = (index) => {
    setSelectedAdvisor(advisors[index]);
    setActiveIndex(index);
  };

  const handleContinue = () => {
    // Do something with the selected advisor
    if (selectedAdvisor) {
       navigate("/appointmentDetails", { state: selectedAdvisor });
      // Add your logic here to save the selected advisor
    } else {
      console.log("No advisor selected");
      // Handle the case when no advisor is selected
    }
  };

  const [page, setPage] = React.useState(1);
  const advisorsPerPage = 6;
  const totalPages = Math.ceil(advisors.length / advisorsPerPage);
  const startIndex = (page - 1) * advisorsPerPage;
  const endIndex = startIndex + advisorsPerPage;
  const displayedAdvisors = advisors.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setPage(page + 1);
    setSelectedAdvisor(null);
    setActiveIndex(null);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
    setSelectedAdvisor(null);
    setActiveIndex(null);
  };

  React.useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        console.log("Fetching advisors...");
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/advisors`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        console.log("response", response);
        const data = await response.json();
        setAdvisors(data.data);
        console.log("Advisors:", advisors);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchAdvisors();
  }, []);

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className="flex flex-col flex-auto">
        <div class="flex-auto">
          <Text type="heading" classNames="mb-16">
            Appointment Details
          </Text>
          <Text type="sm-heading" classNames="mb-4">
            Choose an advisor
          </Text>
          <div class="grid grid-cols-3 grid-rows-2 gap-4  w-full">
            {displayedAdvisors.map((advisor, index) => (
              <UserCard
                key={index}
                name={advisor.name}
                majors={advisor.majors.join(', ')}
                office={advisor.office}
                image={advisor.profile_url}
                active={index === activeIndex}
                onClick={() => handleAdvisorClick(index)}
              />
            ))}
          </div>
        </div>
        <div class="flex flex-row gap-8 max-w-md">
          {page > 1 ? (
            <Button text="Previous" onClick={handlePreviousPage} />
          ) : page === 1 ? (
            <Button text="Previous" type="secondary" disabled={true} />
          ) : null}

          {page < totalPages ? (
            <Button text="Next" onClick={handleNextPage} />
          ) : page === totalPages ? (
            <Button text="Next" type="secondary" disabled={true} />
          ) : null}
        </div>
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Continue" onClick={handleContinue} />
          <Button text="Back" type="secondary" />
        </div>
      </div>
    </Main>
  );
};

export default Appointment;
