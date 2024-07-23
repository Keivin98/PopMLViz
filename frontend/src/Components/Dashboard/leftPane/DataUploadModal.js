import React, {useEffect, useState, useRef} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {green} from "@mui/material/colors";
import {styled} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";
import font from "../../../config/font";
import BackButton from "../../BackButton";
import axios from "axios";
import fetchSavedData from "./fetchSavedData";
import Loader from "react-loader-spinner";
import colors from "../../../config/colors";
import fetchSpecificPlot from "./fetchSpecificPlot";
import {FaTrash} from "react-icons/fa6";
import {checkAccessTokenValidity, api, refreshAccessToken} from "../../../config/tokenValidityChecker";
import AppButton from "../../AppButton";
import {MdOutlineMoreHoriz} from "react-icons/md";
import selectClusterActions from "../../../config/selectClusterActions";
import selectOutlierActions from "../../../config/selectOutlierActions";
import ErrorMessage from "../../ErrorMessage";
import SuccessMessage from "../../SuccessMessage";
import "./leftpane.css";

const Input = styled("input")({
  display: "none",
});

const useStyles = makeStyles({
  customButton: {
    color: "white !important",
    borderColor: "white !important",
    borderWidth: 1,
    textTransform: "none !important",
    width: 150,
    // marginLeft: "20px !important",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.5) !important",
    },
  },
});

// const useStyles = makeStyles({
//     customButton: {
//       backgroundColor: "#1abc9c !important",
//       color: "white !important",
//       borderColor: "white !important",
//       borderWidth: 1,
//       textTransform: "none !important",
//       width: 150,
//       // marginLeft: "20px !important",

//       "&:hover": {
//         backgroundColor: "rgb(245, 246, 247) !important",
//         color: "#1abc9c !important",
//         borderColor: "#1abc9c !important",

//       },
//     },
//   });

