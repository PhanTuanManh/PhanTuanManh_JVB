import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

function ModalDetails({ isOpen, onClose, data }) {
  if (!data) return null;

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = today.toDateString() === date.toDateString();

    if (isToday) {
      return "Today";
    } else {
      const options = { month: "short", day: "numeric" }; // Format as "Nov 24"
      return date.toLocaleDateString(undefined, options);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="px-5 pb-4 rounded-xl modal-class flex-col absolute lg:w-[800px] w-[380px] mx-auto top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-black bg-white flex border-none outline-none shadow-lg"
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl">{formatDate(data.date)}</h2>
        <button onClick={onClose} className="text-md font-bold">
          Close
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex flex-col items-center">
          <img
            src={data.day?.condition?.icon}
            alt={data.day?.condition?.text}
            className="w-[100px] h-[100px]"
          />

          <p>{data.day?.condition?.text}</p>
        </div>
        <h2 className="text-4xl">{data.day?.avgtemp_f}°F</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-4 mb-6">
        <p className="border-b">Max Temp: {data.day?.maxtemp_f}°F</p>
        <p className="border-b">Min Temp: {data.day?.mintemp_f}°F</p>
        <p className="border-b">UV Index: {data.day?.uv}</p>
        <p className="border-b">Humidity: {data.day?.avghumidity}%</p>
        <p className="border-b">Wind Speed: {data.day?.maxwind_kph} km/h</p>
      </div>

      {/* Hourly Weather Data */}
      <div className="flex overflow-x-scroll gap-4 pb-4">
        {data.hour?.map((hour, idx) => (
          <div
            key={idx}
            className="p-5 rounded cursor-pointer h-[100%] flex flex-col justify-center items-center bg-slate-100"
          >
            <p className="mb-2">
              <span className="font-bold text-lg">
                {hour.time.split(" ")[1]}
              </span>
            </p>
            <img
              src={hour.condition.icon}
              alt="Weather Icon"
              className="min-w-[80px]"
            />
            <span className="text-sm">Humidity</span>
            <span className="font-semibold text-base">{hour.humidity}%</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ModalDetails;
