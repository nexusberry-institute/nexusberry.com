import {
  TableOutlined,
  MenuOutlined,
  ControlOutlined,
} from "@ant-design/icons";
import { Button, Row, Col } from "antd";

const LeadsTableActions = ({ actions, handleActionsChange }) => {
  const handleShowAndHideFiltes = () => {
    const name = "isFiltersHidden";

    if (!actions.isFiltersHidden) {
      handleActionsChange({ name, value: true });
    } else {
      handleActionsChange({ name, value: false });
    }
  };

  const getButtonText = () => {
    if (actions.isFiltersHidden) {
      return "Show filters";
    } else {
      return "Hide filters";
    }
  };

  const handleViewChange = ({ name, value }) => {
    handleActionsChange({ name, value });
  };

  return (
    <Row
      align="middle"
      style={{
        background: "white",
        width: "100%",
        height: "30px",
        marginTop: "10px",
        paddingTop: "10px",
        // paddingLeft:"8px"
      }}
    >
      <Col span={2} style={{ marginTop: "-10px" }}>
        <Button
          type="text"
          icon={<MenuOutlined rotate={90} />}
          onClick={() =>
            handleViewChange({ name: "isTableView", value: false })
          }
        >
          Pipeline View
        </Button>
      </Col>
      <Col span={1} style={{ marginTop: "-10px", marginLeft: "30px" }}>
        <Button
          size="small"
          onClick={() => handleViewChange({ name: "isTableView", value: true })}
          icon={<TableOutlined />}
          type="text"
        >
          Table View
        </Button>
      </Col>
      <Col span={1} offset={18} style={{ marginTop: "-10px" }}>
        <Button
          size="small"
          onClick={handleShowAndHideFiltes}
          icon={<ControlOutlined rotate={90} />}
          type="text"
        >
          {getButtonText()}
        </Button>
      </Col>
    </Row>
  );
};

export default LeadsTableActions;
