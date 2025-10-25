"use client"
import React, { useState } from 'react'
import SendWAModal from '@accounts/_components/content/SendWAModal';
import MessageTable from '@accounts/_components/content/MessageTable';
import MessageFilters from '@accounts/_components/content/MessageFilters';

const MessagePage = () => {
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
    <MessageFilters />
    <MessageTable onShowModel={handleShowModel} />
    <SendWAModal 
      show={show}
      setShow={setShow}
      message={selectedMessage} 
      />
    </>
    
  )
};

export default MessagePage