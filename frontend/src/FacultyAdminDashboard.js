import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import UCT_Background from "./assets/UCT_Background.jpg";
import config from "./config.js";

const FacultyAdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

 

  useEffect(() => {
    setLoading(true);
    fetch(`${config.backendUrl}/api/facultyAdmin/${localStorage.getItem("user_id")}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUserData(data.data);
          localStorage.setItem("userData", JSON.stringify(data.data));
        } else {
          console.error("Failed to fetch data");
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
      setLoading(false);
  }, []);

  if (loading) {
    return (
      <Main userType="Loading..." activeMenuItem="home">
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }

  return (
    <Main userType={"FacultyAdmin"} activeMenuItem="home">
      <div className="mb-10 max-h-36">
        <Header
          profile_url={userData?.profile_url}
          user={`${userData?.name}`}
          info={`${userData?.facultyName} Faculty`}
          user_type="FacultyAdmin"
        />
      </div>
      <div className="flex flex-auto justify-center items-center bg-white rounded-2xl shadow-xl">
        <img src={UCT_Background} alt="UCT Background" className="rounded-2xl w-4/6" />
      </div>
    </Main>
  );
};

export default FacultyAdminDashboard;
