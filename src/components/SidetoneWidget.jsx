import React from "react";
import RazerSwitch from "./RazerSwitch";
import RazerSlider from "./RazerSlider";

function SidetoneWidget({ isSideOn, setIsSideOn, sidetone, setSidetone }) {
  return (
    <div className="widget" id="micSidetone">
      <div className="help"></div>
      <div class="tip">
        I'm just a tooltip. I'm just a tooltip. I'm just a tooltip. I'm just a
        tooltip. I'm just a tooltip.
      </div>
      <div className="title">
        sidetone
        <RazerSwitch isOn={isSideOn} onToggle={() => setIsSideOn(!isSideOn)} />
      </div>
      <RazerSlider
        id="slSide"
        min={0}
        max={100}
        value={sidetone}
        onChange={setSidetone}
        disabled={!isSideOn}
        minText="0"
        maxText="100"
      />
    </div>
  );
}

export default SidetoneWidget;
