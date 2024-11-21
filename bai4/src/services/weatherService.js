import axios from "axios";

const API_KEY = "f5ac4be4a19c47d8a3e42522222112";
const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";

export const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
