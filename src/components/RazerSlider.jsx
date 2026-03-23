import React from "react";

const THUMB_SIZE = 20;
const TIP_WIDTH = 30;

function RazerSlider({
  id,
  min,
  max,
  value,
  onChange,
  disabled,
  minText,
  maxText,
  SLIDER_WIDTH = 520,
}) {
  const percent = (value - min) / (max - min);
  const fillWidth = percent * (SLIDER_WIDTH - THUMB_SIZE) + 8;
  const tipLeft = percent * (SLIDER_WIDTH - THUMB_SIZE) - TIP_WIDTH / 2 + 8;

  return (
    <div
      className={`slider-container ${disabled ? "" : "on"}`}
      id={id}
      style={{ width: `${SLIDER_WIDTH}px` }}
    >
      <div className="foot min">{minText || "low"}</div>
      <div className="foot mid">medium</div>
      <div className="foot max">{maxText || "high"}</div>

      <div className="track" />
      <div className="left" style={{ width: `${fillWidth}px` }} />
      <div className="slider-tip" style={{ left: `${tipLeft}px` }}>
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
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default RazerSlider;
