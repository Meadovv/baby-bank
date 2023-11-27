import React, { useState } from 'react'
import { Button, Modal, Form, message, Input } from 'antd'
import axios from 'axios'

const ReportFormModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm()

    return (
        <Modal
            open={open}
            width={960}
            title='Báo cáo'
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
                    label='Nội dung'
                    name='content'
                    rules={[{ required: true, message: 'Cần có' }]}
                >
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const ReportModal = ({ type, id }) => {

    const [open, setOpen] = useState(false)

    const onCreate = async (values) => {
        await axios.post('/api/v1/function/send-report',
            {
                question: values.content,
                to: id,
                type: type
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

    return (
        <>
            <Button type="primary" ghost size='large' onClick={() => {setOpen(true)}} danger>Báo cáo</Button>
            <ReportFormModal
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </>
    )
}

export default ReportModal