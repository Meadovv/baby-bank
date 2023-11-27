import React, { useState } from 'react'
import { Button, Modal, Form, message, Input, Slider, Select } from 'antd'
import axios from 'axios'

const { TextArea } = Input

const options = [
    {
        label: 'Tiền',
        value: 'money_donation'
    },
    {
        label: 'Hiện vật',
        value: 'artifact_donation'
    }
]

const RequestFormInModal = ({ post, open, onCreate, onCancel }) => {

    const [form] = Form.useForm()

    const initialValues = {
        request_type: 'money_donation',
        message: 'Xin chào, tôi có thể ủng hộ cho tổ chức được không?'
    }

    return (
        <Modal
            open={open}
            title={`Ủng hộ cho ${post?.ownerName}`}
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
                    label='Loại ủng hộ'
                    name='request_type'
                >
                    <Select
                        options={options}
                    />
                </Form.Item>

                <Form.Item
                    label='Số lượng (hoặc Tên hiện vật) - Đơn vị: Ngàn đồng (hoặc Cái, Bộ, ...)'
                    name='value'
                >
                    <Input />
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

const DonationModal = ({ post }) => {

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
                Ủng hộ
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

export default DonationModal