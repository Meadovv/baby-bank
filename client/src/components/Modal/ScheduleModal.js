import React, { useState } from 'react'
import { Button, Modal, Form, message, Input } from 'antd'
import axios from 'axios'

const { TextArea } = Input

const ScheduleFormInModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm()

    return (
        <Modal
            open={open}
            width={960}
            title='Xác nhận đặt lịch'
            okText='Xác nhận'
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
                    })
            }}
        >
            <Form
                form={form}
                layout='vertical'
            >
                <Form.Item
                    label='Địa điểm'
                    name='address'
                    rules={[{ required: true, message: 'Cần có' }]}
                >
                    <TextArea placeholder='Nhập địa điểm' />
                </Form.Item>

                <Form.Item
                    label='Thời gian'
                    name='time'
                    rules={[{ required: true, message: 'Cần có' }]}
                >
                    <TextArea placeholder='Nhập thời gian' />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const ScheduleModal = ({ curRequest }) => {

    const [open, setOpen] = useState(false)

    const onCreate = async (values) => {
        await axios.post('/api/v1/request/handle-request',
        {
            requestId: curRequest._id,
            status: 'approved',
            appointmentId: curRequest.appointmentId,
            data: values
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if (res.data.success) {
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

    return (
        <>
            <Button type="primary" ghost size='large' onClick={() => {setOpen(true)}}>Xác nhận đặt lịch</Button>
            <ScheduleFormInModal
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </>
    )
}

export default ScheduleModal