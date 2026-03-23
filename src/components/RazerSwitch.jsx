import React from "react";

function RazerSwitch({ isOn, onToggle }) {
  return (
    <div
      className={`switch switch-slider ${isOn ? "on" : ""}`}
      onClick={onToggle}
    >
      <div className="handle"></div>
    </div>
  );
}

export default RazerSwitch;
