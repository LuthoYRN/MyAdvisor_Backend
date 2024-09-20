import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./App.css";
import image from "./assets/advisor.png";
import search from "./assets/search.svg";
import Button from "./components/Button";
import CustomInput from "./components/CustomInput";
import Tag from "./components/Tag";
import Text from "./components/Text";
import config from "./config";
import Container from "./layout/Container";

function CourseSelection() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/auth/signup/${localStorage.getItem("user_id")}/courses`
        );
        const data = await response.json();
        if (data.status === "success") {
          setCourses(data.courses);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleRegister = () => {
    const payload = {
      courses: selectedCourses,
    };

    fetch(
      `${config.backendUrl}/api/auth/signup/${localStorage.getItem("user_id")}/courses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setShowConfirmationModal(true);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error registering courses:", error);
      });
  };

  const handleSearchCourse = (searchText) => {
    setCourse(searchText);
    // Filter the prerequisites list based on the search text
    setFilteredCourses(
      courses
        .filter((course) =>
          course.toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((course) => !selectedCourses.includes(course))
    );
  };

  const handleAddCourse = (course) => {
    setSelectedCourses([...selectedCourses, course]);
    setCourse("");
  };

  const handleRemoveCourse = (course) => {
    setSelectedCourses(selectedCourses.filter((item) => item !== course));
  };

  return (
    <div className="App">
      <Container>
        <form class="col-span-4 flex flex-col h-full justify-center my-auto">
          <Text type={"heading"}>Course Information</Text>
          <Text classNames="mb-8" type={"subheading"}>
            Select the courses you completed
          </Text>
          <CustomInput
            label="Completed Courses"
            placeholder="Enter your completed courses"
            icon={search}
            onValueChange={handleSearchCourse}
            value={course}
            onMouseEnter={() => {
              if (course === "") {
                setFilteredCourses(courses.filter((course) => !selectedCourses.includes(course)));
              }
            }}
            onMouseLeave={() => {
              if (course === "") {
                setFilteredCourses([]);
              }
            }
            }
          />
          <div>
            {filteredCourses.length >= 1 && (
              <div class="absolute bg-gray-400 rounded-2xl p-4 max-w-80">
                {filteredCourses.map((course) => (
                  <Text
                    onClick={() => {
                      handleAddCourse(course);
                      setFilteredCourses(
                        filteredCourses.filter((item) => item !== course)
                      );
                    }}
                  >
                    {course}
                  </Text>
                ))}
              </div>
            )}
          </div>
          <div class="flex flex-row flex-wrap gap-4 ">
            {selectedCourses.map((course) => (
              <Tag
                text={course}
                onClick={() => handleRemoveCourse(course)}
              />
            ))}
          </div>

          <Button text={"Register"} onClick={handleRegister} />
        </form>
        <img
          class="col-span-8 col-start-7 my-auto"
          src={image}
          alt="advisor"
        />
        {showConfirmationModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="flex flex-row items-center gap-2 mb-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
                <Text type="sm-heading" classNames="text-center">
                  Success
                </Text>
              </div>

              <Text type="sm-subheading" classNames="mb-8 text-xl">
                Course Registration Successful
              </Text>
              <Button text="Close" onClick={() => navigate("/dashboard")} />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default CourseSelection;
