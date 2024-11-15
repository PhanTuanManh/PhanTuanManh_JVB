const header = document.querySelector(".head");
const dates = document.querySelector(".dates");
const daysContainer = document.querySelector(".days-container");
const monthsContainer = document.querySelector(".months-container");
const yearsContainer = document.querySelector(".years-container");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const todayElement = document.querySelector("h2");
const date = new Date();
const currentMonth = date.getMonth();
const currentYear = date.getFullYear();
let startYear = Math.floor(currentYear / 10) * 10;
let selectedMonth = currentMonth; // Temporarily holds the selected month
let selectedYear = currentYear; // Temporarily holds the selected year
let currentView = "dates"; // Track the current view

const dayName = dayNames[date.getDay()]; // Day name
const monthName = months[date.getMonth()]; // Month name
const todayDate = date.getDate();

todayElement.textContent = `${dayName}, ${monthName} ${todayDate}`;
function renderCalendar() {
  dates.innerHTML = "";
  renderDays(selectedYear, selectedMonth);
  updateHeader(selectedMonth, selectedYear);
}

function renderDays(year, month) {
  header.classList.remove("inactive");
  dates.innerHTML = "";
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    dates.innerHTML += `<li class="inactive">${prevMonthDays - i}</li>`;
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === date.getDate() &&
      month === date.getMonth() &&
      year === date.getFullYear();
    dates.innerHTML += `<li${isToday ? ' class="today"' : ""}>${day}</li>`;
  }
  const totalCells = firstDayOfWeek + daysInMonth;
  for (let i = 1; i <= 42 - totalCells; i++) {
    dates.innerHTML += `<li class="inactive">${i}</li>`;
  }
}

function renderMonths() {
  header.classList.remove("inactive");
  const monthList = document.querySelector(".months");
  monthList.innerHTML = "";
  // Display all 12 months, with `active` class only on `currentMonth`
  months.forEach((month, index) => {
    const monthItem = document.createElement("li");
    monthItem.textContent = month.slice(0, 3);
    monthItem.classList.toggle(
      "active",
      index === currentMonth && selectedYear === currentYear
    );
    monthItem.addEventListener("click", () => {
      selectedMonth = index;
      switchToDatesView();
    });
    monthList.appendChild(monthItem);
  });

  // Add inactive placeholders for 4 months after the end of the year
  for (let i = 0; i < 4; i++) {
    const nextMonth = document.createElement("li");
    nextMonth.textContent = months[i].slice(0, 3);
    nextMonth.classList.add("inactive");
    monthList.appendChild(nextMonth);
  }

  updateHeader(null, selectedYear);
}

function renderYears() {
  header.classList.add("inactive");
  const yearList = document.querySelector(".years");
  yearList.innerHTML = "";
  const endYear = startYear + 15;

  for (let year = startYear; year <= endYear; year++) {
    const yearItem = document.createElement("li");
    yearItem.textContent = year;
    yearItem.classList.toggle("active", year === currentYear);
    yearItem.classList.toggle("inactive", year > startYear + 9);
    yearItem.addEventListener("click", () => {
      if (!yearItem.classList.contains("inactive")) {
        selectedYear = year; // Temporarily hold selected year without affecting currentYear
        switchToMonthsView();
      }
    });
    yearList.appendChild(yearItem);
  }

  updateYearRangeHeader(startYear, startYear + 19);
}

function updateYearRangeHeader(startYear, endYear) {
  header.textContent = `${startYear} - ${endYear}`;
}

function updateHeader(month, year) {
  if (currentView === "dates" && month !== null && month !== undefined) {
    header.textContent = `${months[month]} ${year}`;
  } else if (currentView === "months") {
    header.textContent = `${year}`;
  }
}

header.addEventListener("click", () => {
  if (currentView === "dates") {
    switchToMonthsView();
  } else if (currentView === "months") {
    switchToYearsView();
  }
});

