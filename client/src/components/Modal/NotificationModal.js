import React from 'react';
import { Modal, Button, Tag, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NotificationModal({ visible, onCancel, notificationList }) {
    const navigate = useNavigate();
    const modalFooter = [
        <Button key="cancel" size='large' onClick={onCancel}>
            Cancel
        </Button>
    ];

    const markNotification = async (notificationId) => {
        await axios.post('/api/v1/notification/mark-notification', {
            notificationId: notificationId
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
            } else {
                message.error(res.data.message)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const readNotification = async (notificationId) => {
        await axios.post('/api/v1/notification/read-notification', {
            notificationId: notificationId
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.data.success) {
                navigate(res.data.notification.link)
            } else {
                message.error(res.data.message)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const deleteNotification = async (notificationId) => {
        await axios.post('/api/v1/notification/delete-notification', {
            notificationId: notificationId
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
            } else {
                message.error(res.data.message)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <Modal
            forceRender
            open={visible}
            onCancel={onCancel}
            footer={modalFooter}
            title='Thông báo'
        >
            {
                notificationList && notificationList.map((notification, index) => {
                    return (
                        <div key={index} style={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            marginTop: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}>
                                <div>
                                    <Tag color={notification.status === 'read' ? 'blue' : 'red'}>{notification.status === 'read' ? 'Đã đọc' : 'Chưa đoc'}</Tag>
                                </div>
                                <div style={{
                                    fontSize: '1.2rem'
                                }}>
                                    {notification.message}
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    display: notification.appointmentId ? 'flex' : 'none'
                                }}>
                                    ID Cuộc hẹn: {notification.appointmentId}
                                </div>
                            </div>

                            <Space direction='horizontal' style={{
                                marginTop: '0.5rem'
                            }}>
                                <Button type='primary' ghost onClick={() => readNotification(notification._id)}>Chi tiết</Button>
                                <Button type='primary' ghost danger onClick={() => markNotification(notification._id)}>Đánh dấu</Button>
                                <Button type='primary' ghost onClick={() => deleteNotification(notification._id)}>Xóa</Button>
                            </Space>
                        </div>
                    )
                })
            }
        </Modal>
    )
}