import React from "react";
import { useEffect } from "react";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Main from "./layout/Main.jsx";
import TextArea from "./components/TextArea.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";


/*
    Data Needed:
    - List of Advice Logs
    - Advice Log Details
  */

const AdviceLog = () => {
  const [logType, setLogType] = React.useState("recording");
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [content, setContent] = React.useState(null);

  const logs = React.useMemo(() => [{
    name: "Melissa Densmore",
    type: "Text",
    side: "12:00 PM",
    text: "lorem ipsum"
  },
  {
    name: "Melissa Densmore",
    type: "Recording",
    side: "12:00 PM",
    src: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    name: "Melissa Densmore",
    type: "Recording",
    side: "12:00 PM",
    src: "https://www.w3schools.com/html/mov_bbb.mp4"
  }], []);

  useEffect(() => {
    setContent(logs[activeIndex]?.text || logs[activeIndex]?.src);
  }, [activeIndex, logs]);


  const handleCardClick = (log, index) => {
    setActiveIndex(index);
    setLogType(log.info);
   
  };

  return (
    <Main>
      <div class="flex jus flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <div class="flex w-1/3 flex-col gap-4">
          <Text type="heading" classNames="mb-8">
            Advice Log
          </Text>
          <div class="items-center">
            {logs.map((log, index) => (
              <Card
                key={index}
                heading={log.name}
                info={log.type}
                side={log.side}
                classNames="mb-6"
                active={index === activeIndex}
                onClick={() => handleCardClick(log, index)}
                {...console.log(index)}
              />
            ))}
            
          </div>
        </div>
        <div class="flex w-2/3 border-l border-gray-200">
          <div class="flex flex-col flex-auto  gap-8 col-span-2 p-8 m-8 ">
            {logType === "Text" ? (
              <TextArea disabled={true} text={content} />
            ) : logType === "Recording" ? (
              <VideoPlayer src={content} />
            ) : null}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AdviceLog;
