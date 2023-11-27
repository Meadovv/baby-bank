import React, { useState } from 'react'
import { Button, Modal, Form, message, Input } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ReportFormInModal = ({ open, onCreate, onCancel }) => {

    const [form] = Form.useForm()

    return (
        <Modal
            open={open}
            title='Đổi mật khẩu'
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
                    label='Mật khẩu cũ'
                    name='old'
                    rules={[{ required: true, message: 'Cần có' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label='Mật khẩu mới'
                    name='new'
                    rules={[{ required: true, message: 'Cần có' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label='Xác nhận mật khẩu'
                    name='confirm'
                    rules={[{ required: true, message: 'Cần có' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const ChangePasswordModal = ({ status }) => {

    const { user } = useSelector(state => state.user)
    const [open, setOpen] = useState(status)
    const navigate = useNavigate()

    const onCreate = async (values) => {
        await axios.post('/api/v1/authentication/change-password',
            {
                old: values.old,
                new: values.new,
                confirm: values.confirm
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
        navigate(`/profile/${user?._id}`)
    }

    return (
        <>
            <Button type="primary" ghost onClick={() => {
                setOpen(true)
                navigate(`/profile/${user?._id}?action=change-password`)
            }} size='large' danger>Đổi mật khẩu</Button>
            <ReportFormInModal
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false)
                    navigate(`/profile/${user?._id}`)
                }}
            />
        </>
    )
}

export default ChangePasswordModal