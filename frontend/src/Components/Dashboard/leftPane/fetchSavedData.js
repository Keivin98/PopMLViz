import React, { useState } from "react";
import axios from "axios";

import { checkAccessTokenValidity, api, refreshAccessToken } from "../../../config/tokenValidityChecker";

export default async function fetchSavedData({ setIsLoading, setSavedPlots, setDataSelectionStep }) {
  try {
    setIsLoading(true);
    const isValid = await checkAccessTokenValidity();
    if (!isValid) {
      const newAccessToken = await refreshAccessToken();
      const response = await api.get("/api/getSavedData", {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      // console.log(response.data);
      // console.log("data is fetched!");
      setSavedPlots(response.data);
      setIsLoading(false);
      if (setDataSelectionStep) {
        setDataSelectionStep("saved");
      }
      return response.data;
    } else {
      const response = await api.get("/api/getSavedData", { withCredentials: true });
      // console.log(response.data);
      setSavedPlots(response.data);
      setIsLoading(false);
      if (setDataSelectionStep) {
        setDataSelectionStep("saved");
      }
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setIsLoading(false);
    throw error;
  }
}
