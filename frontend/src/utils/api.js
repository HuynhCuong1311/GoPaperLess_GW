import axios from "axios";

export const api = axios.create({
  // local
  // baseURL: "/view",
  baseURL: "http://localhost:8080/view",
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
