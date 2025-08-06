import { Form, Input, Select, Collapse, Divider, DatePicker } from "antd";
import TextArea from 'antd/es/input/TextArea'
// custom
import CollapseComponsts from "../AddNewLead/CollapseComponsts";
// lib
import { leadStages } from "@cms/_lib/leadStages";
import { assignToOptions } from "@cms/_lib/assignToOptions";

const items = [
  {
    key: "1",
    label: "More Details",
    children: <p>{<CollapseComponsts />}</p>,
  },
];

const AddNewLeadForm = () => {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "name is required",
          },
        ]}
        hasFeedback
      >
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please enter name"
        />
      </Form.Item>

      <Form.Item
        label="Mobile"
        name="mobile"
      >
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please enter mobile"
        />
      </Form.Item>

      <Form.Item label="Email" name="email" hasFeedback>
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please Enter E-mail"
        />
      </Form.Item>

      <Form.Item
        label="Course"
        name="course"
      >
        <Select
          allowClear={true}
          size="small"
          options={[]}
        />
      </Form.Item>
      

      <Form.Item
        label="Stages"
        name="stage"
      >
        <Select
          allowClear={true}
          size="small"
          options={leadStages}
        />
      </Form.Item>

      <Form.Item
        label="payment Plan"
        name="paymentPlan"
        rules={[
          {
            required: false,
            message: "Payment: ",
          },
        ]}
        hasFeedback
      >
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please enter Payment Plan"
        />
      </Form.Item>
      <Divider />

      <strong>Notes</strong>
      <div style={{marginTop:"10px"}}>
    <Form.Item
    // label=""
     name="notes"
    >
    <TextArea
      size="small"
      placeholder="Staff Note"
      autoSize={{
        minRows: 1,
        maxRows: 3,
      }}
    />
    </Form.Item>  
    </div>
      <Divider />

      <strong>Reminder:</strong>
      <div style={{ marginTop: "10px" }}>
      <Form.Item
        label="Date"
        name="reminderDate"
      >
        <DatePicker size="small" style={{ width: "100%" }} allowClear={true} />
      </Form.Item>
      <Form.Item
        label="Reminder Note"
        name="reminderNote"
      >
        <TextArea
          size="small"
          placeholder="Reminder Note"
          autoSize={{
            minRows: 1,
            maxRows: 2,
          }}
        />
      </Form.Item>
    </div>
      <Divider />

      <Form.Item
        label="AssignTo"
        name="assignTo"
      >
        <Select
          allowClear={true}
          size="small"
          options={assignToOptions}
        />
      </Form.Item>

      <Form.Item
        label="Issue"
        name="issue"
      >
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="issue lead is facing"
        />
      </Form.Item>

      <Collapse
        style={{ width: "100%" }}
        items={items}
        defaultActiveKey={["1"]}
      />
    </>
  );
};

export default AddNewLeadForm;
