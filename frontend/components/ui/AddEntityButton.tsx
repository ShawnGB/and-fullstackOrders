"use client";

import { useState, ReactNode } from "react";
import Modal from "./Modal";

interface AddEntityButtonProps {
  title: string;
  buttonTitle?: string;
  onOpen?: () => void | Promise<void>;
  children: (props: {
    onClose: () => void;
    onSuccess: () => void;
  }) => ReactNode;
}

export default function AddEntityButton({
  title,
  buttonTitle = "Create new entity",
  onOpen,
  children,
}: AddEntityButtonProps) {
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
      <button
        className="btn-add"
        onClick={handleOpen}
        title={buttonTitle}
      >
        +
      </button>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={title}>
        {children({ onClose: handleClose, onSuccess: handleSuccess })}
      </Modal>
    </>
  );
}
