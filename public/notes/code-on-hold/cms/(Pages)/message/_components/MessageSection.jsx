"use client"
import React, { useState } from 'react'
import SendWAModal from '@cms/_components/content/SendWAModal';
import MessageTable from '@cms/_components/content/MessageTable';
// import MessageFilters from '@cms/_components/content/MessageFilters';

const MessageSection = ({ messages }) => {
  const [show, setShow] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleCloseModel = () => {
    setSelectedMessage("");
    setShow(false);
  }

  const handleShowModel = (message) => {
    setSelectedMessage(message);
    setShow(true);
  }

  return (
    <>
      {/* <MessageFilters /> */}
      <MessageTable
        onShowModel={handleShowModel}
        messages={messages}
      />
      <SendWAModal
        show={show}
        setShow={setShow}
        message={selectedMessage}
      />
    </>

  )
};

export default MessageSection