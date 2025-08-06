import { Form } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'

const StaffNoteAddNewLead = () => {

    
  return (
    <div style={{marginTop:"10px"}}>
    <Form.Item
    label="Staff"
     name={["note","text"]}
    >
    <TextArea
    size="small"
      placeholder="Staff Note"
      autoSize={{
        minRows: 1,
        maxRows: 2,
      }}
    />
    </Form.Item>  
    </div>
  )
}

export default StaffNoteAddNewLead