import { Form, Input, Button, Typography, Modal, Select, Spin } from "antd";
import { getWhatsAppLink } from "@cms/_settings/whatsapp";
import useGetMessagesApi from "@cms/_hooks/message/useGetMessagesApi";
import usePutLeadApi from "@cms/_hooks/leads/usePutLeadApi";
import { makeActivityJson } from "@cms/_lib/makeActivityJson";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SendWAModal = ({ show, setShow, lead = {}, messageLabel, message }) => {
  const {id, name, mobile, course, activity} = lead;
  const [form] = Form.useForm();
  
  const {messages, isLoading, error, isError,} = useGetMessagesApi(show);
  // console.log({messages, isLoading, error, isError,});

  const mutation = usePutLeadApi();

  const onFinish = (values) => {
    const {mobile, message} = values;
    window.open(getWhatsAppLink(mobile, message), "_blank");
    mutation.mutate(
      {
        id,
        data: {
          activity: makeActivityJson({
            activity,
            what: "WhatsApp",
            content:  `SendPreSavedMessageId: ${messages.find(m => m.value === message).id}`,
          }),
        },
      }
    );
    
    form.resetFields();
    setShow(false);
  };

  if(isLoading)
    return <Spin />
  else if(isError)
    return Modal.error({
      title: 'Error is loading messages',
      content: error.message,
    });;

  return (
    <Modal
      centered
      open={show}
      onCancel={() => setShow(false)}
      destroyOnClose={true}
      footer={[]}
    >
      <Title level={5}>WhatsApp: <u>{mobile}</u> ({name}) <br />{course && ("Course: " + course)}</Title>
      <Form 
        form = {form}
        onFinish={onFinish}
        initialValues={{mobile: mobile, message: message, messageLabel: messageLabel}}
      >
        <Form.Item 
          name="mobile" 
          label="Mobile" 
          rules={[
            {
              required: true,
              message: 'Please enter mobile!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item 
          name="messageLabel"
          label="Saved"
        >
          <Select 
            allowClear
            placeholder="Select a pre-saved message or type your own below"
            onChange={newMessage => form.setFieldsValue({message: newMessage})}
          >
           {
            messages?.map(m => <Option key={m.id} value={m.value}>{m.label}</Option>)
           }
           </Select>
        </Form.Item>
        
        <Form.Item
          name="message"
          label="Message"
          rules={[
            {
              required: true,
              message: 'Please type some message!',
            },
          ]}
        >
          <TextArea rows={10} />
        </Form.Item>

        <Button type="primary" htmlType="submit"> Send </Button> {" "}
        <Button htmlType="button" onClick={() => form.resetFields()}> Reset </Button>
      </Form>
    </Modal>
  );
};
export default SendWAModal;
