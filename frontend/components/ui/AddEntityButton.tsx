"use client";

import { useState, ReactNode } from "react";
import Modal from "./Modal";

interface AddEntityButtonProps {
  title: string;
  buttonTitle?: string;
  children: (props: {
    onClose: () => void;
    onSuccess: () => void;
  }) => ReactNode;
}

export default function AddEntityButton({
  title,
  buttonTitle = "Create new entity",
  children,
}: AddEntityButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => setIsModalOpen(false);
  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="btn-add"
        onClick={() => setIsModalOpen(true)}
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
