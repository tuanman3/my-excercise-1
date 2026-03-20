import React, { useState, useEffect, useRef } from "react";
// Nếu bạn có file CSS tổng, hãy import ở đây. Hoặc giữ link trong index.html cũng được.
// import './App.css';
// --- COMPONENT DROP_DOWN DÙNG CHUNG ---
// const CustomDropdown = ({
//   id,
//   options,
//   selected,
//   onSelect,
//   className,
//   isActionMenu = false,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropRef = useRef(null);

//   // Đóng menu khi click ra ngoài
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropRef.current && !dropRef.current.contains(e.target))
//         setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div
//       className={`dropdown-area ${className}`}
//       ref={dropRef}
//       style={{ position: "relative" }}
//     >
//       {/* Nút bấm trigger */}
//       <div
//         className={
//           isActionMenu
//             ? "dots3 hover-border"
//             : `s3-dropdown ${isOpen ? "expand" : ""}`
//         }
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {!isActionMenu && <div className="selected">{selected}</div>}
//         {!isActionMenu && <div className="icon expand"></div>}
//       </div>

//       {/* Danh sách options */}
//       <div
//         className={`s3-options flex ${isActionMenu ? "action-menu" : ""} ${isOpen ? "expand" : ""}`}
//       >
//         {options.map((opt, idx) => (
//           <div
//             key={idx}
//             className={`option ${opt === selected ? "selected" : ""}`}
//             onClick={() => {
//               onSelect(opt);
//               setIsOpen(false);
//             }}
//           >
//             {opt}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

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
    norm: 50,
    amb: 50,
    clarity: 50,
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

  const profileDropRef = useRef(null); // Để xử lý click ra ngoài đóng dropdown

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
  const RazerSlider = ({
    id,
    min,
    max,
    value,
    onChange,
    disabled,
    minText,
    maxText,
  }) => {
    const pct = ((value - min) / (max - min)) * 100;

    return (
      <div className={`slider-container ${disabled ? "" : "on"}`} id={id}>
        {/* Nhãn văn bản (logic chèn div min/max/mid) */}
        <div className="foot min">{minText || "low"}</div>
        <div className="foot mid">medium</div>
        <div className="foot max">{maxText || "high"}</div>

        {/* Thanh fill và track (logic chèn div fill/track) */}
        <div
          className="left"
          style={{
            width: disabled ? 0 : `${pct}%`,
            opacity: disabled ? 0 : 1,
            transition: "width .15s ease, opacity .3s ease",
            pointerEvents: "none",
          }}
        />
        <div className="track" style={{ pointerEvents: "none" }} />
        {/* Bong bóng tip (logic chèn div tip) */}
        <div
          className="slider-tip"
          style={{
            left: `calc(${pct}% - 15px)`,
            opacity: disabled ? 0 : 1, // ← fade khi disabled
            transition: "left .1s, opacity .3s ease",
          }}
        >
          {value}
        </div>

        {/* Input gốc */}
        <input
          type="range"
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
  };

  // 3. Component Dropdown (Logic từ dropdown.js)
  const RazerDropdown = ({
    id,
    options,
    selected,
    onSelect,
    isOpen,
    setIsOpen,
    dropRef,
  }) => {
    // Xử lý click ra ngoài để đóng
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [dropRef, setIsOpen]);

    return (
      <div className="dropdown-area" ref={dropRef}>
        <div
          id={id}
          className={`s3-dropdown ${isOpen ? "expand" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="selected">{selected}</div>
          <div className="icon expand"></div>
        </div>
        <div
          id={`${id}Opt`}
          className={`s3-options flex ${isOpen ? "expand" : ""}`}
          style={{
            // Thêm logic tính toán top/bottom nếu cần giống hệt toggleDropdown
            top: "27px",
            bottom: "unset",
          }}
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
    let newProfiles = [...profileOptions];

    switch (action) {
      case "Add": {
        const newName = `New Profile (${profileOptions.length})`;
        setProfileOptions([...profileOptions, newName]);
        setSelectedProfile(newName);
        break;
      }

      case "Duplicate": {
        const dupName = `${profileOptions} (Copy)`;
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
        const renamed = prompt("Enter new profile name:", selectedProfile);
        if (renamed) {
          newProfiles = profileOptions.map((p) =>
            p === selectedProfile ? renamed : p,
          );
          setProfileOptions(newProfiles);
          setSelectedProfile(renamed);
        }
        break;
      }

      default:
        break;
    }
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
          {/* <CustomDropdown
            options={profileOptions}
            selected={selectedProfile}
            onSelect={setSelectedProfile}
          />
          <CustomDropdown
            isActionMenu={true}
            options={[
              "Add",
              "Rename",
              "Duplicate",
              "Export",
              "Import",
              "Delete",
            ]}
            onSelect={(action) => handleProfileAction(action)}
          /> */}

          <RazerDropdown
            id="profileDrop"
            options={profileOptions}
            selected={selectedProfile}
            onSelect={handleProfileAction}
            isOpen={isProfileOpen}
            setIsOpen={setIsProfileOpen}
            dropRef={profileDropRef}
          />

          <div className="dots3 hover-border" id="profileMenuToggle"></div>
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
