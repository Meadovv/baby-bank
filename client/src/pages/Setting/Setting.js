import Layout from "../../components/Layout/Layout";
import "./Setting.css";
import { Avatar, Menu, Button, Modal, Input, Select, message, Space } from "antd";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from "axios";

const menuItems = [
    {
        label: 'Cơ bản',
        key: 'basic'
    },
    {
        label: 'Bảo mật',
        key: 'security'
    },
    {
        label: 'Nâng cao',
        key: 'advanced'
    }
]

function ChangeInformationModal({ visible, onCancel, onOk, type }) {

    const field = type?.split('-')[0]
    const mode = type?.split('-')[1]
    const [value, setValue] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleGetLocation = () => {
        // Kiểm tra xem trình duyệt có hỗ trợ Geolocation không
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            // Hàm callback khi lấy được vị trí
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLoading(true)
              await axios.post('/api/v1/authentication/update-user-location',
              {
                lat: latitude,
                lng: longitude
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
              setLoading(false)
            },
            // Hàm callback khi không thể lấy được vị trí
            (error) => {
              message.error(error.message)
            }
          );
        } else {
          message.error('Trình duyệt không hỗ trợ Geolocation.')
        }
      };

    useEffect(() => {
        setValue(null)
    }, [field, mode])

    return (
        <Modal
            forceRender
            title={
                mode === 'value' ? 'Cập nhật thông tin' : 'Cập nhật quyền riêng tư'
            }
            open={visible}
            onCancel={onCancel}
            onOk={() => {
                onOk(field, {
                    type: mode,
                    value: value === null ? 'Chưa cập nhật' : value
                })
            }}
            okText='Cập nhật'
            cancelText='Hủy'
            okButtonProps={{
                type: 'primary',
                size: 'large'
            }}
            cancelButtonProps={{
                size: 'large',
                type: 'danger'
            }}
        >
            <div>
                <h4>
                    {
                        field === 'email' ? 'Địa chỉ Thư điện tử' : 
                            field === 'phone' ? 'Số điện thoại' : 
                                field === 'address' ? 'Địa chỉ' : 'Mật khẩu'
                    }
                </h4>
                {
                    mode === 'value' ? 
                    field === 'address' ? 
                    <Input.Search 
                        size='large' 
                        onChange={(e) => {
                            setValue(e.target.value)
                        }}
                        onSearch={() => handleGetLocation()}
                        loading={loading}
                    /> :
                    <Input size='large' onChange={(e) => {
                        setValue(e.target.value)
                    }} /> :
                    <Select style={{
                        width: '100%'
                    }} onChange={(value) => {
                        setValue(value)
                    }} placeholder='-- Chọn --' value={value}>
                        <Select.Option value='public'>Công khai</Select.Option>
                        <Select.Option value='private'>Riêng tư</Select.Option>
                    </Select>
                }
            </div>
        </Modal>
    )
}

