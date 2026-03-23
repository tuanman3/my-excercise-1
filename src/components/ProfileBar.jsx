import React, { useState, useRef } from "react";
import RazerDropdown from "./RazerDropdown";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { DOTS_ACTIONS } from "../constants/profiles";

function ProfileBar({
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
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const profileDropRef = useRef(null);

  return (
    <div className="profile-bar flex" style={{ position: "relative" }}>
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

      {/* DELETE CONFIRM POPUP */}
      {showDeleteModal && (
        <DeleteConfirmModal
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

export default ProfileBar;
