import React, { useState, useEffect } from "react";

function CurrentWeatherCard({ data }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div>Loading real-time weather...</div>;
  }

  return (
    <div className="p-4 flex flex-col justify-center items-center w-full text-center ">
      <div>
        {time.toLocaleTimeString()}, {time.toDateString()}
      </div>
      <div className="flex items-center justify-center ">
        <img
          src={data.condition.icon}
          alt={data.condition.text}
          className="w-[140px]"
        />
        <div className="flex font-bold ml-[-10px]">
          <h2 className="text-4xl">{data.temp_f}</h2>
          <span>°F</span>
        </div>
      </div>
      <h2 className="font-bold capitalize text-4xl mt-[-8px]">
        {data.condition.text}
      </h2>
      <div className="flex justify-center gap-6 w-full items-center mt-[40px]">
        <div className="humidity flex flex-col gap-2">
          <span>Humidity</span>
          <span className="font-semibold text-lg">{data.humidity}%</span>
        </div>
        <div className="wind flex flex-col gap-2">
          <span>Wind Speed</span>
          <span className="font-semibold text-lg">{data.wind_kph} km/h</span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeatherCard;
