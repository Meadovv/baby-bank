import React, { useState } from 'react'
import { Button, Modal, Form, message, Input, Slider, Select } from 'antd'
import axios from 'axios'

const { TextArea } = Input

const RequestFormInModal = ({ post, open, onCreate, onCancel }) => {

    const [form] = Form.useForm()

    const initialValues = {
        request_type: 'cho_sua_hospital',
        value: 1000,
        message: 'Xin chào, tôi có thể gửi yêu cầu cho bệnh viện được không?'
    }

    return (
        <Modal
            open={open}
            title={`Gửi yêu cầu tới cho ${post?.ownerName}`}
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
                    label='Loại yêu cầu'
                    name='request_type'
                >
                    <Select
                        options={[
                            {
                                label: 'Cho sữa',
                                value: 'cho_sua_hospital'
                            },
                            {
                                label: 'Nhận sữa',
                                value: 'nhan_sua_hospital'
                            }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label='Lượng sữa'
                    name='value'
                >
                    <Slider
                        min={0}
                        max={2000}
                        step={10}
                    />
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

const RequestHospitalModal = ({ post }) => {

    const [open, setOpen] = useState(false)

    const onCreate = async (values) => {
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
                Yêu cầu
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

export default RequestHospitalModal