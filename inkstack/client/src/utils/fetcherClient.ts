import axios from "axios";

const fetcherClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default fetcherClient;