import axios from "axios";
import config from "./config.js";

export default axios.create({
  baseURL: config.BACKEND_API_LINK,
  headers: {
    "Content-type": "application/json"
  }
});