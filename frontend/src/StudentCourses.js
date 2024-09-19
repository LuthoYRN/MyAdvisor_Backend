import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import CustomInput from "./components/CustomInput.jsx";
import Tag from "./components/Tag.jsx";
import Main from "./layout/Main.jsx";
import config from "./config.js";
import Text from "./components/Text";
import Button from "./components/Button.jsx";

const StudentCourses = () => {
  const [courseSearch, setCourseSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const allCourses = [
    { id: "CSE 101", name: "Introduction to Computer Science" },
    { id: "CSE 102", name: "Introduction to Programming" },
    { id: "CSE 103", name: "Discrete Mathematics" },
    { id: "CSE 104", name: "Introduction to Data Structures" },
    { id: "CSE 105", name: "Introduction to Algorithms" },
  ];
  const [showAddCourses, setShowAddCourses] = useState(false);
  const [userData, setUserData] = useState(null); // Changed to null to handle loading state

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

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const { student, unreadNotifications } = userData;

  const courses = [
    {
      courseCode: "CSE 101",
      courseName: "Introduction to Computer Science",
      courseType: "Core",
      courseCredits: 3,
    },
    {
      courseCode: "CSE 102",
      courseName: "Introduction to Programming",
      courseType: "Core",
      courseCredits: 3,
    },
    {
      courseCode: "CSE 103",
      courseName: "Discrete Mathematics",
      courseType: "Core",
      courseCredits: 3,
    },
    {
      courseCode: "CSE 104",
      courseName: "Introduction to Data Structures",
      courseType: "Core",
      courseCredits: 3,
    },
    {
      courseCode: "CSE 105",
      courseName: "Introduction to Algorithms",
      courseType: "Core",
      courseCredits: 3,
    },
  ];

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
        <div className="flex flex-col gap-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className="flex flex-row justify-between items-center p-4 bg-gray-100 rounded-xl"
            >
              <Text>{course.courseCode}</Text>
              <Text>{course.courseName}</Text>
              <Text>{course.courseType}</Text>
              <Text>{course.courseCredits}</Text>
            </div>
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
                    allCourses.filter((course) =>
                      course.id.toLowerCase().includes(value.toLowerCase())
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
                          setSelectedCourses([course]);
                          setFilteredCourses([]);
                          setCourseSearch("");
                        }}
                        key={index}
                      >
                        {course.id}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {selectedCourses.length > 0 && (
                <div class="flex flex-row gap-4 my-4">
                  <Tag
                    text={selectedCourses[0].id}
                    onClick={() => setSelectedCourses([])}
                  />
                </div>
              )}
              <Button text="Add" onClick={() => setShowAddCourses(false)} />
            </div>
          </div>
        </>
      )}
    </Main>
  );
};

export default StudentCourses;
