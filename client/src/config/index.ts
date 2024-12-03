const DEV_API_URL = 'http://192.168.175.199:5000';  // Replace with your actual IP
const PROD_API_URL = 'https://your-production-url.com';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
export const SOCKET_URL = API_URL; 