import axios from "axios"

// API URL
const API_URL = 'https://assignment-weaa.onrender.com/'


const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})


export default instance