"use client";

import { ReactNode } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  showConfirmButton?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  showConfirmButton = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            {cancelText}
          </button>
          {showConfirmButton && (
            <button
              type="button"
              onClick={onConfirm}
              className={variant === "danger" ? "btn-danger" : "btn-warning"}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
