import axios from 'axios';
import keys from './keys';

const { server_url } = keys;

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: server_url,
});

console.log('axios default headers=', axiosInstance.defaults.headers);
export default axiosInstance;