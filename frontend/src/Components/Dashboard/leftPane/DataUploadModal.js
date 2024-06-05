import React, { useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import { green } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

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
  samplePCAAdmixDataset,
  processedPCA,
  processedAdmix,
  unprocessedPCA,
  tsne2d,
  tsne3d,
  runPCAir,
}) {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [dataSelectionStep, setDataSelectionStep] = useState("initial");
  const [dataProcessed, setDataProcessed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [files, setFiles] = useState({
    PCA: { processed: null, unprocessed: null },
    Admix: null,
    ".bed": null,
    ".bim": null,
    ".fam": null,
    Kinship: null,
  });

  // State to keep track of drag over for each type
  const [dragOver, setDragOver] = useState({
    PCA: { processed: false, unprocessed: false },
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
    PCA: { processed: useRef(null), unprocessed: useRef(null) },
    Admix: useRef(null),
    ".bed": useRef(null),
    ".bim": useRef(null),
    ".fam": useRef(null),
    Kinship: useRef(null),
  };
  const fileInputRefs = useRef({});

  const resetUploads = () => {
    setFiles({
      PCA: { processed: null, unprocessed: null },
      Admix: null,
      ".bed": null,
      ".bim": null,
      ".fam": null,
      Kinship: null,
    });

    // State to keep track of drag over for each type
    setDragOver({
      PCA: { processed: false, unprocessed: false },
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
    let newDragOverState = { ...dragOver };

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

    let newFilesState = { ...files };
    let newDragOverState = { ...dragOver };

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
  const handleOpen = () => {
    setDataSelectionStep("initial");
    setDataProcessed(false);
    setSelectedOption("");
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const handleDataSelection = (selection) => {
    if (selection === "own") {
      setDataSelectionStep("ownData");
    } else {
      setDataSelectionStep("exampleData");
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

    let newDragOverState = { ...dragOver };

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
    let newFilenames = {};
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
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs!");
        throw error; // Propagate the error to be caught in Promise.all
      }
    });

    Promise.all(uploadTasks)
      .then(() => {
        handleClose();
        runPCAir(newFilenames[".bed"], newFilenames[".bim"], newFilenames[".fam"], newFilenames["Kinship"]);
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
        onDrop={(e) => handleFileUpload(e, type, true)}
      >
        {toDisplay}
        {fileInputElement}
      </div>
    );
  };
  const renderFileUpload = () => {
    switch (selectedOption) {
      case "Example: PCA":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sampleDatasets.map((val, index) => {
              return (
                <Button
                  variant="contained"
                  style={{ width: "60%", margin: "auto" }}
                  onClick={() => samplePCAAdmixDataset(0, index)}
                >
                  {" "}
                  <Typography>{val}</Typography>
                </Button>
              );
            })}
          </div>
        );
      case "Example: Admixed PCA":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sampleDatasets.map((val, index) => {
              return (
                <Button
                  variant="contained"
                  style={{ width: "60%", margin: "auto" }}
                  onClick={() => samplePCAAdmixDataset(1, index)}
                >
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{ marginTop: "20px", backgroundColor: green[500], color: "white" }}
                onClick={() => {
                  if (dataProcessed) {
                    processedPCA(files.PCA.processed);
                  } else {
                    unprocessedPCA(files.PCA.unprocessed, files.PCA.unprocessed.name);
                  }
                  handleClose();
                }}
              >
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{ marginTop: "20px", backgroundColor: green[500], color: "white" }}
                onClick={() => {
                  processedAdmix([files.PCA.processed, files.Admix]);
                  handleClose();
                }}
              >
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{ marginTop: "20px", backgroundColor: green[500], color: "white" }}
                onClick={async () => await handlePCAirFiles()}
              >
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{ marginTop: "20px", backgroundColor: green[500], color: "white" }}
                onClick={() => {
                  tsne2d(files.PCA.unprocessed);
                  handleClose();
                }}
              >
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{ marginTop: "20px", backgroundColor: green[500], color: "white" }}
                onClick={() => {
                  tsne3d(files.PCA.unprocessed);
                  handleClose();
                }}
              >
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
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleDataSelection("own")}>
              Use Your Own Data
            </Button>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleDataSelection("example")}>
              Use Example Data
            </Button>
          </div>
        );
      case "ownData":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleProcessingSelection(true)}>
              Data Processed
            </Button>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleProcessingSelection(false)}>
              Data Not Processed
            </Button>
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
              ];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
      }}
    >
      <div style={{ display: "flex", justifyContent: "start", marginBottom: "20px" }}>
        {dataSelectionStep !== "initial" && (
          <div
            onClick={handleBack}
            style={{
              display: "flex",
              borderRadius: 50,
              width: 40,
              height: 40,
              backgroundColor: "#EEE",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 30,
            }}
          >
            <ArrowBackIcon style={{ cursor: "pointer" }} />
          </div>
        )}
        <h2 style={{ marginBottom: 0 }}>{getTitle()}</h2>
      </div>
      {renderOptions()}
    </Box>
  );

  console.log(files);
  return (
    <div>
      <div style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button variant="outlined" className={classes.customButton} onClick={handleOpen}>
          Choose Data
        </Button>
      </div>
      <Modal open={modalOpen} onClose={handleClose}>
        {modalBody}
      </Modal>
    </div>
  );
}

export default DataUploadModal;
