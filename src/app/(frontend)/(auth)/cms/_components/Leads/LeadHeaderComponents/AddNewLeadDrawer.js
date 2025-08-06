import React, { useState } from "react";
import { Button, Drawer, Form, Space, message, Spin } from "antd";
import { WhatsAppOutlined, PlusOutlined } from "@ant-design/icons";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
// custom
import AddNewLeadForm from "../AddNewLead/AddNewLeadForm";
import useShowStrapiError from "../../uiHooks/useShowStrapiError";
import { getWhatsAppLink } from "@cms/_settings/whatsapp";
// api
import usePostLeadApi from "@cms/_hooks/leads/usePostLeadApi";

dayjs.extend(customParseFormat);

const AddNewLeadDrawer = () => {
 const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { showErrModel, RenderErrModel } = useShowStrapiError();
  const mutation = usePostLeadApi();

  const onSave = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = form.getFieldValue();
          mutation.mutate(
            formData, // Use the form values to send data to the server
            {
              onSuccess: (data) => {
                message.success("Lead uploaded successfully!");
                form.resetFields(); // Reset form fields after successful submission
                // setOpen(false);
              },
              onError: (strapiError) => {
                showErrModel(strapiError);
              },
            }
          );
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const onSaveAndWhatsapp = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = form.getFieldValue();
          mutation.mutate(
            formData,
            {
              onSuccess: (data) => {
                message.success("Lead uploaded successfully!");
                form.resetFields();
                window.open(getWhatsAppLink(data.mobile, message), "_blank");
              },
              onError: (strapiError) => {
                showErrModel(strapiError);
              },
            }
          );
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <>
    <Button
      size="small"
      type="primary"
      icon={<PlusOutlined />}
      style={{ marginLeft: "7px" }}
      onClick={() => setOpen(true)}
    >
      Add New Lead
    </Button>

    <Drawer
      title="Create New Lead"
      width={420}
      onClose={() => setOpen(false)}
      open={open}
      styles={{body: {paddingBottom: 80}}}
      extra={
        <Space>
          <Button size="small" onClick={onSave} type="primary">
            Save
          </Button>
          <Button size="small" onClick={onSaveAndWhatsapp} type="primary">
            Save & Open
            <WhatsAppOutlined />
          </Button>
        </Space>
      }
    >
      <Spin spinning={mutation.isLoading}>
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 20 }}
          labelWrap={true}
          labelAlign="left"
        >
          <AddNewLeadForm />
        </Form>
      </Spin>

      <RenderErrModel />
    </Drawer>
    </>
  );
};
export default AddNewLeadDrawer;
