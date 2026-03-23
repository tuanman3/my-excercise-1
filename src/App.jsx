import React, { useState, useEffect, useRef, useCallback } from "react";

function App() {
  // === STATE QUẢN LÝ UI ===
  // Trạng thái bật/tắt của các Switch
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSensiOn, setIsSensiOn] = useState(true);
  const [isSideOn, setIsSideOn] = useState(false);

  // Giá trị của các Slider
  const [micVolume, setMicVolume] = useState(55);
  const [micSensitivity, setMicSensitivity] = useState(55);
  const [sidetone, setSidetone] = useState(50);

  // Trạng thái cho Enhancements (Checkbox)
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

  // Trạng thái cho Dropdown Profile
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("default profile");
  const [profileOptions, setProfileOptions] = useState([
    "default profile",
    "profile 2",
    "profile 3",
    "profile 4",
    "profile 5",
    "profile 6",
    "profile 7",
    "profile 8",
  ]);

  // ✅ STATE MỚI CHO INLINE RENAME
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState(false);
  const dotsMenuRef = useRef(null);

  const profileDropRef = useRef(null); // Để xử lý click ra ngoài đóng dropdown

  // === INLINE RENAME LOGIC ===
  // Bắt đầu rename mode
  const startRename = useCallback(() => {
    setIsRenaming(true);
    setRenameValue(selectedProfile);
    // Focus input sau khi render
    setTimeout(() => {
      renameInputRef.current?.select();
    }, 0);
  }, [selectedProfile]);

  // Commit rename
  const commitRename = useCallback(() => {
    if (renameValue.trim() && renameValue !== selectedProfile) {
      // Update profile options
      const newProfiles = profileOptions.map((p) =>
        p === selectedProfile ? renameValue.trim() : p,
      );
      setProfileOptions(newProfiles);
      setSelectedProfile(renameValue.trim());
    }
    setIsRenaming(false);
    setRenameValue("");
  }, [renameValue, selectedProfile, profileOptions]);

  // Cancel rename
  const cancelRename = useCallback(() => {
    setIsRenaming(false);
    setRenameValue("");
  }, []);

  // Effect xử lý ESC/Enter key cho rename
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isRenaming) return;

      if (e.key === "Enter") {
        commitRename();
      } else if (e.key === "Escape") {
        cancelRename();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isRenaming, commitRename, cancelRename]);
  // === CÁC CUSTOM COMPONENT LOKAL ===

  // 1. Component Switch (Nút gạt)
  const RazerSwitch = ({ isOn, onToggle }) => (
    <div
      className={`switch switch-slider ${isOn ? "on" : ""}`}
      onClick={onToggle}
    >
      <div className="handle"></div>
    </div>
  );

  // 2. Component Slider (Thanh kéo) - Đã React-hóa logic từ slider.js
  const RazerSlider = useCallback(
    ({
      id,
      min,
      max,
      value,
      onChange,
      disabled,
      minText,
      maxText,
      SLIDER_WIDTH = 520, // Exact từ thiết kế (sau padding)
    }) => {
      const THUMB_SIZE = 20; // Thumb width
      const TIP_WIDTH = 30; // Tip width

      // ✅ CÔNG THỨC EXACT từ slider.js gốc
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
          <div
            className="left"
            style={{
              width: `${fillWidth}px`,
            }}
          />
          <div
            className="slider-tip"
            style={{
              left: `${tipLeft}px`,
            }}
          >
            {value}
          </div>

          {/* ✅ INPUT FULL POWER */}
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
    },
    [],
  );
  // 3. Component Dropdown (Logic từ dropdown.js)
  const RazerDropdown = ({
    id,
    options,
    selected,
    onSelect,
    isOpen,
    setIsOpen,
    dropRef,
    isRenaming,
    renameValue,
    onRenameChange,
    onRenameCommit,
    renameInputRef,
    startRename,
  }) => {
    // Xử lý click ra ngoài để đóng
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
          setIsOpen(false);
        }

        // Click outside rename input -> commit
        if (
          isRenaming &&
          renameInputRef.current &&
          !renameInputRef.current.contains(event.target)
        ) {
          onRenameCommit();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [dropRef, setIsOpen, isRenaming, renameInputRef, onRenameCommit]);

    return (
      <div className="dropdown-area" ref={dropRef}>
        <div
          id={id}
          className={`s3-dropdown ${isOpen ? "expand" : ""}`}
          onClick={isRenaming ? undefined : () => setIsOpen(!isOpen)}
        >
          {/* INLINE EDIT MODE */}
          {isRenaming ? (
            <input
              ref={renameInputRef}
              className="profile-rename-input"
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onBlur={onRenameCommit}
              autoFocus
              style={{
                zIndex: 100,
                position: "absolute",
                border: "1px solid #44d62c",
                boxSizing: "border-box",
                background: "#111",
                padding: "5px 6px",
                fontSize: "14px",
                lineHeight: "17px",
                color: "#ccc",
                height: "27px",
                width: "230px",
                outline: "none",
                marginLeft: "-6px",
                marginTop: "-5px",
              }}
            />
          ) : (
            <>
              <div className="selected" onDoubleClick={startRename}>
                {selected}
              </div>
              <div className="icon expand"></div>
            </>
          )}
        </div>

        {!isRenaming && (
          <div
            id={`${id}Opt`}
            className={`s3-options flex ${isOpen ? "expand" : ""}`}
            style={{ top: "27px", bottom: "unset" }}
          >
            {options.map((option) => (
              <div
                key={option}
                className={`option ${option === selected ? "selected" : ""}`}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // === HÀM XỬ LÝ SỰ KIỆN ===
  const toggleEnhancement = (type) => {
    setEnhancements((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const updateEnhanceVolume = (type, value) => {
    setEnhanceVolumes((prev) => ({ ...prev, [type]: value }));
  };

  // === RENDER CHÍNH (JSX) ===

  // --- LOGIC XỬ LÝ PROFILE (Dựa trên dropdown.js) ---

  const handleProfileAction = (action) => {
    // let newProfiles = [...profileOptions];

    switch (action) {
      case "Add": {
        const newName = `New Profile (${profileOptions.length})`;
        setProfileOptions([...profileOptions, newName]);
        setSelectedProfile(newName);
        break;
      }

      case "Duplicate": {
        let baseName = selectedProfile;
        let counter = 1;

        const open = baseName.lastIndexOf("(");
        const close = baseName.lastIndexOf(")");

        if (open > 0 && close > 0 && close > open) {
          const num = parseInt(baseName.substring(open + 1, close));
          if (!isNaN(num)) {
            counter = num + 1;
            baseName = baseName.substring(0, open).trimEnd();
          }
        }

        const dupName = `${baseName} (${counter})`;
        setProfileOptions([...profileOptions, dupName]);
        setSelectedProfile(dupName);
        break;
      }

      case "Delete": {
        if (profileOptions.length > 1) {
          const filtered = profileOptions.filter((p) => p !== selectedProfile);
          setProfileOptions(filtered);
          setSelectedProfile(filtered[0]);
        } else {
          alert("Cannot delete the last profile!");
        }
        break;
      }

      case "Rename": {
        startRename();
        break;
      }

      default:
        break;
    }
    setIsDotsMenuOpen(false);
  };
  return (
    <div className="main-container">
      {/* HEADER / NAV TABS */}
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

      {/* BODY WRAPPER */}
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
            onRenameCancel={cancelRename}
            renameInputRef={renameInputRef}
            startRename={startRename}
          />

          {/* ✅ DOTS3 MENU HOÀN CHỈNH */}
          <div
            className={`dots3 hover-border ${isDotsMenuOpen ? "active" : ""}`}
            ref={dotsMenuRef}
            onClick={() => setIsDotsMenuOpen(!isDotsMenuOpen)}
          >
            {/* ✅ MENU DROPDOWN */}
            {isDotsMenuOpen && (
              <div
                className="profile-action-menu show"
                style={{
                  animation: "menuFadeIn 0.15s ease forwards",
                }}
              >
                {[
                  { label: "Add" },
                  { label: "Import", divider: true },
                  { label: "Rename" },
                  { label: "Duplicate" },
                  { label: "Export", divider: true },
                  { label: "Delete" },
                ].map(({ label, divider }) => (
                  <React.Fragment key={label}>
                    <div
                      className="act action"
                      onClick={() => {
                        if (label === "Delete") {
                          if (window.confirm(`Delete "${selectedProfile}"?`)) {
                            handleProfileAction(label);
                          }
                        } else {
                          handleProfileAction(label);
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

          {/* <div className="dots3 hover-border" id="profileMenuToggle"></div> */}
          <div className="obm hover-border" tooltip="On-board Profiles"></div>
          <div className="divider"></div>
          <div className="batt batt-30" tooltip="30% Battery"></div>
        </div>

        {/* BODY WIDGETS */}
        <div className="body-widgets flex">
          {/* CỘT TRÁI - MICROPHONE */}
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

          {/* CỘT PHẢI - SIDETONE & ENHANCEMENTS */}
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

              {[
                { type: "norm", label: "Volume Normalization" },
                { type: "amb", label: "Ambient Noise Reduction" },
                { type: "clarity", label: "Voice Clarity" },
              ].map(({ type, label }) => (
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
    </div>
  );
}

export default App;
