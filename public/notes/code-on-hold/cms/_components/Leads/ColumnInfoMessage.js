import React from "react";
import { Tooltip, Typography, Space } from "antd";
import { MailOutlined, WhatsAppOutlined, MessageOutlined, PhoneOutlined} from "@ant-design/icons";
import SendWAModal from "../content/SendWAModal";
import { getWhatsAppLink } from "@cms/_settings/whatsapp";
import usePutLeadApi from "@cms/_hooks/leads/usePutLeadApi";
import { makeActivityJson } from "@cms/_lib/makeActivityJson";

const {Text, Link} = Typography;

function ColumnInfoMessage(props) {
  const {id, name, mobile, query, education, email, gender, isOnline, isReqHostel, activity, jobInfo, area} 
    = props.rowData;
  const [showWAModel, setShowWAModel] = React.useState(false);
  
  const updateLeadMutation = usePutLeadApi();

  const handlePutActivity = (what, content) => () => {
    updateLeadMutation.mutate(
      {
        id,
        data: {
          activity: makeActivityJson({ activity, what, content}),
        },
      }
    );
  }

  return (
    <Tooltip
          placement="right"
          title={
            <span>
              query: {query} <hr />
              education: {education}<hr />
              email: {email}<hr />
              gender: {gender === null ? "" : (gender ? "Male" : "Female")}<hr />
              online: {isOnline === null ? "" : (isOnline ? "yes" : "no")}<hr />
              Hostel: {isReqHostel === null ? "" : (isReqHostel ? "yes" : "no")}<hr />
              Job info: {jobInfo}<hr />
              Area: {area}
            </span>
          }
          color="blue"
        >
          <Space.Compact direction="vertical">
            <Text strong copyable>{mobile || "mobile?"}</Text>
            <Text>{name || "name?"}</Text>
            
            <Space direction="horizontal">
              {mobile && ( <>
                <Link href={getWhatsAppLink(mobile)} target="_blank">
                  <WhatsAppOutlined className="hoverable" onClick={handlePutActivity("whatsApp", "OpenChat")}/>
                </Link>

                <MessageOutlined className="hoverable" onClick={() => setShowWAModel(true)}/>

                <Link href={`tel:+${mobile}`}> 
                  <PhoneOutlined rotate="90" className="hoverable" onClick={handlePutActivity("Call", "ClickCall")}/>
                </Link>
              </>)}

              {email && (
                <Link href={"mailto:" + email}>
                  <MailOutlined className="hoverable" onClick={handlePutActivity("Email", "OpenSendEmail")}/>
                </Link>
              )}
            </Space>
            {query && (
              <Text type="secondary">
                {query.length > 30 ? query.slice(0, 25) + ".." : query}
              </Text>
          )}
          </Space.Compact>

          <SendWAModal 
            show={showWAModel}
            setShow={setShowWAModel}
            lead={props.rowData}
          />
        </Tooltip>
  );
}

export default ColumnInfoMessage;