import React, { useEffect } from "react";

function RazerDropdown({
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
}) {
  // Close dropdown when click outside; commit rename if renaming
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        isRenaming &&
        renameInputRef.current &&
        !renameInputRef.current.contains(event.target)
      ) {
        onRenameCommit();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropRef, setIsOpen, isRenaming, renameInputRef, onRenameCommit]);

  return (
    <div className="dropdown-area" ref={dropRef}>
      {/* Header */}
      <div
        id={id}
        className={`s3-dropdown ${isOpen ? "expand" : ""}`}
        onClick={isRenaming ? undefined : () => setIsOpen(!isOpen)}
      >
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

      {/* Options list */}
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
}

export default RazerDropdown;