export default function Setting() {

    const { user } = useSelector(state => state.user);
    const [currentMenu, setCurrentMenu] = useState(menuItems[0].key)
    const [modalVisible, setModalVisible] = useState(false)
    const [type, setType] = useState(null)
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()

    const userIcon = (user) => {
        if (user?.mode === 'individual') {
            return <i className="fa-solid fa-user"></i>
        }
        if (user?.mode === 'hospital') {
            return <i className="fa-solid fa-stethoscope"></i>
        }
        if (user?.mode === 'organization') {
            return <i className="fa-solid fa-house-medical-flag"></i>
        }

        return <i className="fa-solid fa-triangle-exclamation"></i>
    }

    const handleChangeInformation = async (action, value) => {
        await axios.post('/api/v1/authentication/update-user-data',
        {
            field: action,
            data: value
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
        setModalVisible(false)
    }

    useEffect(() => {
        const type = searchParams.get('type')
        if(searchParams.get('type') && menuItems.find(item => item.key === searchParams.get('type'))) setCurrentMenu(type)
        else navigate(`/setting?type=${menuItems[0].key}`)
    }, [searchParams, setSearchParams])

    return (
        <Layout>
            <ChangeInformationModal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false)
                }}
                onOk={handleChangeInformation}
                type={type}
            />
            <div className="overview-container">
                <div className="overview">
                    <div className="overview-sub-panel">
                        <Avatar
                            size={128}
                            icon={userIcon(user)}
                        />
                        <div className="account-name">{user?.name}</div>
                    </div>

                    <div className="overview-main-panel">
                        <Menu 
                            selectedKeys={[currentMenu]} 
                            mode='horizontal'
                            items={menuItems}
                            onClick={(e) => {
                                navigate(`/setting?type=${e.key}`)
                            }}
                        />

                        <div className="main-panel-content">
                            {
                                currentMenu === menuItems[0].key ? 
                                <div className="information-tab">

                                    <div className="tab">
                                        <div className="tab-title">
                                            Loại tài khoản
                                        </div>
                                        <div className="tab-content">
                                            {
                                                user?.mode === 'individual' ? 'Cá nhân' :
                                                    user?.mode === 'hospital' ? 'Bệnh viện' : 'Tổ chức'
                                            }
                                        </div>
                                    </div>

                                    <div className="tab">
                                        <div className="tab-title">
                                            Địa chỉ thư điện tử
                                        </div>
                                        <div className="tab-content">
                                            {
                                                user?.email.value
                                            }
                                        </div>
                                        <Button type='primary' size='large' style={{
                                            marginTop: '0.5rem'
                                        }} onClick={() => {
                                            setType('email-value')
                                            setModalVisible(true)
                                        }}>Cập nhật</Button>
                                    </div>

                                    <div className="tab">
                                        <div className="tab-title">
                                            Số điện thoại
                                        </div>
                                        <div className="tab-content">
                                            {
                                                user?.phone.value
                                            }
                                        </div>
                                        <Button type='primary' size='large' style={{
                                            marginTop: '0.5rem'
                                        }} onClick={() => {
                                            setType('phone-value')
                                            setModalVisible(true)
                                        }}>Cập nhật</Button>
                                    </div>

                                    <div className="tab">
                                        <div className="tab-title">
                                            Địa chỉ
                                        </div>
                                        <div className="tab-content">
                                            {
                                                user?.location.address
                                            }
                                        </div>
                                        <Button type='primary' size='large' style={{
                                            marginTop: '0.5rem'
                                        }} onClick={() => {
                                            setType('address-value')
                                            setModalVisible(true)
                                        }}>Cập nhật</Button>
                                    </div>
                                </div> :
                                currentMenu === menuItems[1].key ? 
                                <div className="security-tab">
                                    
                                    <div className="tab">
                                        <div className="tab-title">
                                            Địa chỉ thư điện tử
                                        </div>
                                        <div className="tab-content">
                                            {
                                                user?.email.private ? 'Riêng tư' : 'Công khai'
                                            }
                                        </div>
                                        <Button type='primary' size='large' style={{
                                            marginTop: '0.5rem'
                                        }} onClick={() => {
                                            setType('email-visible')
                                            setModalVisible(true)
                                        }}>Cập nhật</Button>
                                    </div>

                                    <div className="tab">
                                        <div className="tab-title">
                                            Số điện thoại
                                        </div>
                                        <div className="tab-content">
                                            {
                                                user?.phone.private ? 'Riêng tư' : 'Công khai'
                                            }
                                        </div>
                                        <Button type='primary' size='large' style={{
                                            marginTop: '0.5rem'
                                        }} onClick={() => {
                                            setType('phone-visible')
                                            setModalVisible(true)
                                        }}>Cập nhật</Button>
                                    </div>

                                    <div className="tab">
                                        <div className="tab-title">
                                            Địa chỉ
                                        </div>
                                        <div className="tab-content">
                                            {
                                                user?.location.private ? 'Riêng tư' : 'Công khai'
                                            }
                                        </div>
                                        <Button type='primary' size='large' style={{
                                            marginTop: '0.5rem'
                                        }} onClick={() => {
                                            setType('address-visible')
                                            setModalVisible(true)
                                        }}>Cập nhật</Button>
                                    </div>

                                    <div className="tab">
                                        <div className="tab-title">
                                            Mật khẩu
                                        </div>
                                        <Button type='primary' size='large' style={{
                                            marginTop: '0.5rem'
                                        }} onClick={() => {
                                            setType('password-value')
                                            setModalVisible(true)
                                        }}>Cập nhật</Button>
                                    </div>
                                </div> :
                                <Space direction="vertical">
                                    <Button type='primary' size='large' style={{
                                        marginTop: '0.5rem'
                                    }} onClick={() => {
                                        navigate('/manage/post')
                                    }}>Quản lý bài viết</Button>

                                    <Button type='primary' size='large' style={{
                                        display: user?.mode === 'individual' ? 'none' : 'block',
                                        marginTop: '0.5rem'
                                    }} onClick={() => {
                                        navigate('/manage/storage')
                                    }}>Quản lý kho</Button>

                                    <Button type='primary' size='large' style={{
                                        marginTop: '0.5rem'
                                    }} onClick={() => {
                                        navigate('/logout')
                                    }} danger>Đăng xuất</Button>
                                </Space>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}