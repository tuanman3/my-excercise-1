import React from "react";

const TABS = [
  "sound",
  "mixer",
  "enhancement",
  "eq",
  "mic",
  "lighting",
  "power",
];

function NavTabs({ activeTab = "mic" }) {
  return (
    <div className="nav-tabs flex">
      <div className="nav arrow back"></div>
      <div className="nav arrow forward disabled"></div>
      {TABS.map((tab) => (
        <a
          key={tab}
          className={`nav ${tab === activeTab ? "active" : ""}`}
          href="#"
        >
          {tab}
        </a>
      ))}
      <div className="user">
        <div className="avatar"></div>
      </div>
    </div>
  );
}

export default NavTabs;
