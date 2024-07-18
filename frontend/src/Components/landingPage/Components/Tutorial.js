import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import { FaCirclePlay } from "react-icons/fa6";
import AppNav from "./AppNav";
import colors from "../../../config/colors";
import "./Tutorial.css";
import Loader from "react-loader-spinner";
import { duration } from "@mui/material";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";

export default function Tutorial() {
  const videosLinks = [
    {
      id: 1,
      name: "#1 Home Page",
      link: "https://youtu.be/KeVqxYkO4nY",
      duration: "28s",
      description:
        "Welcome to the first tutorial in our PopMLVis series! In this video, we introduce you to the PopMLVis home page and its key features. Learn the benefits of logging in, such as saving your data and accessing personalized settings. We also highlight our GitHub documentation and FAQ section for additional support.",
    },
    {
      id: 2,
      name: "#2 Using and Uploading Data",
      link: "https://youtu.be/K84Vvw-rNyk",
      duration: "1m 40s",
      description: `In this tutorial, we guide you through the process of visualizing data with PopMLVis. We cover two sections:<br>1- Example Data: Follow four simple steps to visualize example data: input the data, specify plot dimensions (2D or 3D), select principal components, apply a clustering algorithm, and detect outliers.<br>2- Importing Your Own Data: Learn how to import your data, specify plot dimensions, choose principal components, and apply clustering and outlier detection for a customized visualization experience.`,
    },
    {
      id: 3,
      name: "#3 Save data, and upload Saved Data",
      link: "https://youtu.be/uaB6nU_-7ng",
      duration: "1m 04s",
      description:
        "In this tutorial, we show you how to save your data in PopMLVis and reload it for future sessions. Learn the steps to save your current plotted data, restart the tool, and load your saved data. We demonstrate how to preview and apply your saved data to maintain friendly user experience across sessions.",
    },
    {
      id: 4,
      name: "#4 Customize and Download Data",
      link: "https://youtu.be/ZjzFeMEMOi0",
      duration: "1m 00s",
      description:
        "Explore the customization options available in PopMLVis in this tutorial. Learn how to personalize your data visualizations by changing the appearance of data points with specific shapes and colors. Discover the various export options to save your plots as PNG, JPEG, and more, or download your customized datasets for further analysis.",
    },
  ];
  const [selectedVideo, setSelectedVideo] = useState(videosLinks[0]);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const handlePress = (link) => {
    setSelectedVideo(link);
  };
  console.log(selectedVideo);
  const videoCard = (name, link, index, duration, e) => {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
            cursor: "pointer",
            // backgroundColor: selectedVideo == link ? colors.secondary : "white",
            padding: 10,
            borderRadius: 10,
          }}
          className="video-button"
          onClick={() => handlePress(e)}
          key={index}
        >
          <FaCirclePlay color={selectedVideo.id == e.id ? colors.secondary : "black"} size={20} />
          <div
            style={{
              marginLeft: 20,
              fontSize: 13,
              fontWeight: 500,
              color: selectedVideo.id == e.id ? colors.secondary : "gray",
              width: "70%",
            }}
          >
            {name}
          </div>
          <div
            style={{
              textAlign: "right",
              marginLeft: 10,
              fontSize: 13,
              fontWeight: 300,
              color: "gray",
              right: 0,
              width: "20%",
              flexWrap: "nowrap",
            }}
          >
            {duration}
          </div>
        </div>
        <hr></hr>
      </>
    );
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AppNav></AppNav>
      <div className="tutorial-container" style={{ gap: 20, padding: 20, paddingTop: 80 }}>
        <div className="video-player" style={{ width: "100%", marginTop: 40 }}>
          <ReactPlayer width={"100%"} height={"100%"} controls url={selectedVideo.link} onReady={()=> setLoader(false)}></ReactPlayer>
          {loader && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
            <Loader  type="TailSpin" color={colors.secondary} height="100" width="100" />
          </div>}
         

          <div style={{ overflowY: "auto", height: "30%" }}>
            <h4 className="player-text" style={{ marginTop: 30, marginLeft: 10 }}>
              Tutorial: {selectedVideo.name}
            </h4>
            <div
              className="player-text"
              style={{ marginTop: 10, marginLeft: 10 }}
              dangerouslySetInnerHTML={{
                __html: `<span style="font-weight: 600">Description:<br></span> ${selectedVideo.description}`,
              }}
            />
          </div>
        </div>
        <div className="videoList" style={{ padding: 20, height: "100%" }}>
          <div className="collapse-player-text">
            <div
              style={{
                // justifyContent: "space-between",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                marginBottom: 10,
              }}
              onClick={() => setOpen(!open)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  //   width: "90%",
                  alignItems: "center",
                }}
              >
                {/* <IoIosColorPalette size={30} style={{ marginRight: 20, opacity: 0.5 }} /> */}
                <h6 style={{ marginBottom: 0 }}>{"More"}</h6>
              </div>

              <AiFillCaretDown style={{ marginLeft: 20 }} />
            </div>

            <Collapse style={{ marginBottom: 20 }} in={open}>
              <div>
                <h4 style={{ marginTop: 30, marginLeft: 10 }}>Tutorial: {selectedVideo.name}</h4>
                <div
                  style={{ marginTop: 10, marginLeft: 10 }}
                  dangerouslySetInnerHTML={{
                    __html: `<span style="font-weight: 600">Description:<br></span> ${selectedVideo.description}`,
                  }}
                />
                <hr></hr>
              </div>
            </Collapse>
          </div>
          {videosLinks.map((e) => {
            return videoCard(e.name, e.link, e.id, e.duration, e);
          })}
        </div>
      </div>
    </div>
  );
}
