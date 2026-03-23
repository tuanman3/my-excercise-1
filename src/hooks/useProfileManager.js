import { useState, useCallback, useEffect, useRef } from "react";
import { DEFAULT_PROFILES } from "../constants/profiles";

export function useProfileManager() {
  const [profileOptions, setProfileOptions] = useState(DEFAULT_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState(DEFAULT_PROFILES[0]);

  // Rename inline state
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  // Dots menu state
  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState(false);

  // === RENAME ===
  const startRename = useCallback(() => {
    setIsRenaming(true);
    setRenameValue(selectedProfile);
    setTimeout(() => {
      renameInputRef.current?.select();
    }, 0);
  }, [selectedProfile]);

  const commitRename = useCallback(() => {
    if (renameValue.trim() && renameValue !== selectedProfile) {
      setProfileOptions((prev) =>
        prev.map((p) => (p === selectedProfile ? renameValue.trim() : p)),
      );
      setSelectedProfile(renameValue.trim());
    }
    setIsRenaming(false);
    setRenameValue("");
  }, [renameValue, selectedProfile]);

  const cancelRename = useCallback(() => {
    setIsRenaming(false);
    setRenameValue("");
  }, []);

  // ESC / Enter key handler khi đang rename
  useEffect(() => {
    if (!isRenaming) return;
    const handleKeyDown = (e) => {
      if (e.key === "Enter") commitRename();
      if (e.key === "Escape") cancelRename();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isRenaming, commitRename, cancelRename]);

  // === PROFILE ACTIONS ===
  const handleProfileAction = useCallback(
    (action) => {
      switch (action) {
        case "Add": {
          const newName = `New Profile (${profileOptions.length})`;
          setProfileOptions((prev) => [...prev, newName]);
          setSelectedProfile(newName);
          break;
        }

        case "Rename": {
          startRename();
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
          setProfileOptions((prev) => [...prev, dupName]);
          setSelectedProfile(dupName);
          break;
        }

        case "Delete": {
          if (profileOptions.length > 1) {
            const filtered = profileOptions.filter(
              (p) => p !== selectedProfile,
            );
            setProfileOptions(filtered);
            setSelectedProfile(filtered[0]);
          } else {
            alert("Cannot delete the last profile!");
          }
          break;
        }

        case "Import":
        case "Export":
          // TODO: handle file import/export
          break;

        default:
          break;
      }

      setIsDotsMenuOpen(false);
    },
    [profileOptions, selectedProfile, startRename],
  );

  return {
    // Profile list
    profileOptions,
    selectedProfile,
    setSelectedProfile,
    // Rename
    isRenaming,
    renameValue,
    setRenameValue,
    renameInputRef,
    startRename,
    commitRename,
    cancelRename,
    // Dots menu
    isDotsMenuOpen,
    setIsDotsMenuOpen,
    // Actions
    handleProfileAction,
  };
}