function DataUploadModal({
  handleClose,
  samplePCAAdmixDataset,
  processedPCA,
  processedAdmix,
  unprocessedPCA,
  tsne2d,
  tsne3d,
  runUMAP2D,
  runUMAP3D,
  runPCAir,
  setProgressBarType,
  fileChanged,
  resetSaveState,
  setFileChanged,
  modalOpen,
  setModalOpen,
  processData,
  setIsMainPageLoading,
  selectedColumns,
}) {
  const defaultFile = {
    PCA: {processed: null, unprocessed: null},
    Admix: null,
    ".bed": null,
    ".bim": null,
    ".fam": null,
    Kinship: null,
  };
  const classes = useStyles();
  const [dataSelectionStep, setDataSelectionStep] = useState("initial");
  const [dataProcessed, setDataProcessed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [files, setFiles] = useState(defaultFile);
  const [savedPlots, setSavedPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false); //this is for the saved modal only
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [savedData, setSavedData] = useState([]);

  // State to keep track of drag over for each type
  const [dragOver, setDragOver] = useState({
    PCA: {processed: false, unprocessed: false},
    Admix: false,
    ".bed": false,
    ".bim": false,
    ".fam": false,
    Kinship: false,
  });

  useEffect(() => {
    fileInputRefs.current = {
      PCA: React.createRef(),
      Admix: React.createRef(),
      ".bed": React.createRef(),
      ".bim": React.createRef(),
      ".fam": React.createRef(),
      Kinship: React.createRef(),
    };
  }, []);

  const refs = {
    PCA: {processed: useRef(null), unprocessed: useRef(null)},
    Admix: useRef(null),
    ".bed": useRef(null),
    ".bim": useRef(null),
    ".fam": useRef(null),
    Kinship: useRef(null),
  };
  const fileInputRefs = useRef({});

  function StyledText({label, value, range}) {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 5,
            marginTop: 5,
          }}>
          <div style={{marginRight: 10}}>{label}: </div>
          {range ? (
            <div style={{textAlign: "right"}}>{value ? `Between ${value[0]} and ${value[1]}` : "Not applied"}</div>
          ) : (
            <div style={{textAlign: "right"}}>{value ? value : "Not applied"}</div>
          )}
        </div>
        <hr></hr>
      </>
    );
  }

  const resetUploads = () => {
    setFiles({
      PCA: {processed: null, unprocessed: null},
      Admix: null,
      ".bed": null,
      ".bim": null,
      ".fam": null,
      Kinship: null,
    });

    // State to keep track of drag over for each type
    setDragOver({
      PCA: {processed: false, unprocessed: false},
      Admix: false,
      ".bed": false,
      ".bim": false,
      ".fam": false,
      Kinship: false,
    });
  };

  const sampleDatasets = ["1000 Genomes Project (1KG)", "Human Genome Diversity Project (HGDP)"];

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    let newDragOverState = {...dragOver};

    if (type === "PCA") {
      if (dataProcessed) {
        newDragOverState[type]["processed"] = false;
      } else {
        newDragOverState[type]["unprocessed"] = false;
      }
    } else {
      newDragOverState[type] = false;
    }

    setDragOver(newDragOverState);
  };

  const handleFileUpload = (e, type, drop) => {
    e.preventDefault();
    e.stopPropagation();

    const uploadedFiles = drop ? e.dataTransfer.files[0] : e.target.files[0];

    let newFilesState = {...files};
    let newDragOverState = {...dragOver};

    if (uploadedFiles) {
      if (type === "PCA") {
        if (dataProcessed) {
          newFilesState[type]["processed"] = uploadedFiles;
          newDragOverState[type]["processed"] = false;
        } else {
          newFilesState[type]["unprocessed"] = uploadedFiles;
          newDragOverState[type]["unprocessed"] = false;
        }
      } else {
        newFilesState[type] = uploadedFiles;
        newDragOverState[type] = false;
      }
    }

    setFiles(newFilesState);
    setDragOver(newDragOverState);
  };
  const handleDelete = async (title) => {
    const isValid = await checkAccessTokenValidity();
    let headers = {};
    if (!isValid) {
      const newAccessToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${newAccessToken}`;
    }

    try {
      const response = await api.post(
        "/api/deletePlot",
        {title: title},
        {
          headers: {
            ...headers,
          },
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        console.log(response.data);
        fetchSavedData({setSavedPlots, setIsLoading, selectedColumns});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      throw error;
    }
  };
  const handleOpen = () => {
    setDataSelectionStep("initial");
    setDataProcessed(false);
    setSelectedOption("");
    setModalOpen(true);
  };

  const handleDataSelection = (selection) => {
    if (selection === "own") {
      setDataSelectionStep("ownData");
    } else if (selection === "example") {
      setDataSelectionStep("exampleData");
    } else if (selection === "saved") {
      fetchSavedData({setDataSelectionStep, setSavedPlots, setIsLoading, selectedColumns});
      setDataSelectionStep("saved");
      console.log(savedPlots);
    }
  };

  const handleProcessingSelection = (processed) => {
    setDataProcessed(processed);
    setDataSelectionStep("final");
  };

  const handleBack = () => {
    setSelectedOption("");
    resetUploads();
    if (dataSelectionStep === "final") {
      setDataSelectionStep("ownData");
    } else {
      setDataSelectionStep("initial");
    }
  };

  const handleOptionSelection = (option) => {
    setSelectedOption(option);
  };
  const handleFileChange = (e) => {
    // Handle the file selected via input
    // e.target.files contains the selected file(s)
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();

    let newDragOverState = {...dragOver};

    if (type === "PCA") {
      if (dataProcessed) {
        newDragOverState[type]["processed"] = true;
      } else {
        newDragOverState[type]["unprocessed"] = true;
      }
    } else {
      newDragOverState[type] = true;
    }

    setDragOver(newDragOverState);
  };

  const handlePCAirFiles = async () => {
    if (!files[".bed"] || !files[".bim"] || !files[".fam"]) {
      ErrorMessage("Please upload all the necessary files for PC-AiR!");
      return;
    }
    let newFilenames = {};
    // setProgressBarType("ProgressBar");
    // setIsMainPageLoading(true);
    handleClose();
    const uploadTasks = [".bed", ".bim", ".fam", "Kinship"].map(async (filename) => {
      const data = new FormData();
      data.append("file", files[filename]);
      data.append("filename", files[filename].name);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadPCAIR`,
          {
            method: "POST",
            body: data,
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();
        newFilenames[filename] = responseData.filename;
        console.log(filename, responseData.filename);

        return responseData;
      } catch (error) {
        console.error("Upload failed for " + filename, error);
        ErrorMessage("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
        throw error; // Propagate the error to be caught in Promise.all
      }
    });

    Promise.all(uploadTasks)
      .then(() => {
        // handleClose();
        resetSaveState();
        runPCAir(newFilenames[".bed"], newFilenames[".bim"], newFilenames[".fam"], newFilenames["Kinship"]);
        SuccessMessage("Data uploaded successfully!");
        setIsMainPageLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred during the upload: ", error);
      });
  };

  const renderDragDropArea = (type) => {
    let toDisplay = "";
    let displayBackgroundColor = "white";
    if (type == "PCA") {
      if (dataProcessed) {
        if (files.PCA.processed) {
          toDisplay = files.PCA.processed.name;
        } else {
          toDisplay = "Drag and drop files here, or click to select files";
        }
      } else {
        if (files.PCA.unprocessed) {
          toDisplay = files.PCA.unprocessed.name;
        } else {
          toDisplay = "Drag and drop files here, or click to select files";
        }
      }
    } else {
      toDisplay = files[type] ? files[type].name : "Drag and drop files here, or click to select files";
    }

    if (type == "PCA") {
      if (dataProcessed) {
        if (dragOver.PCA.processed) {
          displayBackgroundColor = "#e0e0e0";
        } else {
          displayBackgroundColor = "white";
        }
      } else {
        if (dragOver.PCA.unprocessed) {
          displayBackgroundColor = "#e0e0e0";
        } else {
          displayBackgroundColor = "white";
        }
      }
    } else {
      displayBackgroundColor = files[type] ? "#e0e0e0" : "white";
    }

    const handleAreaClick = (e, type) => {
      // Trigger the hidden file input click
      fileInputRefs.current[type].current.click();
      // handleDrop(e, type);
    };

    const fileInputElement = (
      <Input
        ref={fileInputRefs.current[type]}
        id={type}
        type="file"
        onChange={(e) => handleFileUpload(e, type, false)}
        multiple={false}
      />
    );

    const dragDropStyle = {
      border: "2px dashed gray",
      padding: "20px",
      textAlign: "center",
      backgroundColor: displayBackgroundColor,
    };

    return (
      <div
        style={dragDropStyle}
        onDragOver={(e) => handleDragOver(e, type)}
        onClick={(e) => handleAreaClick(e, type)}
        onDragLeave={(e) => handleDragLeave(e, type)}
        onDrop={(e) => handleFileUpload(e, type, true)}>
        {toDisplay}
        {fileInputElement}
      </div>
    );
  };
  const renderFileUpload = () => {
    switch (selectedOption) {
      case "Example: PCA":
        return (
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {sampleDatasets.map((val, index) => {
              return (
                <Button
                  variant="contained"
                  style={{width: "60%", margin: "auto", color: "white", backgroundColor: colors.secondary}}
                  onClick={() => {
                    setFileChanged(true);
                    samplePCAAdmixDataset(0, index);
                    handleClose();
                  }}>
                  {" "}
                  <Typography>{val}</Typography>
                </Button>
              );
            })}
          </div>
        );
      case "Example: Admixed PCA":
        return (
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {sampleDatasets.map((val, index) => {
              return (
                <Button
                  variant="contained"
                  style={{width: "60%", margin: "auto", color: "white", backgroundColor: colors.secondary}}
                  onClick={() => {
                    setFileChanged(true);
                    samplePCAAdmixDataset(1, index);
                    handleClose();
                  }}>
                  {" "}
                  <Typography>{val}</Typography>
                </Button>
              );
            })}
          </div>
        );
      case "PCA":
      case "PCA (using Correlation Matrix)":
        let text;
        if (dataProcessed) {
          text = "Expected: PCA data";
        } else {
          text = "Expected: Correlation Matrix";
        }
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              {text}
            </Typography>
            {renderDragDropArea("PCA")}
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button
                variant="contained"
                style={{marginTop: "20px", backgroundColor: colors.secondary, color: "white"}}
                onClick={() => {
                  if (dataProcessed) {
                    processedPCA(files.PCA.processed);
                  } else {
                    if (!files) unprocessedPCA(files.PCA.unprocessed, files.PCA.unprocessed.name);
                  }
                  setFileChanged(true);
                }}>
                Submit
              </Button>
            </div>
          </div>
        );
      case "Admixed PCA":
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Upload necessary files for Admixed PCA
            </Typography>
            {["PCA", "Admix"].map((type) => (
              <div key={type}>
                <Typography variant="h6" gutterBottom>
                  {type}
                </Typography>
                {renderDragDropArea(type)}
              </div>
            ))}
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button
                variant="contained"
                style={{marginTop: "20px", backgroundColor: colors.secondary, color: "white"}}
                onClick={() => {
                  processedAdmix([files.PCA.processed, files.Admix]);
                  setFileChanged(true);
                }}>
                Submit
              </Button>
            </div>
          </div>
        );
      case "PC-AiR (using PLINK files and Kinship) ":
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Upload necessary files for PC-AiR
            </Typography>
            {["Kinship", ".bed", ".bim", ".fam"].map((type) => (
              <div key={type}>
                <Typography variant="h6" gutterBottom>
                  {type}
                </Typography>
                {renderDragDropArea(type)}
              </div>
            ))}
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button
                variant="contained"
                style={{marginTop: "20px", backgroundColor: colors.secondary, color: "white"}}
                onClick={async () => {
                  await handlePCAirFiles();
                  setFileChanged(true);
                }}>
                Submit
              </Button>
            </div>
          </div>
        );
      case "t-SNE 2D (using PCA data)":
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Expected: PCA data
            </Typography>
            {renderDragDropArea("PCA")}
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button
                variant="contained"
                style={{marginTop: "20px", backgroundColor: colors.secondary, color: "white"}}
                onClick={() => {
                  tsne2d(files.PCA.unprocessed);
                  setFileChanged(true);
                }}>
                Submit
              </Button>
            </div>
          </div>
        );
      case "t-SNE 3D (using PCA data)":
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Expected: PCA data
            </Typography>
            {renderDragDropArea("PCA")}
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button
                variant="contained"
                style={{marginTop: "20px", backgroundColor: colors.secondary, color: "white"}}
                onClick={() => {
                  tsne3d(files.PCA.unprocessed);
                  setFileChanged(true);
                }}>
                Submit
              </Button>
            </div>
          </div>
        );
      case "UMAP 2D (using PCA data)":
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Expected: PCA data
            </Typography>
            {renderDragDropArea("PCA")}
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button
                variant="contained"
                style={{marginTop: "20px", backgroundColor: colors.secondary, color: "white"}}
                onClick={() => {
                  runUMAP2D(files.PCA.unprocessed);
                  setFileChanged(true);
                }}>
                Submit
              </Button>
            </div>
          </div>
        );
      case "UMAP 3D (using PCA data)":
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Expected: PCA data
            </Typography>
            {renderDragDropArea("PCA")}
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button
                variant="contained"
                style={{marginTop: "20px", backgroundColor: colors.secondary, color: "white"}}
                onClick={() => {
                  runUMAP3D(files.PCA.unprocessed);
                  setFileChanged(true);
                }}>
                Submit
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderOptions = () => {
    if (selectedOption) {
      return renderFileUpload();
    }

    switch (dataSelectionStep) {
      case "initial":
        return (
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleDataSelection("own")}>
              Upload Your Own Data
            </Button>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleDataSelection("example")}>
              Use Example Data
            </Button>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleDataSelection("saved")}>
              Use Saved Data
            </Button>
          </div>
        );
      case "ownData":
        return (
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleProcessingSelection(true)}>
              Data Processed
            </Button>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleProcessingSelection(false)}>
              Data Not Processed
            </Button>
          </div>
        );
      case "saved":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            {console.log(savedData.plots)}
            {savedPlots && savedPlots.plots?.length > 0 ? (
              savedPlots.plots.map((plot) => (
                <div
                  style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center", gap: 10}}>
                  <div
                    className="saved-plot-btn"
                    style={{
                      width: "80%",
                      minHeight: 50,
                      backgroundColor: "#EEE",
                      borderRadius: 20,
                      padding: 10,
                      paddingRight: 20,
                      paddingLeft: 20,
                      display: "flex",
                      cursor: "pointer",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                    onClick={() => {
                      fetchSpecificPlot({
                        processData: processData,
                        setIsLoading: setIsMainPageLoading,
                        plotName: plot.title,
                        resetSaveState: resetSaveState,
                      });
                      handleClose();
                    }}>
                    <div style={{overflow: "hidden"}}>{plot.title}</div>
                    <div style={{fontWeight: 200}}>{plot.date.split(" ")[0]}</div>
                  </div>
                  <div
                    onClick={() => {
                      setShowOptionModal(true);
                      setSavedData(plot);
                      console.log("pressed");
                    }}
                    style={{
                      backgroundColor: colors.secondary,
                      cursor: "pointer",
                      height: 45,
                      width: 45,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                    }}>
                    <MdOutlineMoreHoriz color={"white"} size={35} />
                  </div>

                  {/* <AppButton
                    onClick={() => {
                      setShowOptionModal(true);
                      setSavedData(plot);
                      console.log("pressed");
                    }}
                    style={{ minWidth: 120, hight: 45 }}
                    title={"show more"}
                  ></AppButton> */}
                  <div
                    onClick={() => handleDelete(plot.title)}
                    style={{
                      backgroundColor: "#EEE",
                      height: 45,
                      width: 45,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                      cursor: "pointer",
                    }}>
                    <FaTrash color="red" />
                  </div>
                </div>
              ))
            ) : (
              <h5> there are no data</h5>
            )}
          </div>
        );
      case "exampleData":
      case "final":
        const options =
          dataSelectionStep === "exampleData"
            ? ["Example: PCA", "Example: Admixed PCA"]
            : dataProcessed
              ? ["PCA", "Admixed PCA"]
              : [
                "PCA (using Correlation Matrix)",
                "PC-AiR (using PLINK files and Kinship) ",
                "t-SNE 2D (using PCA data)",
                "t-SNE 3D (using PCA data)",
                "UMAP 2D (using PCA data)",
                "UMAP 3D (using PCA data)",
              ];

        return (
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {options.map((option) => (
              <Button variant="outlined" key={option} style={buttonStyle} onClick={() => handleOptionSelection(option)}>
                {option}
              </Button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "0.75rem",
    borderColor: "#1976d2",
    borderWidth: 1,
    color: "#1976d2",
    fontFamily: font.primaryFont,
    "&:hover": {
      backgroundColor: "#e3f2fd",
    },
    width: "60%",
    margin: "auto",
  };

  const getTitle = () => {
    if (selectedOption.startsWith("Example")) return `${selectedOption}`;
    else if (selectedOption) return `Upload Files for ${selectedOption}`;

    switch (dataSelectionStep) {
      case "initial":
        return "Select Data Option";
      case "ownData":
        return "Has the Data Been Processed?";
      case "exampleData":
        return "Use Example Data";
      case "saved":
        return "Use Saved Data";
      case "final":
        return "Select Dimensionality Reduction Method";
      default:
        return "";
    }
  };
  const modalBody = (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60%",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 310,
      }}>
      <div style={{display: "flex", justifyContent: "start", marginBottom: "20px"}}>
        {dataSelectionStep !== "initial" && <BackButton handleBack={handleBack}></BackButton>}
        <h2 style={{marginBottom: 0}}>{getTitle()}</h2>
      </div>
      {renderOptions()}
      {isLoading && (
        <div style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}>
          <Loader type="TailSpin" color="#00BFFF" height="100" width="100" />
        </div>
      )}
    </Box>
  );

  // console.log(files);
  return (
    <div>
      <div style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Button
          style={{display: "block", fontFamily: "Poppins, san-serif", width: "100%"}}
          variant="outlined"
          className={classes.customButton}
          onClick={handleOpen}>
          Choose Data
        </Button>
      </div>
      <Modal open={showOptionModal} onClose={() => setShowOptionModal(false)}>
        <div
          style={{
            top: "50%",
            left: "50%",
            position: "absolute",
            width: "50%",
            backgroundColor: "white",
            transform: "translate(-50%, -50%)",
            borderRadius: 30,
            padding: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minWidth: 250,
          }}>
          <h2 style={{textAlign: "center", marginTop: 20}}>{savedData.title}</h2>
          <h5></h5>
          <div style={{marginTop: 40, width: "100%"}}>
            <StyledText
              label={"clustering algorithm applied"}
              value={
                selectClusterActions[savedData.clusteringAlgo]?.label
                  ? selectClusterActions[savedData.clusteringAlgo]?.label
                  : null
              }></StyledText>
            <StyledText
              label={"Number of clusters"}
              value={savedData.numCluster ? savedData.numCluster : null}></StyledText>
            <StyledText
              label={"Outlier Detection algorithm applied"}
              value={
                selectOutlierActions[savedData.outlierDetectionAlgo]?.label
                  ? selectOutlierActions[savedData.outlierDetectionAlgo]?.label
                  : null
              }></StyledText>
            <StyledText
              label={"Outlier Detection mode"}
              value={
                savedData.outlierDetectionAlgo &&
                  savedData.outlierDetectionAlgo < 4 &&
                  savedData.outlierDetectionAlgo != 0
                  ? savedData.isOr
                    ? "Or"
                    : "And"
                  : null
              }></StyledText>
            <StyledText
              label={"Outlier Detection Range"}
              range={true}
              value={
                savedData.outlierDetectionAlgo
                  ? [savedData.outlierDetectionColumnsStart, savedData.outlierDetectionColumnsEnd]
                  : null
              }></StyledText>
          </div>
        </div>
      </Modal>
      <Modal open={modalOpen} onClose={handleClose}>
        {modalBody}
      </Modal>
    </div>
  );
}

export default DataUploadModal;
