// script.js
document.addEventListener("DOMContentLoaded", () => {
  const calendarHeader = document.getElementById("month-year");
  const calendarGrid = document.getElementById("calendar-grid");
  const prevMonthButton = document.getElementById("prev-month");
  const nextMonthButton = document.getElementById("next-month");

  let currentDate = new Date();

  function updateCalendar(direction = "down") {
    // Add slide effect based on direction
    calendarGrid.classList.remove("slide-down", "slide-up");
    void calendarGrid.offsetWidth; // Trigger reflow to restart animation
    calendarGrid.classList.add(
      direction === "down" ? "slide-down" : "slide-up"
    );

    // Clear calendar grid after animation
    setTimeout(() => {
      calendarGrid.innerHTML = ""; // Clear the calendar grid

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Update month and year in header
      calendarHeader.textContent = `${currentDate.toLocaleString("default", {
        month: "long",
      })} ${year}`;

      // Create padding days for the first week
      for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement("div");
        calendarGrid.appendChild(emptyDiv);
      }

      // Populate days in the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;

        // Highlight today's date
        if (
          day === new Date().getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
        ) {
          dayDiv.classList.add("today");
        }

        dayDiv.addEventListener("click", () => {
          // Logic for clicking a day to add/view events
          alert(`Clicked on day ${day}`);
        });

        calendarGrid.appendChild(dayDiv);
      }
    }, 300); // Wait for animation to complete
  }

  // Event listeners for month navigation
  prevMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar("up"); // Slide up for previous month
  });

  nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar("down"); // Slide down for next month
  });

  // Initialize the calendar on page load
  updateCalendar();
});
