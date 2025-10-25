import React from 'react';
import { Typography, Table, Space } from 'antd';
// import { WhatsAppOutlined } from '@ant-design/icons';
// import { WhatsAppMessage } from '@cms/_models/WhatsAppMessage';
import { formatDateTime } from '@/utilities/formatDateTime';

const { Paragraph, Text, Title } = Typography;


const MessageTable = (props) => {
    const { onShowModel, messages } = props;
    // let data = WhatsAppMessage;

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (id, rowData) => {
                return <Text mark={rowData.hasPlaceholder}>{id}</Text>
            }
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt, rowData) => <p>{formatDateTime(updatedAt)}</p>
        },
        {
            title: 'Message',
            dataIndex: 'content',
            key: 'content',
            render: (content, rowData) => (
                <>
                    <Title level={5}>{rowData.title}</Title>
                    <Paragraph copyable> {content} </Paragraph>
                </>
            )
        }
    ];

    return (
        <Table dataSource={messages} columns={columns} size="small" />
    )
}

export default MessageTable;