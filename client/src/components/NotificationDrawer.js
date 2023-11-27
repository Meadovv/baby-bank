import React, { useEffect, useState } from 'react';
import { FloatButton, Drawer, message, List, Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}


const NotificationDrawer = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [notificationList, setNotificationList] = useState({
        unread: 0,
        list: []
    })
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const markAsRead = async ( notificationId ) => {
        await axios.post('/api/v1/notification/mark-as-read',
        {
            notificationId: notificationId
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(!res.data.success) {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }

    const deleteNotification = async ( notificationId ) => {
        await axios.post('/api/v1/notification/delete-notification',
        {
            notificationId: notificationId
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }

    const getNotification = async () => {
        setLoading(true)
        await axios.post('/api/v1/notification/get-all-notification',
        {

        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                setNotificationList(res.data.notificationList)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
        setLoading(false)
    }

    useEffect(() => {
        getNotification()
    }, [])

    return (
        <>
            <FloatButton
                icon={<i className="fa-solid fa-bell"></i>}
                badge={{
                    count: notificationList.unread,
                    color: 'red',
                }}
                onClick={showDrawer}
                style={{
                    right: 94
                }}
            />
            {
                loading ? <></> :
                <Drawer title="Thông báo" placement="right" onClose={onClose} size='large' open={open}>
                    <List
                        pagination={{
                            position: 'bottom',
                            align: 'center',
                            pageSize: 10
                        }}
                        dataSource={notificationList.list}
                        renderItem={(item, index) => {

                            return (
                                <List.Item
                                    actions={[
                                        <Button type='primary' ghost onClick={() => {
                                            markAsRead(item._id)
                                            navigate(item.link)
                                        }} style={{
                                            display: item.link === null ? 'none' : ''
                                        }}>Xem chi tiết</Button>,
                                        <Button type='primary' ghost danger onClick={() => {
                                            deleteNotification(item._id)
                                            getNotification()
                                        }}>Xóa</Button>,
                                    ]}
                                >
                                    {
                                        item.status === 'unread' ?
                                        <Tag color="magenta">Chưa đọc</Tag> : 
                                        <Tag color="blue">Đã đọc</Tag>
                                    }
                                    <List.Item.Meta
                                        title={item.message}
                                        description={toDate(item.createDate)}
                                    />
                                </List.Item>
                            )
                        }}
                    />
                </Drawer>
            }
        </>
    )
}

export default NotificationDrawer