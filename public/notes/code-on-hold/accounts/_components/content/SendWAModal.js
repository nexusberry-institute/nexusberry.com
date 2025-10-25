// import { useNavigate } from "react-router-dom";
// import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography, Modal } from "antd";
import settings from '@accounts/_settings';

const { Title, Text } = Typography;
const { TextArea } = Input;

const SendWAModal = ({ isModalOpen, onModelClose, selectedMessage }) => {
  // let navigate = useNavigate();
  // let navigate = useRouter();

  const onFinish = (values) => {
    const {mobile, message} = values;
    window.open(settings.waSendLink(mobile, message), "_blank");
    onModelClose();
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      onOk={onFinish}
      onCancel={onFinish}
    >
      <Title level={4}>Send WhatsApp Message</Title>
      <Form name="sendMessage" onFinish={onFinish}>
        <Form.Item name="mobile" label="Mobile">
          <Input />
        </Form.Item>
        <Form.Item
          name="message"
          label="Message"
          initialValue={selectedMessage}
        >
          <TextArea rows={6} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          <Text> Send </Text>
        </Button>
      </Form>
    </Modal>
  );
};
export default SendWAModal;
