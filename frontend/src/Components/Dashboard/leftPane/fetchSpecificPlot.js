import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}`,
  withCredentials: true, // Ensure credentials (cookies) are sent with requests
});

// Function to check if access token is valid
const checkAccessTokenValidity = async () => {
  try {
    await api.get("/verify");
    return true;
  } catch (error) {
    return false;
  }
};

// Function to refresh access token using refresh token
const refreshAccessToken = async () => {
  try {
    const response = await api.post("/refresh");
    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

function arrayToCSV(data) {
    const headers = Object.keys(data[0]); // Extract headers from the first object
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => headers.map(field => row[field]).join(',')) // Data rows
    ];
    return csvRows.join('\n'); 
  }

export default async function fetchSpecificPlot({ setIsLoading, plotName, processData }) {
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
    const csv = arrayToCSV(response.data.plot.plot);
    console.log(csv);
   

    // Use the processData function that now takes a string instead of an array
    processData(csv, false);
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
