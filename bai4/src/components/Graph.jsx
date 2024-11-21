import React, { useState, useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Title,
  CategoryScale,
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Title,
  CategoryScale,
  Filler
);

function Graph({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("temperature"); // Default option

  useEffect(() => {
    if (!data || data.length === 0) return; // Handle missing or empty data gracefully

    const ctx = chartRef.current.getContext("2d");

    const hourlyData = data?.hour || [];
    const labels = hourlyData.map((hour) => hour.time.split(" ")[1]); // Extract "HH:mm" time

    // Define datasets for the graph
    const datasets = {
      temperature: {
        data: hourlyData.map((hour) => hour.temp_f || 0), // Fahrenheit temperature with fallback
        label: "Temperature (°F)",
        color: "rgba(255, 197, 112, 0.8)",
        backgroundColor: "rgba(255, 229, 191, 0.8)",
      },
      uv: {
        data: hourlyData.map((hour) => hour.uv || 0), // UV index with fallback
        label: "UV Index",
        color: "rgba(233, 199, 255, 0.8)",
        backgroundColor: "rgba(244, 227, 255, 0.8)",
      },
      humidity: {
        data: hourlyData.map((hour) => hour.humidity || 0), // Humidity percentage with fallback
        label: "Humidity (%)",
        color: "rgba(169, 215, 255, 0.8)",
        backgroundColor: "rgba(233, 244, 254, 0.8)",
      },
    };

    const selectedDataset = datasets[selectedOption];

    const currentHour = new Date().getHours();
    const currentHourIndex = hourlyData.findIndex(
      (hour) => new Date(hour.time).getHours() === currentHour
    );

    const currentValue =
      currentHourIndex !== -1 ? selectedDataset.data[currentHourIndex] : null;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy previous chart instance to avoid duplication
    }

    // Create a new chart instance with your original config
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: selectedDataset.label,
            data: selectedDataset.data,
            borderColor: selectedDataset.color,
            borderWidth: 2,
            backgroundColor: selectedDataset.backgroundColor,
            tension: 0.4,
            pointBackgroundColor: (ctx) =>
              ctx.dataIndex === currentHourIndex ? "#fff" : "transparent",
            pointRadius: (ctx) => (ctx.dataIndex === currentHourIndex ? 6 : 0),
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
          },
          afterDatasetsDraw: {
            id: "valueDot",
            afterDraw(chart) {
              const { ctx } = chart;
              if (currentHourIndex !== -1 && currentValue !== null) {
                const meta = chart.getDatasetMeta(0);
                const point = meta.data[currentHourIndex];
                const x = point.x;
                const y = point.y;

                ctx.save();
                ctx.font = "14px Arial";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText(
                  `${currentValue}${
                    selectedOption === "temperature"
                      ? "°F"
                      : selectedOption === "humidity"
                      ? "%"
                      : ""
                  }`,
                  x,
                  y - 10
                );
                ctx.restore();
              }
            },
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        elements: {
          point: {
            pointStyle: "circle",
          },
        },
      },
    });

    // Cleanup the chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, selectedOption]);

  return (
    <div>
      {/* Select Dropdown */}
      <div className="mb-4">
        <select
          id="chartSelect"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="p-2 border-none outline-none rounded"
        >
          <option value="temperature">Temperature</option>
          <option value="uv">UV Index</option>
          <option value="humidity">Humidity</option>
        </select>
      </div>

      {/* Chart */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default Graph;
