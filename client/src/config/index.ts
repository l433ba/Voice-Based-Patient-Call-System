// Get the local IP address dynamically
const getLocalIP = () => {
  if (__DEV__) {
    // Use your computer's local IP address - make sure this matches your network
    return '192.168.247.199'; // Updated to match your current IP
  }
  return 'your-production-domain.com';
};

const DEV_API_URL = `http://${getLocalIP()}:5000`;
const PROD_API_URL = 'https://your-production-url.com';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
export const SOCKET_URL = API_URL; 