import React from 'react';
import { Typography, Table, Space } from 'antd';
import {WhatsAppOutlined} from '@ant-design/icons';
import { WhatsAppMessage } from '@accounts/_models/WhatsappMessage';

const { Paragraph, Text, Title } = Typography;

let data = WhatsAppMessage;

const MessageTable = (props) => {
    const {onShowModel} = props;

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
            render: (updatedAt, rowData) => {
                return (
                    <Space 
                        direction="vertical" 
                        size="small" 
                        align="start"
                    >
                        <Text>{updatedAt.split("T")[0]}</Text>
                        {rowData.type === "WHATSAPP" && (
                            <WhatsAppOutlined onClick={_ => onShowModel(rowData.content)}/>
                        )}
                    </Space>
                )
            }
        },
        {
            title: 'Message',
            dataIndex: 'content',
            key: 'content',
            render: (content, rowData) => (
            <>
            <Title level={5}>{rowData.title}</Title>
            <Paragraph copyable> {content} </Paragraph>
            </>)
        }
    ];

    return (
            <Table dataSource={data} columns={columns} size="small"/>
    )
}

export default MessageTable;