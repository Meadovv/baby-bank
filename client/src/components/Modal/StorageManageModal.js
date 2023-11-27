import React, { useState } from 'react'
import { Button, Modal, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ReportFormInModal = ({ action, open, onCreate, onCancel }) => {

    const [form] = Form.useForm()

    return (
        <Modal
            open={open}
            title={action === 'push' ? 'Thêm sữa vào kho' : 'Lấy sữa ra khỏi kho'}
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
                    label={(action === 'push' ? 'Lượng sữa cần thêm' : 'Lượng sữa muốn lấy') + " (ml):"}
                    name='value'
                    rules={[{ required: true, message: 'Cần có' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const StorageManageModal = ({ action, onChange }) => {

    const { user } = useSelector(state => state.user)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const onCreate = async (values) => {
        onChange(action, values.value)
        setOpen(false)
    }

    return (
        <>
            <Button type="primary" ghost onClick={() => {
                setOpen(true)
            }} size='large' danger={action !== 'push'}>
                {
                    action === 'push' ? 'Thêm vào' : 'Lấy ra'
                }
            </Button>
            <ReportFormInModal
                action={action}
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </>
    )
}

export default StorageManageModal