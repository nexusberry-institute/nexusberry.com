import React from "react";
import { Modal } from "antd";

export default function useShowStrapiError() {
    const [isErrModalOpen, setIsErrModalOpen] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState('');
    const [title, setTitle] = React.useState("Server Error");

    const showErrModel = (strapiError, title) => {
        let msg;
        if (strapiError?.response?.data?.error) {
            msg = strapiError?.response?.data?.error?.message + ":\n" +
                JSON.stringify(strapiError?.response?.data?.error?.details, null, 2);
        }
        else if (strapiError?.message)
            msg = strapiError.message;
        else
            msg = "No Error message Available";

        setErrMsg(msg);
        if (title) setTitle(title);
        setIsErrModalOpen(true);
        console.error(msg);
    }

    const RenderErrModel = (props) => {
        const { open, error, title } = props;
        if (open) showErrModel(error, title);

        return (
            <Modal
                centered={true}
                title={title}
                open={isErrModalOpen}
                onOk={_ => setIsErrModalOpen(false)}
                onCancel={_ => setIsErrModalOpen(false)}
                style={{ color: "red" }}
            >
                <p>{errMsg}</p>
            </Modal>
        )
    }

    return { showErrModel, RenderErrModel }
}