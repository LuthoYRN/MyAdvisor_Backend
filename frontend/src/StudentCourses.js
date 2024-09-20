import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Tag from "./components/Tag.jsx";
import Main from "./layout/Main.jsx";
import config from "./config.js";
import Text from "./components/Text";
import Button from "./components/Button.jsx";
import ConfirmationModal from "./components/ConfirmationModal.jsx";

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
        console.log("Progress Data:", progressData);
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
        console.log("Courses added successfully");
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

      {/* Upcoming Appointments */}
      <div className="flex flex-auto w-full flex-col p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-8">
          My Courses
        </Text>
        <div className="flex flex-row max-w-lg flex-wrap gap-4">
          {progress.completedCourses.map((course, index) => (
            <Text>{course.courseID}</Text>
          ))}
        </div>
        <div class="w-48">
          <Button text="Add Course" onClick={() => setShowAddCourses(true)} />
        </div>
      </div>
      {showAddCourses && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-8">
              <Text type="sm-heading" classNames="mb-4">
                Add Course
              </Text>
              <Text type="sm-subheading" classNames="mb-8">
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
                      course.courseID
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    )
                  );
                }}
              />
              <div>
                {courseSearch && filteredCourses.length >= 1 && (
                  <div class="absolute z-20 bg-gray-200 overflow-y-auto rounded-2xl p-4 max-w-48 max-h-60">
                    {filteredCourses.map((course, index) => (
                      <p
                        onClick={() => {
                          setSelectedCourses([...selectedCourses, course]);
                          setFilteredCourses([]);
                          setCourseSearch("");
                        }}
                        key={index}
                      >
                        {course.courseID}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {selectedCourses.length > 0 &&
                selectedCourses.map((selectedCourse, index) => (
                  <div key={index} className="flex flex-row gap-4 my-4">
                    <Tag
                      text={selectedCourse.courseID}
                      onClick={() => setSelectedCourses([])}
                    />
                  </div>
                ))}
              <Button
                text="Add"
                onClick={() => {
                  setShowAddCourses(false);
                  handleAddCourses();
                }}
              />
            </div>
          </div>
        </>
      )}
      {showSuccessModal && (
        <ConfirmationModal
          status="Success"
          message="Courses added successfully"
          close={() => {
            setShowSuccessModal(false);
            window.location.reload();
          }}
        />
      )}
    </Main>
  );
};

export default StudentCourses;
