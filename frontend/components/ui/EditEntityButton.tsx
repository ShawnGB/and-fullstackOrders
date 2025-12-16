"use client";

import { useState, ReactNode } from "react";
import Modal from "./Modal";

interface EditEntityButtonProps {
  title: string;
  buttonText?: string;
  onOpen?: () => void | Promise<void>;
  children: (props: {
    onClose: () => void;
    onSuccess: () => void;
  }) => ReactNode;
}

export default function EditEntityButton({
  title,
  buttonText = "Edit",
  onOpen,
  children,
}: EditEntityButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = async () => {
    setIsModalOpen(true);
    if (onOpen) {
      await onOpen();
    }
  };

  const handleClose = () => setIsModalOpen(false);
  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="btn-primary" onClick={handleOpen}>
        {buttonText}
      </button>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={title}>
        {children({ onClose: handleClose, onSuccess: handleSuccess })}
      </Modal>
    </>
  );
}
