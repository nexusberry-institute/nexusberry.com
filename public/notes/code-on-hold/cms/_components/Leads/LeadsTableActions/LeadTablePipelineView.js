import React from "react";
import { Card, Image, Row, Col, Alert } from "antd";

const Stages = [
  {
    value: "ONE_FOLLOW_UP",
    label: "1. FOLLOW UP",
  },
  {
    value: "TWO_INTERESTED_LOW",
    label: "2.1 INTERESTED LOW",
  },
  {
    value: "THREE_ATTENDED_DEMO",
    label: "3. ATTENDED DEMO",
  },
  {
    value: "FOUR_CONFIRMED_PAYING",
    label: "4. CONFIRMED PAYING",
  },
  {
    value: "FIVE_ADMITTED",
    label: "5. ADMITTED",
  },
];

const LeadTablePipeLineView = ({ stageWiseLeads }) => {
  // console.log("stageWiseLeads: ", stageWiseLeads);
  return (
    <Row style={{ display: "flex" }}>
      {Stages.map((stage) => {
        const leadsInStage = stageWiseLeads[stage.value] || [];
        return (
          <Card
            key={stage.value}
            type="inner"
            extra={<b style={{ fontSize: "13px" }}>{leadsInStage?.length}</b>}
            title={<b>{stage.label.split(" ")[1]}</b>}
            size="small"
            style={{
              width: 300,
              height: 400,
              marginTop: "8px",
              marginLeft: "20px",
              overflow: "auto",
            }}
          >
            {leadsInStage.length === 0 ? (
              <Alert message="No Lead Found" type="info" showIcon />
            ) : (
              leadsInStage.map((lead) => (
                <Card key={lead.id} size="small" style={{ marginTop: "2px" }}>
                  <Row align="middle">
                    <Col span={5} style={{ height: "38px", marginTop: "-5px" }}>
                      <Image
                        style={{ borderRadius: "50%" }}
                        height={40}
                        src="https://i.pinimg.com/280x280_RS/88/c4/0c/88c40ca2dc522623a98785ee7a650980.jpg"
                        alt="nexusberry-logo"
                      />
                      <Image
                        style={{
                          position: "relative",
                          left: "26px",
                          bottom: "20px",
                          borderRadius: "8px",
                        }}
                        alt={`image of ${lead.name}`}
                        height={16}
                        src={lead.sourceImg}
                      />
                    </Col>
                    <Col
                      span={19}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "40px",
                        width: 200,
                        marginTop: "-5px",
                      }}
                    >
                      <b style={{ textTransform: "capitalize" }}>{lead.name}</b>
                      <span>
                        <b
                          style={{
                            fontSize: "9px",
                            background: "rgb(245, 245, 245)",
                            padding: "4px",
                          }}
                        >
                          {stage.label.split(" ")[1]}
                        </b>
                        {/* <Tag
                  style={{
                    marginLeft: "15px",
                    // color: "black"
                  }}
                  bordered={false}
                  icon={<ClockCircleOutlined />}
                  color="#55acee"
                >
                  Upcoming
                </Tag> */}
                        <b
                          style={{
                            fontSize: "11px",
                            background: "rgb(245, 245, 245)",
                            padding: "4px",
                            marginLeft: "15px",
                          }}
                        >
                          2023-08-09
                        </b>
                      </span>
                    </Col>
                  </Row>
                </Card>
              ))
            )}
          </Card>
        );
      })}
    </Row>
  );
};

export default LeadTablePipeLineView;
