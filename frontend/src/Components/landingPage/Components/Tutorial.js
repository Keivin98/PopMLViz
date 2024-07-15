import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import { FaCirclePlay } from "react-icons/fa6";
import AppNav from "./AppNav";
import colors from "../../../config/colors";
import "./Tutorial.css";
import { duration } from "@mui/material";

export default function Tutorial() {
  const videosLinks = [
    { id: 1, name: "#1 Home Page", link: "https://youtu.be/KeVqxYkO4nY", duration: "28s" },
    { id: 2, name: "#2 Using and Uploading Data", link: "https://youtu.be/K84Vvw-rNyk", duration: "1m 40s" },
    { id: 3, name: "#3 Save data, and upload Saved Data", link: "https://youtu.be/uaB6nU_-7ng", duration: "1m 04s" },
    { id: 4, name: "#4 Customize and Download Data", link: "https://youtu.be/ZjzFeMEMOi0", duration: "1m 00s" },
  ];
  const [selectedVideo, setSelectedVideo] = useState(videosLinks[0]);
  const handlePress = (link) => {
    setSelectedVideo(link);
  };
  const videoCard = (name, link, index, duration, e) => {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
            // backgroundColor: selectedVideo == link ? colors.secondary : "white",
            padding: 10,
            borderRadius: 10,
          }}
          className="video-button"
          onClick={() => handlePress(e)}
          key={index}
        >
          <FaCirclePlay color={ selectedVideo.id == e.id ? colors.secondary : 'black'} size={20} />
          <div style={{ marginLeft: 20, fontSize: 13, fontWeight: 500, color: selectedVideo.id == e.id ? colors.secondary : 'gray', width: "70%" }}>{name}</div>
          <div style={{ textAlign: 'right', marginLeft: 10, fontSize: 13, fontWeight: 300, color: 'gray', right: 0, width: "20%", flexWrap: 'nowrap'}}>{duration}</div>
        </div>
        <hr></hr>
      </>
    );
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AppNav></AppNav>
      <div
        className="tutorial-container"
        style={{  gap: 20, padding: 20, paddingTop: 80, }}
      >
        <div className="video-player" style={{ width: "100%", marginTop: 40}}>
          <ReactPlayer width={"100%"} height={"100%"} controls url={selectedVideo.link}></ReactPlayer>
            <h4 className="video-title" style={{marginTop: 30, marginLeft: 10}}>{selectedVideo.name}</h4>
        </div>
        <div className="videoList" style={{padding: 20, height: "100%", marginTop: 40 }}>
          {videosLinks.map((e) => {
            return videoCard(e.name, e.link, e.id, e.duration, e);
          })}
        </div>
      </div>
    </div>
  );
}
