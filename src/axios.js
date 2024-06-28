// import router from "./routes/routes.js"
// import axios from 'axios';

// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['x-token'] = token;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Redirigir al login si el token no es válido
//       localStorage.removeItem('token');
//       localStorage.removeItem('usuario');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axios;
