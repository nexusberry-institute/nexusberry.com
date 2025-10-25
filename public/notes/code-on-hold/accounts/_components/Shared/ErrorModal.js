"use client"
import React, { createContext, useEffect } from "react";
import { Modal } from "antd";

const ErrorModal = ({ error, message }) => {
  const [modal, contextHolder] = Modal.useModal();

  const config = {
    title: `${message}`,
  };

  // Show the modal when the 'error' prop is true
  useEffect(() => {
    if (error) {
      modal.error(config);
    }
  }, [error, modal]);

  return contextHolder;
};

export default ErrorModal;
