import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import Text from "./components/Text";
import UserCard from "./components/UserCard";
import config from "./config";
import Main from "./layout/Main";

const Appointment = () => {
  const [advisors, setAdvisors] = React.useState([]);
  const [selectedAdvisorId, setSelectedAdvisorId] = React.useState(null); // Track advisor by unique id
  const [loading, setLoading] = React.useState(true);
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  let navigate = useNavigate();

  const handleAdvisorClick = (id) => {
    setSelectedAdvisorId(id); // Track selected advisor by unique id
  };

  const handleContinue = () => {
    const selectedAdvisor = advisors.find(
      (advisor) => advisor.uuid === selectedAdvisorId
    );
    if (selectedAdvisor) {
      navigate("/appointment", { state: selectedAdvisor });
    } else {
      setShowErrorModal(true); // Show error modal if no advisor is selected
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const [page, setPage] = React.useState(1);
  const advisorsPerPage = 6;
  const totalPages = Math.ceil(advisors.length / advisorsPerPage);
  const startIndex = (page - 1) * advisorsPerPage;
  const endIndex = startIndex + advisorsPerPage;
  const displayedAdvisors = advisors.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
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
        console.error("Error fetching advisors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className="flex flex-col flex-auto bg-white rounded-xl ">
        <div className="flex-auto ml-6">
          <Text type="heading" classNames="mb-16 mt-10">
            Booking Appointment
          </Text>
          <Text type="sm-heading" classNames="mb-4">
            Choose an advisor
          </Text>
          <div className="grid grid-cols-3 grid-rows-2 gap-4  w-full">
            {loading ? (
              <div className="flex justify-center items-center col-span-3">
                <div className="loader"></div>
              </div>
            ) : (
              displayedAdvisors.map((advisor) => (
                <UserCard
                  key={advisor.uuid} // Use unique id for each advisor
                  name={advisor.name}
                  majors={advisor.majors.join(", ")}
                  office={advisor.office}
                  image={advisor.profile_url}
                  active={advisor.uuid === selectedAdvisorId} // Highlight selected advisor
                  onClick={() => handleAdvisorClick(advisor.uuid)} // Pass unique id to click handler
                />
              ))
            )}
          </div>
        </div>
        <div className="flex flex-row gap-8 max-w-md ml-6">
          <Button
            text="Previous"
            onClick={handlePreviousPage}
            disabled={page === 1}
            type={page === 1 ? "secondary" : "primary"}
          />
          <Button
            text="Next"
            onClick={handleNextPage}
            disabled={page === totalPages}
            type={page === totalPages ? "secondary" : "primary"}
          />
        </div>
        <div className="flex flex-row gap-8 max-w-md ml-6">
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
