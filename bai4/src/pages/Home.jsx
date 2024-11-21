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

  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchWeatherData(city);
      if (data) {
        setWeatherData(data);
        const today = data.forecast.forecastday.find(
          (day) => day.date === new Date().toISOString().split("T")[0]
        );
        setSelectedDay(today || data.forecast.forecastday[0]);

        // Get real-time data for today's forecast
        setCurrentHourData(
          getRealTimeHourData(today || data.forecast.forecastday[0])
        );
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
    <div className="p-6 bg-white shadow shadow-lg rounded-xl">
      <Header city={city} setCity={setCity} />
      {weatherData && (
        <div className="flex lg:flex-row flex-col justify-between gap-8 w-full items-center">
          <div className="lg:w-[300px]">
            {/* Pass real-time data to CurrentWeatherCard */}
            <CurrentWeatherCard data={currentHourData || weatherData.current} />
          </div>
          <div className="lg:w-[600px] flex flex-col gap-5">
            <Graph data={selectedDay || weatherData.forecast.forecastday[0]} />

            <div className="flex flex-row lg:gap-5 gap-0 lg:justify-start justify-between items-center overflow-x-auto h-[170px]">
              {weatherData.forecast.forecastday.map((day, idx) => (
                <ForecastCard
                  key={idx}
                  day={day}
                  onClick={() => handleCardClick(day)} // Single click
                  onDoubleClick={() => handleCardDoubleClick(day)}
                  isSelected={selectedDay?.date === day.date} // Double click
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
