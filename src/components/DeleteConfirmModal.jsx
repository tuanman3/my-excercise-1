import React from "react";

function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">DELETE PROFILE</div>
        <div className="modal-body">
          You're about to delete this profile. All bindings in this profile will
          be deleted.
        </div>
        <button className="modal-btn-delete" onClick={onConfirm}>
          delete
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
