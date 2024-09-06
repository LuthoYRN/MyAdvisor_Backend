import React from "react";

const VideoPlayer = ({source}) => {
  return (
    <div>
      <video width="1020" height="600" controls>
        <source src={source} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
