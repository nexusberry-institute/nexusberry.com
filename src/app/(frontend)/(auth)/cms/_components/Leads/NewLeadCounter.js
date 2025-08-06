import React from 'react'
import { Alert, Space} from 'antd';
const NewLeadCounter = () => {
  return(
    <div>
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
  >
  <Alert
  message="10 New Leads"
  type="success"
  showIcon
/>
</Space>
</div>
);
}

export default NewLeadCounter