import React from "react";

function RazerSlider({
  id,
  min,
  max,
  value,
  onChange,
  disabled,
  minText,
  maxText,
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={`slider-container ${disabled ? "" : "on"}`} id={id}>
      <div className="foot min">{minText || "low"}</div>
      <div className="foot mid">medium</div>
      <div className="foot max">{maxText || "high"}</div>

      <div className="track" />
      <div
        className="left"
        style={{
          width: `calc(${pct}% * (100% - 16px) / 100% + 8px)`,
          pointerEvents: "none",
        }}
      />
      <div
        className="slider-tip"
        style={{
          left: `calc(8px + ${pct} * (100% - 16px) / 100 - 15px)`,
          pointerEvents: "none",
        }}
      >
        {value}
      </div>

      <input
        type="range"
        id={`${id}Range`}
        min={min}
        max={max}
        value={value}
        step="1"
        className="slider"
        disabled={disabled}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}

export default RazerSlider;
