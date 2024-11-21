function ForecastCard({ day, onClick, onDoubleClick, isSelected }) {
  const formatDate = (date) => {
    const today = new Date().toISOString().split("T")[0]; // Today's date in "YYYY-MM-DD" format
    if (date === today) {
      return "Today";
    }
    const options = { month: "short", day: "numeric" }; // Format as "Nov 24"
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <div
      className={`p-5 lg:w-[138px] rounded cursor-pointer h-[100%] flex flex-col justify-center items-center ${
        isSelected ? "bg-[#5596F6] text-white" : ""
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <h3 className="font-semibold">{formatDate(day.date)}</h3>
      <img src={day.day.condition.icon} alt="Weather Icon" />
      <span className="text-sm">Humidity</span>
      <span className="font-semibold text-base">{day.day.avghumidity}%</span>
    </div>
  );
}

export default ForecastCard;
