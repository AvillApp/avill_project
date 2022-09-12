import axios from "axios";

export default axios.create({
  baseURL: `https://api.avill.com.co/api/`,
 //baseURL: `http://192.168.1.1:8000/api/`,
});
