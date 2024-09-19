import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import Text from "./components/Text";
import UserCard from "./components/UserCard";
import config from "./config";
import Main from "./layout/Main";
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
  const [loading, setLoading] = React.useState(true); // Initial state is true, indicating data is loading
  const [showErrorModal, setShowErrorModal] = React.useState(false);


  let navigate = useNavigate();

  const handleAdvisorClick = (index) => {
    setSelectedAdvisor(advisors[index]);
    setActiveIndex(index);
  };

  const handleContinue = () => {
    // Do something with the selected advisor
    if (selectedAdvisor) {
      navigate("/appointment", { state: selectedAdvisor });
      // Add your logic here to save the selected advisor
    } else {
      setShowErrorModal(true);
      // Handle the case when no advisor is selected
    }
  };
  const handleBack = () => {
    navigate("/dashboard");
    // Add your logic here to save the selected advisor
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
        const data = await response.json();
        setAdvisors(data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Disable loading state after fetching or if an error occurs
      }
    };

    fetchAdvisors();
  }, []);

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className="flex flex-col flex-auto bg-white rounded-xl ">
        <div class="flex-auto ml-6">
          <Text type="heading" classNames="mb-16 mt-10">
            Booking Appointment
          </Text>
          <Text type="sm-heading" classNames="mb-4">
            Choose an advisor
          </Text>
          <div class="grid grid-cols-3 grid-rows-2 gap-4  w-full">
            {loading ? (
              <div class="flex justify-center items-center col-span-3">
                {" "}
                {/* Ensuring the loader spans all columns */}
                <div className="loader"></div>{" "}
                {/* Assuming .loader is defined in your CSS */}
              </div>
            ) : (
              displayedAdvisors.map((advisor, index) => (
                <UserCard
                  key={index}
                  name={advisor.name}
                  majors={advisor.majors.join(", ")}
                  office={advisor.office}
                  image={advisor.profile_url}
                  active={index === activeIndex}
                  onClick={() => handleAdvisorClick(index)}
                />
              ))
            )}
          </div>
        </div>
        <div class="flex flex-row gap-8 max-w-md ml-6">
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
        <div class="flex flex-row gap-8 max-w-md ml-6">
          <Button text="Continue" onClick={handleContinue} />
          <Button text="Back" onClick={handleBack} type="secondary" />
        </div>
      </div>
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative">
            <div className="flex flex-row items-center gap-2 mb-4">
              <FaTimesCircle className="text-red-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Error
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl">
              Please select an advisor before continuing.
            </Text>
            <Button
              text="Close"
              onClick={() => setShowErrorModal(false)} // Close the modal
            />
          </div>
        </div>
      )}
    </Main>
  );
};

export default Appointment;
