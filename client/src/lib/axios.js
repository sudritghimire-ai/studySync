import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://studysync-mmo6.onrender.com/api",
  withCredentials: true,
});
