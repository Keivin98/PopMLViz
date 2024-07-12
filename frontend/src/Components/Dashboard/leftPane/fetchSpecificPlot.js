import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { checkAccessTokenValidity, api, refreshAccessToken } from "../../../config/tokenValidityChecker";
import SuccessMessage from "../../SuccessMessage";
import ErrorMessage from "../../ErrorMessage";




function arrayToCSV(data) {
  const headers = Object.keys(data[0]); // Extract headers from the first object
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) => headers.map((field) => row[field]).join(",")), // Data rows
  ];
  return csvRows.join("\n");
}

export default async function fetchSpecificPlot({ setIsLoading, plotName, processData, resetSaveState }) {
  try {
    setIsLoading(true);
    console.log(plotName);
    const isValid = await checkAccessTokenValidity();
    let headers = {};
    if (!isValid) {
      const newAccessToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${newAccessToken}`;
    }

    const response = await api.get("/api/getSavedPlot", {
      headers: {
        ...headers,
      },
      params: {
        name: plotName,
      },
      withCredentials: true,
    });

    console.log(response.data.plot.plot);
    console.log(response.data.plot);
    const csv = arrayToCSV(response.data.plot.plot);
    // Use the processData function that now takes a string instead of an array
    // console.log(csv);

    processData(csv, false, null, response.data.plot);
    resetSaveState()
    SuccessMessage("Saved data uploaded successfully!");
    setIsLoading(false); 
    return response.data.plot;
  } catch (error) {
    ErrorMessage("Error fetching data. Please try again later.")
    setIsLoading(false);
    throw error;
  }
}
