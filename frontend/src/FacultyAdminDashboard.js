import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import UCT_Background from "./assets/UCT_Background.jpg";

const FacultyAdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

 

  useEffect(() => {
    
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
          profile_url={userData?.advisor?.profile_url}
          user={`${userData?.advisor?.name}`}
          info={userData?.advisor?.office}
          unreadCount={userData?.unreadAppointmentRequests}
          user_type="advisor"
        />
      </div>
      <div className="flex flex-auto justify-center items-center bg-white rounded-2xl shadow-xl">
        <img src={UCT_Background} alt="UCT Background" className="rounded-2xl w-4/6" />
      </div>
    </Main>
  );
};

export default FacultyAdminDashboard;
