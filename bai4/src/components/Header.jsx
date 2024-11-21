import React from "react";

function Header({ city, setCity }) {
  return (
    <div className="flex gap-3 items-center p-4">
      <span className="font-semibold">Your city</span>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        className="border rounded p-2"
      />
    </div>
  );
}

export default Header;