function switchToMonthsView() {
  currentView = "months";
  daysContainer.classList.add("hidden");
  yearsContainer.classList.add("hidden");
  monthsContainer.classList.remove("hidden");
  renderMonths();
}

function switchToDatesView() {
  currentView = "dates";
  monthsContainer.classList.add("hidden");
  yearsContainer.classList.add("hidden");
  daysContainer.classList.remove("hidden");
  renderCalendar();
}

function switchToYearsView() {
  currentView = "years";
  daysContainer.classList.add("hidden");
  monthsContainer.classList.add("hidden");
  yearsContainer.classList.remove("hidden");
  renderYears();
}

// Button actions for navigating months in dates view or years in months view
document.getElementById("prev").addEventListener("click", () => {
  if (currentView === "dates") {
    prevMonth();
  } else if (currentView === "months") {
    prevYear();
  } else {
    prev10years();
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (currentView === "dates") {
    nextMonth();
  } else if (currentView === "months") {
    nextYear();
  } else {
    next10years();
  }
});

function prevMonth() {
  selectedMonth--;
  if (selectedMonth < 0) {
    selectedMonth = 11;
    selectedMonth--;
  }
  renderCalendar();
}

function nextMonth() {
  selectedMonth++;
  if (selectedMonth > 11) {
    selectedMonth = 0;
    selectedMonth++;
  }
  renderCalendar();
}

function prevYear() {
  selectedYear--;
  renderMonths();
}

function nextYear() {
  selectedYear++;
  renderMonths();
}

function next10years() {
  startYear += 10;
  renderYears();
}

function prev10years() {
  startYear -= 10;
  renderYears();
}

// Scroll events to navigate months in dates view or years in months view
monthsContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (currentView === "months") {
    e.deltaY > 0 ? nextYear() : prevYear();
  }
});

dates.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (currentView === "dates") {
    e.deltaY > 0 ? nextMonth() : prevMonth();
  }
});

yearsContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (currentView === "years") {
    e.deltaY > 0 ? next10years() : prev10years();
  }
});

renderCalendar();

document.addEventListener("DOMContentLoaded", () => {
  const strongElement = document.querySelector(".set-time strong");
  const iconMinus = document.querySelector(".icon-minus");
  const iconPlus = document.querySelector(".icon-plus");
  const startFocus = document.querySelector(".start-focus");
  const endSession = document.querySelector(".end-session");

  let minutes = 30;
  strongElement.textContent = minutes;
  let countdown;

  iconPlus.addEventListener("click", () => {
    if (minutes <= 240) {
      minutes += 5;
      strongElement.textContent = minutes;
    }
  });

  iconMinus.addEventListener("click", () => {
    if (minutes > 5) {
      minutes -= 5;
      strongElement.textContent = minutes;
    }
  });

  startFocus.addEventListener("click", () => {
    let countdownMinutes = minutes;
    let countdownSeconds = countdownMinutes * 60;

    iconPlus.style.pointerEvents = "none";
    iconMinus.style.pointerEvents = "none";
    startFocus.style.pointerEvents = "none";

    startFocus.classList.add("hidden");
    endSession.classList.remove("hidden");

    countdown = setInterval(() => {
      countdownSeconds--;
      const displayMinutes = Math.floor(countdownSeconds / 60);
      const displaySeconds = countdownSeconds % 60;

      strongElement.textContent = `${
        displayMinutes < 10 ? "0" : ""
      }${displayMinutes} : ${displaySeconds < 10 ? "0" : ""}${displaySeconds}`;

      if (countdownSeconds <= 0) {
        clearInterval(countdown);
        alert("Time's up!");

        resetState();
      }
    }, 1000);
  });

  endSession.addEventListener("click", () => {
    clearInterval(countdown); // Stop the countdown
    resetState();
  });

  function resetState() {
    strongElement.textContent = minutes;
    iconPlus.style.pointerEvents = "auto";
    iconMinus.style.pointerEvents = "auto";
    startFocus.style.pointerEvents = "auto";

    startFocus.classList.remove("hidden");
    endSession.classList.add("hidden");
  }
});
