import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import Graph from "../components/Graph";
import ForecastCard from "../components/ForecastCard";
import ModalDetails from "../components/ModalDetails";
import { fetchWeatherData } from "../services/weatherService";

function Home() {
  const [city, setCity] = useState("Hanoi");
  const [weatherData, setWeatherData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentHourData, setCurrentHourData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [error, setError] = useState(""); // State for error message

  useEffect(() => {
    if (!city) return; // Do nothing if city is empty

    const loadWeather = async () => {
      try {
        const data = await fetchWeatherData(city);
        if (data) {
          setWeatherData(data);
          const today = data.forecast.forecastday[0];
          setSelectedDay(today);
          setCurrentHourData(getRealTimeHourData(today));
          setError(""); // Clear error if data is successfully fetched
        } else {
          setError(`No weather data found for "${city}".`);
        }
      } catch (err) {
        setError("Failed to fetch weather data. Please try again later.");
      }
    };

    loadWeather();
  }, [city]);

  // Extract real-time weather data based on the current hour
  const getRealTimeHourData = (forecastDay) => {
    const currentHour = new Date().getHours();
    const hourlyData = forecastDay.hour || [];
    return hourlyData.find(
      (hour) => new Date(hour.time).getHours() === currentHour
    );
  };

  const handleCardClick = (day) => {
    setSelectedDay(day);
    setCurrentHourData(getRealTimeHourData(day)); // Update real-time data based on selected day
  };

  const handleCardDoubleClick = (day) => {
    setModalData(day);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="p-6 bg-white shadow shadow-lg rounded-xl ">
      <Header city={city} setCity={setCity} setError={setError} />
      {error && (
        <div className="text-red-500 text-center pt-10 font-semibold  w-[932px] h-[545px]">
          {error}
        </div>
      )}
      {weatherData && !error && (
        <div className="flex justify-between gap-8 w-full items-center">
          <div className="w-[300px]">
            <CurrentWeatherCard data={currentHourData || weatherData.current} />
          </div>
          <div className="w-[600px] flex flex-col gap-5">
            <Graph data={selectedDay || weatherData.forecast.forecastday[0]} />
            <div className="flex flex-row gap-5 justify-start items-center overflow-x-auto h-[170px]">
              {weatherData.forecast.forecastday.map((day, idx) => (
                <ForecastCard
                  key={idx}
                  day={day}
                  onClick={() => handleCardClick(day)}
                  onDoubleClick={() => handleCardDoubleClick(day)}
                  isSelected={selectedDay?.date === day.date}
                />
              ))}
            </div>
            {isModalOpen && (
              <ModalDetails
                isOpen={isModalOpen}
                onClose={closeModal}
                data={modalData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
