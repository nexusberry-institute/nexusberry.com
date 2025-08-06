import React, { useEffect } from "react";
import { Button, Drawer, Form, Space, message, Spin } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
// custom components
import AddNewLeadForm from "../AddNewLead/AddNewLeadForm";
import useShowStrapiError from "../../uiHooks/useShowStrapiError";
// api
import usePutLeadApi from "@cms/_hooks/leads/usePutLeadApi";

dayjs.extend(customParseFormat);

const EditLeadDetailDrawer = ({
  open,
  closeDrawer,
  lead,
}) => {
 
  const [form] = Form.useForm();
  const { showErrModel, RenderErrModel } = useShowStrapiError();
  const mutation = usePutLeadApi();

  useEffect(() => {
    form.setFieldsValue(lead);
  }, [form, lead]);

  const onLeadSave = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = form.getFieldValue();
          const id = lead.id;
          mutation.mutate(
            { id, data: { ...formData } },
            {
              onSuccess: (data) => {
                message.success("Updat Success!");
                // closeDrawer();
              },
              onError: (strapiError) => {
                showErrModel(strapiError);
              },
            }
          );
      })
      .catch((error) => {
        message.error(error.message);
        console.log(error);
      });
  };

  return (
    <Drawer
      title={`Edit Lead: ${lead.id}`}
      width={420}
      onClose={closeDrawer}
      open={open}
      styles={{body: {paddingBottom: 80}}}
      extra={
        <Space>
          <Button size="small" onClick={onLeadSave} type="primary">
            Save
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
  );
};
export default EditLeadDetailDrawer;
