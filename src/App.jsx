import React, { useState } from "react";

import NavTabs from "./components/NavTabs";
import ProfileBar from "./components/ProfileBar";
import MicrophoneWidget from "./components/MicrophoneWidget";
import SidetoneWidget from "./components/SidetoneWidget";
import EnhancementsWidget from "./components/EnhancementsWidget";
import { useProfileManager } from "./hooks/useProfileManager";

function App() {
  // === MIC STATE ===
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSensiOn, setIsSensiOn] = useState(true);
  const [isSideOn, setIsSideOn] = useState(false);
  const [micVolume, setMicVolume] = useState(55);
  const [micSensitivity, setMicSensitivity] = useState(55);
  const [sidetone, setSidetone] = useState(50);

  // === ENHANCEMENT STATE ===
  const [enhancements, setEnhancements] = useState({
    norm: false,
    amb: false,
    clarity: false,
  });
  const [enhanceVolumes, setEnhanceVolumes] = useState({
    norm: 55,
    amb: 55,
    clarity: 55,
  });

  const toggleEnhancement = (type) =>
    setEnhancements((prev) => ({ ...prev, [type]: !prev[type] }));

  const updateEnhanceVolume = (type, value) =>
    setEnhanceVolumes((prev) => ({ ...prev, [type]: value }));

  // === PROFILE STATE ===
  const profile = useProfileManager();

  // === RENDER ===
  return (
    <div className="main-container">
      <NavTabs activeTab="mic" />

      <div className="body-wrapper scrollable">
        <ProfileBar
          profileOptions={profile.profileOptions}
          selectedProfile={profile.selectedProfile}
          setSelectedProfile={profile.setSelectedProfile}
          isRenaming={profile.isRenaming}
          renameValue={profile.renameValue}
          setRenameValue={profile.setRenameValue}
          renameInputRef={profile.renameInputRef}
          startRename={profile.startRename}
          commitRename={profile.commitRename}
          isDotsMenuOpen={profile.isDotsMenuOpen}
          setIsDotsMenuOpen={profile.setIsDotsMenuOpen}
          handleProfileAction={profile.handleProfileAction}
        />

        <div className="body-widgets flex">
          {/* MICROPHONE */}
          <div className="widget-col col-left flex">
            <MicrophoneWidget
              isMicOn={isMicOn}
              setIsMicOn={setIsMicOn}
              micVolume={micVolume}
              setMicVolume={setMicVolume}
              isSensiOn={isSensiOn}
              setIsSensiOn={setIsSensiOn}
              micSensitivity={micSensitivity}
              setMicSensitivity={setMicSensitivity}
            />
          </div>

          {/* SIDETONE - ENHANCEMENTS */}
          <div className="widget-col col-right flex">
            <SidetoneWidget
              isSideOn={isSideOn}
              setIsSideOn={setIsSideOn}
              sidetone={sidetone}
              setSidetone={setSidetone}
            />
            <EnhancementsWidget
              enhancements={enhancements}
              enhanceVolumes={enhanceVolumes}
              onToggle={toggleEnhancement}
              onVolumeChange={updateEnhanceVolume}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="name-bar">razer nari ultimate</div>
    </div>
  );
}

export default App;
