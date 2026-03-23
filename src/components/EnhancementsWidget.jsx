import React from "react";
import RazerSlider from "./RazerSlider";
import { ENHANCEMENTS } from "../constants/profiles";

function EnhancementsWidget({
  enhancements,
  enhanceVolumes,
  onToggle,
  onVolumeChange,
}) {
  return (
    <div className="widget" id="micEnhance">
      <div className="help"></div>
      <div className="title">enhancements</div>

      {ENHANCEMENTS.map(({ type, label }) => (
        <React.Fragment key={type}>
          <div className="check-item">
            <input
              type="checkbox"
              id={`check${type}`}
              checked={enhancements[type]}
              onChange={() => onToggle(type)}
            />
            <label htmlFor={`check${type}`} className="check-box">
              <div className="check-text">{label}</div>
            </label>
          </div>
          <RazerSlider
            id={`sl${type}`}
            SLIDER_WIDTH={490}
            min={10}
            max={100}
            value={enhanceVolumes[type]}
            onChange={(val) => onVolumeChange(type, val)}
            disabled={!enhancements[type]}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default EnhancementsWidget;
