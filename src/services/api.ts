import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  validateStatus: (s) => s >= 200 && s < 300, // comportamiento por defecto explícito
});

//interceptor para agregar token automaticamente

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})


export default api;