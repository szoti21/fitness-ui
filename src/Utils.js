import React from "react";
import { Navigate } from "react-router-dom";

export const fetchWithAuth = (url, options = {}) => {
    const token = sessionStorage.getItem("authToken"); // Retrieve the token
    const headers = {
      ...options.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ""
    };

    return fetch(url, {
      ...options,
      headers,
    }).then((response) => {
        if (response.status == 401){
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("username");
          sessionStorage.removeItem("role");
          console.log("found 401")
          //window.location.href = '/auth/login';
                      throw new Error("Network response was not ok");
        }
        else if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response;
    });
  };