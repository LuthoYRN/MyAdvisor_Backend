import React from "react";
import { useEffect } from "react";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Main from "./layout/Main.jsx";
import TextArea from "./components/TextArea.jsx";
import config from "./config.js";
import Select from "./components/Select.jsx";
import { useLocation } from "react-router-dom";

const AdviceLog = () => {
  const [logType, setLogType] = React.useState("recording");
  const [filteredLogs, setFilteredLogs] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [content, setContent] = React.useState(null);
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // State to track loading status
  let location = useLocation();

  useEffect(() => {
    setContent(logs[activeIndex]?.text || logs[activeIndex]?.src);
  }, [activeIndex, logs]);

  const handleCardClick = (log, index) => {
    setActiveIndex(index);
    setLogType(log.type);
    setContent(log.text || log.src);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("userData"))?.advisor
          ?.advisor_level
          ? localStorage.getItem("user_id")
          : location.state.advisorID;
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${userId}/log`
        );
        const result = await response.json();
        if (result.status === "success") {
          const formattedLogs = result.data.map((log) => ({
            name: log.studentName,
            type: log.type === "Note" ? "Text" : "Recording",
            side: `${log.appointmentDate}, ${log.appointmentTime}`,
            text: log.logNotes,
            src: log.video?.filePathURL,
          }));
          setLogs(formattedLogs);
          setFilteredLogs(formattedLogs);
        } else {
          setFilteredLogs([]);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
        setFilteredLogs([]);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    setContent(null);
    setLogType(null);
  }, [filteredLogs]);

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData"))?.advisor?.advisor_level ||
        "FacultyAdmin"
      }
      activeMenuItem={"adviceLog"}
    >
      <div className="flex jus flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <div className="flex w-1/3 flex-col gap-4">
          <Text type="heading" classNames="mb-8">
            Advice Log
          </Text>
          <div className="items-center">
            <div className="flex gap-4 mb-4">
              <Select
                onChange={(value) => {
                  const selectedMonth = value;
                  const filteredLogs = logs.filter((log) => {
                    const logDate = new Date(log.side.split(",")[0]);
                    return logDate.getMonth() + 1 === parseInt(selectedMonth);
                  });
                  setFilteredLogs(filteredLogs);
                  setContent(null);
                }}
                options={[
                  { value: "", label: "Select Month" },
                  ...[...Array(12).keys()].map((month) => ({
                    value: month + 1,
                    label: new Date(0, month).toLocaleString("default", {
                      month: "long",
                    }),
                  })),
                ]}
              />
              <Select
                onChange={(value) => {
                  const selectedYear = value;
                  const filteredLogs = logs.filter((log) => {
                    const logDate = new Date(log.side.split(",")[0]);
                    return logDate.getFullYear() === parseInt(selectedYear);
                  });
                  setFilteredLogs(filteredLogs);
                  setContent(null);
                }}
                options={[
                  { value: "", label: "Select Year" },
                  ...[
                    ...new Set(
                      logs.map((log) =>
                        new Date(log.side.split(",")[0]).getFullYear()
                      )
                    ),
                  ].map((year) => ({
                    value: year,
                    label: year,
                  })),
                ]}
              />
            </div>
            <div className="items-center max-h-[644px] px-2 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center">
                  <div className="loader"></div>{" "}
                </div>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <Card
                    key={index}
                    heading={log.name}
                    info={log.type}
                    side={log.side}
                    classNames="mb-6"
                    active={index === activeIndex}
                    status={"Approval"}
                    onClick={() => handleCardClick(log, index)}
                  />
                ))
              ) : (
                <Text type="paragraph" classNames="text-gray-500">
                  No logs available.
                </Text>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-2/3 border-l border-gray-200">
          <div className="flex flex-col flex-auto  gap-8 col-span-2 p-8 m-8 ">
            {logType === "Text" ? (
              <TextArea disabled={true} text={content} />
            ) : logType === "Recording" && content && content.trim() !== "" ? (
              <video controls={true} autoPlay={true} src={content} />
            ) : null}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AdviceLog;
