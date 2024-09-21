import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Tag from "./components/Tag.jsx";
import Main from "./layout/Main.jsx";
import config from "./config.js";
import science from "./assets/science.svg";
import commerce from "./assets/commerce.svg";
import engineering from "./assets/engineering.svg";
import Text from "./components/Text";
import { FaCheckCircle } from "react-icons/fa";
import Button from "./components/Button.jsx";
import SuccessModal from "./components/successModal.jsx";

const StudentCourses = () => {
  const [courseSearch, setCourseSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddCourses, setShowAddCourses] = useState(false);
  const [userData, setUserData] = useState(null); // Changed to null to handle loading state
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        const data = await response.json();
        setUserData(data.data);
        localStorage.setItem("userData", JSON.stringify(data.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/smartAdvisor/progress`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        const progressData = await response.json();
        setProgress(progressData.data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, []);

  const handleAddCourses = async () => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/auth/signup/${localStorage.getItem("user_id")}/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({
            courses: [
              ...selectedCourses.map((course) => course.courseID),
              ...progress.completedCourses.map((course) => course.courseID),
            ],
          }),
        }
      );
      if (response.ok) {
        setShowAddCourses(false);
        setShowSuccessModal(true);
      } else {
        console.error("Failed to add courses");
      }
    } catch (error) {
      console.error("Error adding courses:", error);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const { student, unreadNotifications } = userData;

  return (
    <Main userType={"student"} activeMenuItem={"manageCourses"}>
      <div className="mb-10 max-h-36">
        <Header
          profile_url={student.profile_url}
          user={`${student.name} ${student.surname}`}
          info={student.majorOrProgramme}
          unreadCount={unreadNotifications}
        />
      </div>

      <div className="flex h-full w-full gap-8 p-8 bg-white shadow-xl rounded-2xl">
        {/* Left Half: Courses */}
        <div className="w-1/2">
          <Text type="heading" classNames="mb-8">
            My Courses
          </Text>

          <div className="flex flex-col gap-4 mb-6 lg:max-h-[460px] overflow-y-auto">
            {progress.completedCourses.map((course, index) => (
              <div
                key={index}
                className="w-full border rounded-2xl shadow-lg p-4 bg-white-200 text-black"
              >
                <div className="flex flex-row justify-between w-full transition-transform transform hover:scale-105">
                  <Text className="text-lg">{`${course.courseID}`}</Text>
                  <Text className="text-lg">{`${course.courseName}`}</Text>
                  <Text className="text-lg">{`${course.credits} credits`}</Text>
                </div>
              </div>
            ))}
          </div>
          <div className="w-48 transition-transform transform hover:scale-105">
            <Button text="Add Course" onClick={() => setShowAddCourses(true)} />
          </div>
        </div>

        {/* Right Half: Handbook Links */}
        <div className="w-1/2">
          <Text type="heading" classNames="mb-8">
            Handbooks
          </Text>

          {/* Icons for handbooks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Handbook 1 */}
            <div className="p-4 border-4 border-purple-500 rounded-lg relative transition-transform transform hover:scale-105">
              <div className="border-2 border-purple-500 rounded-lg p-6 bg-purple-100">
                <img
                  src={science}
                  alt="Science Handbook"
                  className="h-full w-16 mx-auto mb-4"
                />
                <a
                  href="https://www.uct.ac.za/sites/default/files/media/documents/uct_ac_za/49/SCI_Handbook_2024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Text className="text-center text-lg text-purple-700 font-bold hover:underline">
                      Science
                    </Text>
                  </div>
                </a>
              </div>
            </div>

            {/* Handbook 2 */}
            <div className="p-4 border-4 border-orange-500 rounded-lg relative transition-transform transform hover:scale-105">
              <div className="border-2 border-orange-500 rounded-lg p-6 bg-orange-100">
                <img
                  src={commerce}
                  alt="Commerce Handbook"
                  className="h-16 w-16 mx-auto mb-4"
                />
                <a
                  href="https://www.uct.ac.za/sites/default/files/media/documents/uct_ac_za/49/COM_UG_Handbook_2024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Text className="text-center text-orange-700 font-bold hover:underline">
                      Commerce
                    </Text>
                  </div>
                </a>
              </div>
            </div>

            {/* Handbook 3 */}
            <div className="p-4 border-4 border-blue-500 rounded-lg relative transition-transform transform hover:scale-105">
              <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-100">
                <img
                  src={engineering}
                  alt="Engineering Handbook"
                  className="h-16 w-16 mx-auto mb-4"
                />
                <a
                  href="https://www.uct.ac.za/sites/default/files/media/documents/uct_ac_za/49/EBE_UG_Handbook_2024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Text className="text-center text-blue-700 font-bold hover:underline w-full">
                      Engineering
                    </Text>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddCourses && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 relative">
            <Text
              type="paragraph-strong"
              onClick={() => setShowAddCourses(false)}
              classNames="absolute top-4 right-4 cursor-pointer text-3xl
        text-gray-600 hover:text-gray-900"
            >
              &times;
            </Text>
            <Text type="heading" classNames="mb-4">
              Add Course
            </Text>
            <Text classNames="mb-8">
              Select which course you have completed
            </Text>
            <CustomInput
              label="Course Name"
              placeholder="Enter Course Name"
              value={courseSearch}
              onValueChange={(value) => {
                setCourseSearch(value);
                setFilteredCourses(
                  progress.remainingCourses.filter((course) =>
                    course.courseID.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
            />
            <div>
              {courseSearch && filteredCourses.length >= 1 && (
                <div className="absolute z-20 bg-gray-200 overflow-y-auto rounded-2xl p-4 max-w-48 max-h-60">
                  {filteredCourses
                    .filter(
                      (course) =>
                        !selectedCourses.some(
                          (selectedCourse) =>
                            selectedCourse.courseID === course.courseID
                        )
                    )
                    .map((course, index) => (
                      <p
                        onClick={() => {
                          setSelectedCourses([...selectedCourses, course]);
                          setFilteredCourses([]);
                          setCourseSearch("");
                        }}
                        key={index}
                        className="cursor-pointer hover:bg-gray-300"
                      >
                        {course.courseID}
                      </p>
                    ))}
                </div>
              )}
            </div>
            {/* Display selected courses with individual removal logic */}
            {selectedCourses.length > 0 &&
              selectedCourses.map((selectedCourse, index) => (
                <div key={index} className="flex flex-row gap-4 my-4">
                  <Tag
                    text={selectedCourse.courseID}
                    onClick={() =>
                      // Filter out the clicked course from the selectedCourses array
                      setSelectedCourses(
                        selectedCourses.filter(
                          (course) =>
                            course.courseID !== selectedCourse.courseID
                        )
                      )
                    }
                  />
                </div>
              ))}

            {/* Add button, disabled if no course is selected */}
            <Button
              text="Add"
              onClick={() => {
                setShowAddCourses(false);
                handleAddCourses();
              }}
              disabled={selectedCourses.length === 0} // Disable if no course is selected
              className={`${
                selectedCourses.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`} // Add styles for disabled state
            />
          </div>
        </div>
      )}

      {/* Modal component usage */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Success"
        message="Courses added successfully"
        onClose={() => {
          setShowSuccessModal(false);
          window.location.reload(); // Optional reload after closing
        }}
      />
    </Main>
  );
};

export default StudentCourses;
