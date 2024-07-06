import React, { useState } from "react";
import axios from "axios";




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
export default async function fetchSavedData({setIsLoading, setSavedPlots, setDataSelectionStep }) {
  try {
    setIsLoading(true)
    const isValid = await checkAccessTokenValidity();
    if (!isValid) {
      const newAccessToken = await refreshAccessToken();
      const response = await api.get("/api/getSavedData", {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      console.log(response.data);
      console.log("data is fetched!");
      setSavedPlots(response.data);
      setIsLoading(false)
      setDataSelectionStep("saved")
      return response.data;
    } else {
      const response = await api.get("/api/getSavedData", { withCredentials: true });
      console.log(response.data);
      setSavedPlots(response.data);
      setIsLoading(false)
      setDataSelectionStep("saved")
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setIsLoading(false)
    throw error;
  }
}
