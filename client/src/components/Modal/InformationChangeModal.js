import React, { useState } from 'react'
import { Button, Modal, Form, message, Input, Select, List } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const options = [
    {
        label: 'Công khai',
        value: 'public'
    },
    {
        label: 'Không công khai',
        value: 'private'
    }
]

const ReportFormInModal = ({ user, open, onCreate, onCancel }) => {

    const [addressList, setAddressList] = useState([])
    const [loading, setLoading] = useState(false)

    const handleAddressSearch = async (value) => {
        if (value === '') {
            setAddressList([])
            return
        }
        setLoading(true)
        await axios.post('/api/v1/geometry/get-geocoding',
            {
                locationName: value
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then((res) => {
                if (res.data.success) {
                    message.success(res.data.message)
                    setAddressList(res.data.dataSource)
                } else {
                    message.error(res.data.message)
                }
            }).catch((err) => {
                console.log(err)
                message.error(err.message)
            })
        setLoading(false)
    }

    const [form] = Form.useForm()

    const initialValues = {
        phone: user?.phone.value,
        email: user?.email.value,
        address: user?.location.address,
        lat: user?.location.lat,
        lng: user?.location.lng,
        phoneStatus: user?.phone.private ? options[1].value : options[0].value,
        emailStatus: user?.email.private ? options[1].value : options[0].value,
        addressStatus: user?.location.private ? options[1].value : options[0].value,
    }

    return (
        <Modal
            width={1000}
            open={open}
            title='Thay đổi thông tin'
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
                initialValues={initialValues}
                layout='vertical'
            >
                <Form.Item
                    label='Điện thoại'
                    name='phone'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'inline-block',
                        width: '70%',
                        padding: 5
                    }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label='Chế độ'
                    name='phoneStatus'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'inline-block',
                        width: '30%',
                        padding: 5
                    }}
                >
                    <Select options={options} />
                </Form.Item>

                <Form.Item
                    label='Email'
                    name='email'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'inline-block',
                        width: '70%',
                        padding: 5
                    }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label='Chế độ'
                    name='emailStatus'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'inline-block',
                        width: '30%',
                        padding: 5
                    }}
                >
                    <Select options={options} />
                </Form.Item>

                <Form.Item
                    label='Địa chỉ'
                    name='address'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'inline-block',
                        width: '70%',
                        padding: 5
                    }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label='Chế độ'
                    name='addressStatus'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'inline-block',
                        width: '30%',
                        padding: 5
                    }}
                >
                    <Select options={options} />
                </Form.Item>

                <Form.Item
                    label='Lat'
                    name='lat'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'none',
                        width: '50%',
                        padding: 5
                    }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label='Lng'
                    name='lng'
                    rules={[{ required: true, message: 'Cần có' }]}
                    style={{
                        display: 'none',
                        width: '50%',
                        padding: 5
                    }}
                >
                    <Input />
                </Form.Item>

                <Input.Search
                    placeholder='Địa chỉ'
                    allowClear
                    enterButton="Tìm kiếm"
                    onSearch={handleAddressSearch}
                    style={{
                        width: '100%',
                        padding: 5
                    }}
                />

                <List
                    loading={loading}
                    bordered
                    dataSource={addressList}
                    style={{
                        margin: 5
                    }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={() => {
                                        form.setFieldValue('address', item.name)
                                        form.setFieldValue('lat', item.geometry.lat)
                                        form.setFieldValue('lng', item.geometry.lng)
                                        setAddressList([])
                                    }}
                                >Chọn</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={item.name}
                            />
                        </List.Item>
                    )}
                />
            </Form>
        </Modal>
    )
}

const InformationChangeModal = ({ status }) => {

    const [open, setOpen] = useState(status)
    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)

    const onCreate = async (values) => {
        await axios.post('/api/v1/authentication/update-user-data',
            {
                value: values
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
        navigate(`/profile/${user._id}`)
    }

    const onCancel = () => {
        setOpen(false)
        navigate(`/profile/${user._id}`)
    }

    return (
        <>
            <Button type="primary" ghost onClick={() => {
                navigate(`/profile/${user._id}?action=change-information`)
                setOpen(true)
            }} size='large'>Chỉnh sửa</Button>
            <ReportFormInModal
                user={user}
                open={open}
                onCreate={onCreate}
                onCancel={onCancel}
            />
        </>
    )
}

export default InformationChangeModal