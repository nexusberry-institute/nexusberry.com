import React from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import {
  Select,
  Spin,
  message,
  Form,
  Input,
  Space,
  Tag,
  Row,
  Col,
  Switch,
  Tooltip,
} from "antd";
// lib
import { leadStages } from "@cms/_lib/leadStages";
import { interestLevels } from "@cms/_lib/interestLevels";
import { makeActivityJson } from "@cms/_lib/makeActivityJson";
//api
import usePutLeadApi from "@cms/_hooks/leads/usePutLeadApi";
// import useShowStrapiError from "../uiHooks/useShowStrapiError";

// Interest Level | Stage | Payment Plan column
function ColumnStagePaymentPlan(props) {
  const { id, stage, paymentPlan, activity, interestLevel, unreachable } =
    props.rowData;
  const [selectedStage, setSelectedStage] = React.useState(stage);
  const navigate = useRouter();
  const updateLeadMutation = usePutLeadApi();
  // const { showErrModel, RenderErrModel } = useShowStrapiError();

  const handleStageUpdate = (newStage) => {
    setSelectedStage(newStage);
    updateLeadMutation.mutate(
      {
        id,
        data: {
          stage: newStage,
          activity: makeActivityJson({
            activity,
            what: "stage",
            content: newStage,
          }),
        },
      },
      {
        onSuccess: (strapi) => {
          if (strapi?.data.attributes?.stage === "Admission") {
            const data = { id: strapi.data.id, ...strapi.data.attributes };
            let path = `/admission?id=${id}&`;
            if (data.name) path += `name=${data.name}&`;
            // data.name && (path += `name=${data.name}&`);
            if (data.mobile) path += `mobile=${data.mobile}&`;
            // data.mobile && (path += `mobile=${data.mobile}&`);
            if (data.email) path += `email=${data.email}&`;
            // data.email && (path += `email=${data.email}&`);
            if (data.city) path += `city=${data.city}`;
            // data.city && (path += `city=${data.city}`);
            navigate(path);
          }
          message.success("Updated sucess!");
        },
        onError: (_) => {
          setSelectedStage(stage);
          message.success("Updated sucess!");
        },
      }
    );
  };

  const handlePaymentPlanUpdate = (newPaymentPlan) => {
    updateLeadMutation.mutate(
      {
        id,
        data: {
          paymentPlan: newPaymentPlan,
          activity: makeActivityJson({
            activity,
            what: "paymentPlan",
            content: newPaymentPlan,
          }),
        },
      },
      {
        onSuccess: (_) => message.success("Updat sucess!"),
        onError: (error) => message.error(error.message),
      }
    );
  };

  const handleInterestUpdate = (newInterest) => () => {
    updateLeadMutation.mutate(
      {
        id,
        data: {
          interestLevel: newInterest,
          activity: makeActivityJson({
            activity,
            what: "Interest",
            content: newInterest,
          }),
        },
      },
      {
        onSuccess: (_) => message.success("Updat sucess!"),
        onError: (error) => message.error(error.message),
      }
    );
  };

  const handleUnreachableUpdate = (checked) => {
    updateLeadMutation.mutate(
      {
        id,
        data: {
          unreachable: checked,
          activity: makeActivityJson({
            activity,
            what: "unreachable",
            content: unreachable,
          }),
        },
      },
      {
        onSuccess: (_) => message.success("Updat sucess!"),
        onError: (error) => message.error(error.message),
      }
    );
  };

  return (
    <Spin spinning={updateLeadMutation.isLoading}>
      <Row justify="space-between">
        <Col>
          <Tag.CheckableTag
            style={
              interestLevels[0].level === interestLevel
                ? { backgroundColor: interestLevels[0].color }
                : {}
            }
            onClick={handleInterestUpdate(interestLevels[0].level)}
            checked={interestLevels[0].level === interestLevel}
          >
            {interestLevels[0].level}
          </Tag.CheckableTag>
        </Col>
        <Col>
          <Tooltip
            title={
              unreachable
                ? "Lead is currently Unreachable"
                : "unreachable status"
            }
          >
            <Switch
              size="small"
              value={unreachable}
              onChange={handleUnreachableUpdate}
            />
          </Tooltip>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col>
          <Tag.CheckableTag
            style={
              interestLevels[1].level === interestLevel
                ? { backgroundColor: interestLevels[1].color }
                : {}
            }
            onClick={handleInterestUpdate(interestLevels[1].level)}
            checked={interestLevels[1].level === interestLevel}
          >
            {interestLevels[1].level}
          </Tag.CheckableTag>
        </Col>
        <Col>
          <Tag.CheckableTag
            style={
              interestLevels[2].level === interestLevel
                ? { backgroundColor: interestLevels[2].color }
                : {}
            }
            onClick={handleInterestUpdate(interestLevels[2].level)}
            checked={interestLevels[2].level === interestLevel}
          >
            {interestLevels[2].level}
          </Tag.CheckableTag>
        </Col>
        <Col>
          <Tag.CheckableTag
            style={
              interestLevels[3].level === interestLevel
                ? { backgroundColor: interestLevels[3].color }
                : {}
            }
            onClick={handleInterestUpdate(interestLevels[3].level)}
            checked={interestLevels[3].level === interestLevel}
          >
            {interestLevels[3].level}
          </Tag.CheckableTag>
        </Col>
      </Row>

      <Space.Compact direction="vertical">
        <Select
          size="small"
          value={selectedStage}
          onChange={handleStageUpdate}
          options={leadStages}
        />

        <Form
          size="larger"
          layout="inline"
          initialValues={{ paymentPlan: paymentPlan }}
          onFinish={(values) => handlePaymentPlanUpdate(values.paymentPlan)}
        >
          <Form.Item name="paymentPlan">
            <Input placeholder="Payment Plan" variant="borderless" />
          </Form.Item>
        </Form>
      </Space.Compact>
    </Spin>
  );
}

export default ColumnStagePaymentPlan;
