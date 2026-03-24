import React from "react";
import RazerSwitch from "./RazerSwitch";
import RazerSlider from "./RazerSlider";

function MicrophoneWidget({
  isMicOn,
  setIsMicOn,
  micVolume,
  setMicVolume,
  isSensiOn,
  setIsSensiOn,
  micSensitivity,
  setMicSensitivity,
}) {
  return (
    <div className="widget" id="micPhone">
      <div className="help"></div>
      <div class="tip">
        I'm just a tooltip. I'm just a tooltip. I'm just a tooltip. I'm just a
        tooltip. I'm just a tooltip.
      </div>
      <div className="title">
        microphone
        <RazerSwitch isOn={isMicOn} onToggle={() => setIsMicOn(!isMicOn)} />
      </div>

      <div className="h2-title">mic volume</div>
      <RazerSlider
        id="slPhone"
        min={10}
        max={100}
        value={micVolume}
        onChange={setMicVolume}
        disabled={!isMicOn}
      />

      <div className="h2-title mt20">
        mic sensitivity
        <RazerSwitch
          isOn={isSensiOn}
          onToggle={() => setIsSensiOn(!isSensiOn)}
        />
      </div>
      <div className="h2-body">
        Adjust this setting to remove unwanted background noise or increase the
        amount of mic output heard
      </div>
      <RazerSlider
        id="slSensi"
        min={10}
        max={100}
        value={micSensitivity}
        onChange={setMicSensitivity}
        disabled={!isSensiOn}
      />
    </div>
  );
}

export default MicrophoneWidget;
