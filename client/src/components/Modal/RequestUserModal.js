import React, { useState } from 'react'
import { Button, Modal, Form, message, Input, Slider } from 'antd'
import axios from 'axios'

const { TextArea } = Input

const RequestFormInModal = ({ post, open, onCreate, onCancel }) => {

    const [form] = Form.useForm()

    const initialValues = {
        value: post?.amount !== -1 ? post?.amount * 0.5 : '',
        message: 'Xin chào, tôi có thể đăng kí nhận từ bạn được không?'
    }

    return (
        <Modal
            open={open}
            title={`Gửi yêu cầu nhận cho ${post?.ownerName}`}
            okText='Gửi'
            cancelText='Đóng'
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields()
                        onCreate(values)
                    })
                    .catch((err) => {
                        console.log(err)
                        message.error('Lỗi không xác định')
                    })
            }}
        >
            <Form
                form={form}
                layout='vertical'
                initialValues={initialValues}
            >
                <Form.Item
                    label={post?.amount !== -1 ? 'Lượng sữa' : 'Tên đồ vật'}
                    name='value'
                >
                    {
                        post?.amount !== -1 ?
                            <Slider
                                min={0}
                                max={post?.amount}
                                step={10}
                            /> : <Input />
                    }
                </Form.Item>

                <Form.Item
                    label='Lời nhắn'
                    name='message'
                >
                    <TextArea placeholder='Nhập lời nhắn' />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const RequestUserModal = ({ post }) => {

    const [open, setOpen] = useState(false)

    const onCreate = async (values) => {
        values.request_type = 'nhan_sua_individual'
        
        await axios.post('/api/v1/request/send-request',
        {
            type: post?.mode,
            post: post?._id,
            to: post?.ownerId,
            data: values
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
        setOpen(false)
    }

    const openModal = () => {
        setOpen(true)
    }

    return (
        <>
            <Button 
                type="primary" 
                ghost
                size='large'
                onClick={() => {
                    openModal()
                }}
            >
                Đăng ký nhận
            </Button>
            <RequestFormInModal
                post={post}
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </>
    )
}

export default RequestUserModal