 import axios from "axios";

 const API = axios.create({
   baseURL: "https://taskplanet-social-page.onrender.com/api"
 });

 export default API;