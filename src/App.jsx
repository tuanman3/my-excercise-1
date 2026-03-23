import React, { useState, useRef } from "react";

import RazerSwitch from "./components/RazerSwitch";
import RazerSlider from "./components/RazerSlider";
import RazerDropdown from "./components/RazerDropdown";
import { useProfileManager } from "./hooks/useProfileManager";
import { ENHANCEMENTS, DOTS_ACTIONS } from "./constants/profiles";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
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

  // === PROFILE STATE (from hook) ===
  const {
    profileOptions,
    selectedProfile,
    setSelectedProfile,
    isRenaming,
    renameValue,
    setRenameValue,
    renameInputRef,
    startRename,
    commitRename,
    isDotsMenuOpen,
    setIsDotsMenuOpen,
    handleProfileAction,
  } = useProfileManager();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropRef = useRef(null);
  const dotsMenuRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // === RENDER ===
  return (
    <div className="main-container">
      {/* NAV TABS */}
      <div className="nav-tabs flex">
        <div className="nav arrow back"></div>
        <div className="nav arrow forward disabled"></div>
        {[
          "sound",
          "mixer",
          "enhancement",
          "eq",
          "mic",
          "lighting",
          "power",
        ].map((tab) => (
          <a
            key={tab}
            className={`nav ${tab === "mic" ? "active" : ""}`}
            href="#"
          >
            {tab}
          </a>
        ))}
        <div className="user">
          <div className="avatar"></div>
        </div>
      </div>

      {/* BODY */}
      <div className="body-wrapper scrollable">
        {/* PROFILE BAR */}
        <div className="profile-bar flex">
          <div className="loader" tooltip="Syncing Profiles"></div>
          <div>profile</div>

          <RazerDropdown
            id="profileDrop"
            options={profileOptions}
            selected={selectedProfile}
            onSelect={setSelectedProfile}
            isOpen={isProfileOpen}
            setIsOpen={setIsProfileOpen}
            dropRef={profileDropRef}
            isRenaming={isRenaming}
            renameValue={renameValue}
            onRenameChange={setRenameValue}
            onRenameCommit={commitRename}
            renameInputRef={renameInputRef}
            startRename={startRename}
          />

          {/* DOTS MENU */}
          <div
            className={`dots3 hover-border ${isDotsMenuOpen ? "active" : ""}`}
            ref={dotsMenuRef}
            onClick={() => setIsDotsMenuOpen(!isDotsMenuOpen)}
          >
            {isDotsMenuOpen && (
              <div
                className="profile-action-menu show"
                style={{ animation: "menuFadeIn 0.15s ease forwards" }}
              >
                {DOTS_ACTIONS.map(({ label, divider }) => (
                  <React.Fragment key={label}>
                    <div
                      className="act action"
                      onClick={() => {
                        if (label === "Delete") {
                          setIsDotsMenuOpen(false);
                          setShowDeleteModal(true);
                        } else {
                          handleProfileAction(label);
                          setIsDotsMenuOpen(false);
                        }
                        setIsDotsMenuOpen(false);
                      }}
                    >
                      {label}
                    </div>
                    {divider && (
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#5d5d5d",
                          margin: "2px 8px",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <div className="obm hover-border" tooltip="On-board Profiles"></div>
          <div className="divider"></div>
          <div className="batt batt-30" tooltip="30% Battery"></div>
        </div>

        {/* WIDGETS */}
        <div className="body-widgets flex">
          {/* MICROPHONE */}
          <div className="widget-col col-left flex">
            <div className="widget" id="micPhone">
              <div className="help"></div>
              <div className="title">
                microphone
                <RazerSwitch
                  isOn={isMicOn}
                  onToggle={() => setIsMicOn(!isMicOn)}
                />
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
                Adjust this setting to remove unwanted background noise or
                increase the amount of mic output heard
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
          </div>

          {/* SIDETONE & ENHANCEMENTS */}
          <div className="widget-col col-right flex">
            {/* SIDETONE */}
            <div className="widget" id="micSidetone">
              <div className="help"></div>
              <div className="title">
                sidetone
                <RazerSwitch
                  isOn={isSideOn}
                  onToggle={() => setIsSideOn(!isSideOn)}
                />
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

            {/* ENHANCEMENTS */}
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
                      onChange={() => toggleEnhancement(type)}
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
                    onChange={(val) => updateEnhanceVolume(type, val)}
                    disabled={!enhancements[type]}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="name-bar">razer nari ultimate</div>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <DeleteConfirmModal
          profileName={selectedProfile}
          onConfirm={() => {
            handleProfileAction("Delete");
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default App;
