import React from 'react';
import { Modal } from 'antd';

export default function NotificationModal({ visible, onCancel, onOK }) {
    return (
        <Modal
            open={visible}
            onOK={onOK}
            onCancel={onCancel}
            title={'Thông báo'}
        >

        </Modal>
    )
}