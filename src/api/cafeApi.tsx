import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//En local
// const baseURL = 'http://192.168.1.70:8080/api';

//En Producción
const baseURL = 'https://camilo-cafe-react-native.herokuapp.com/api';


const cafeApi = axios.create({ baseURL });

cafeApi.interceptors.request.use(
  async(config) => {
    const token = await AsyncStorage.getItem('token');
    if(token && config.headers) {
      config.headers['x-token'] = token;
    }
    return config;
  }
)

export default cafeApi;