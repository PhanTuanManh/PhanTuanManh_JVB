import React, { useState, useEffect } from "react";

function Header({ city, setCity, setError }) {
  const [inputValue, setInputValue] = useState(city); // Track the input value
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Track debounce timeout

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setInputValue(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (!value) {
        setError("Please enter a city name.");
        return;
      }

      if (value !== city) {
        setCity(value);
        setError("");
      }
    }, 500);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);
  return (
    <div className="flex gap-3 items-center p-4">
      <span className="font-semibold">Your city</span>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter city"
        className="border rounded p-2"
      />
    </div>
  );
}

export default Header;
