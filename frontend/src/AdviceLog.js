import React from "react";
import { useEffect } from "react";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Main from "./layout/Main.jsx";
import TextArea from "./components/TextArea.jsx";
import config from "./config.js";
import Select from "./components/Select.jsx";

const AdviceLog = () => {
  const [logType, setLogType] = React.useState("recording");
  const [filteredLogs, setFilteredLogs] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [content, setContent] = React.useState(null);
  const [logs, setLogs] = React.useState([]);

  useEffect(() => {
    setContent(logs[activeIndex]?.text || logs[activeIndex]?.src);
  }, [activeIndex, logs]);

  const handleCardClick = (log, index) => {
    setActiveIndex(index);
    setLogType(log.type);
    setContent(log.text || log.src);
    console.log(logType);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/log`
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
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <Main userType={"seniorAdvisor"} activeMenuItem={"adviceLog"}>
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
            {filteredLogs.map((log, index) => (
              <Card
                key={index}
                heading={log.name}
                info={log.type}
                side={log.side}
                classNames="mb-6"
                active={index === activeIndex}
                onClick={() => handleCardClick(log, index)}
              />
            ))}
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
