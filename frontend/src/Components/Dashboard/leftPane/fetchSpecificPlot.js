import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { checkAccessTokenValidity, api, refreshAccessToken } from "../../../config/tokenValidityChecker";




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
    // console.log(csv);

    // Use the processData function that now takes a string instead of an array
    processData(csv, false, null, response.data.plot);

    resetSaveState()
    // processData(csv, false);
    // const file = response.data.plot;
    // const reader = new FileReader();
    // reader.onload = (evt) => {
    //   /* Parse data */
    //   const bstr = evt.target.result;
    //   const wb = XLSX.read(bstr, { type: "binary" });
    //   /* Get first worksheet */
    //   const wsname = wb.SheetNames[0];
    //   const ws = wb.Sheets[wsname];
    //   /* Convert array of arrays */
    //   const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    //   processData({ dataString: data, type: false });
    // };
    // console.log(response.data);
    // processData({ dataString: response.data.plot, type: false });
    // console.log(JSON.stringify(response.data.plot));
    setIsLoading(false); 
    return response.data.plot;
  } catch (error) {
    console.error("Error fetching data:", error);
    setIsLoading(false);
    throw error;
  }
}
