import Layout from "../../components/Layout/Layout"
import PostList from "../../components/PostList/PostList"
import { Row, Col, Avatar, Space, Tag, Button, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import InformationChangeModal from "../../components/Modal/InformationChangeModal"
import ChangePasswordModal from "../../components/Modal/ChangePasswordModal"
import ReportModal from "../../components/Modal/ReportModal"

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const Account = () => {

    const navigate = useNavigate()
    const param = useParams()
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useSelector(state => state.user)
    const [curUser, setUser] = useState(null)

    const [postList, setPostList] = useState([])

    const [informationChangeModal, setInformationChangeModal] = useState(false)
    const [changePasswordModal, setChangePasswordModal] = useState(false)

    const getUser = async (userId) => {
        await axios.post('/api/v1/authentication/get-profile-data',
            {
                user: userId
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setUser(res.data.user)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const getPostList = async (userId) => {
        await axios.post('/api/v1/post/get-user-post',
            {
                limit: 6,
                user: userId
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setPostList(res.data.postList)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    useEffect(() => {
        getUser(param.profileId)
        getPostList(param.profileId)
        setInformationChangeModal(searchParams.get('action') === 'change-information')
        setChangePasswordModal(searchParams.get('action') === 'change-password')
    }, [param.profileId])


    const handleSeeMore = () => {
        navigate(`/post?userId=${curUser?._id}`)
    }

    return (
        <Layout>
            <Row
                style={{
                    height: '85vh',
                    margin: '0.5rem'
                }}
            >
                <Col
                    span={8}
                    style={{
                        padding: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <Avatar size={120} icon={<UserOutlined />} />
                        <div style={{
                            margin: 15,
                        }}>
                            <h2 style={{
                                fontSize: 30
                            }}>
                                {
                                    curUser?.name
                                }
                            </h2>
                            <hr style={{ border: '1px solid black', marginTop: 10 }} />
                            <Tag color="geekblue" style={{ fontSize: 20, height: 30, padding: 5, marginTop: 15, borderColor: 'blue' }}>
                            {
                                curUser?.mode === 'individual' ? 'Cá nhân' :
                                    curUser?.mode === 'hospital' ? 'Bệnh viện' : 
                                        curUser?.mode === 'organization' ? 'Tổ chức' : 'Quản trị viên'
                            }
                            </Tag>
                        </div>
                    </div>

                    <div style={{ 
                        margin: 20,
                    }}>
                        <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-hand fa-xl" /> Hành động</h2>
                        <Space direction='horizontal' style={{
                            margin: 10
                        }}>
                            {
                                curUser?._id === user?._id ?
                                    <>
                                        <Button type='primary' size='large' ghost onClick={() => { navigate('/create-post') }}>Đăng bài</Button>
                                        <InformationChangeModal status={informationChangeModal} />
                                        <ChangePasswordModal status={changePasswordModal} />
                                    </> :
                                    <>
                                        <Button type='primary' size='large' ghost>Liên hệ</Button>
                                        <ReportModal type='user' id={curUser?._id} />
                                    </>
                            }
                        </Space>
                    </div>

                    <div style={{ 
                        margin: 20,
                        display: curUser?._id === user?._id ? '' : 'none'
                    }}>
                        <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-bars-progress fa-xl" /> Quản lý</h2>
                        <Space direction='horizontal' style={{
                            margin: 10
                        }}>
                            <Button type='primary' size='large' ghost onClick={() => {
                                navigate('/manage-post')
                            }}>Bài đăng</Button>
                            <Button type='primary' size='large' ghost style={{
                                display: user?.mode === 'hospital' ? '' : 'none'
                            }} onClick={() => {
                                navigate('/manage-storage')
                            }}>Kho</Button>
                        </Space>
                    </div>

                    <div style={{
                        marginTop: 'auto'
                    }}>

                        <div style={{ margin: 20 }}>
                            <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-fingerprint fa-xl" /> ID</h2>
                            <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curUser?._id}</h3>
                        </div>

                        <div style={{ margin: 20 }}>
                            <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-phone fa-xl" /> Điện thoại</h2>
                            <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curUser?.phone.value}</h3>
                        </div>

                        <div style={{ margin: 20 }}>
                            <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-at fa-xl" /> Email</h2>
                            <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curUser?.email.value}</h3>
                        </div>

                        <div style={{ margin: 20 }}>
                            <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-location-dot fa-xl" /> Địa chỉ</h2>
                            <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curUser?.location.address}</h3>
                        </div>

                        <div style={{ margin: 20 }}>
                            <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-check fa-xl" /> Ngày đăng kí</h2>
                            <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{toDate(curUser?.createDate)}</h3>
                        </div>
                    </div>

                </Col>
                <Col
                    span={16}
                    style={{
                        padding: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <PostList posts={postList} columns={3} />
                    <Button type='primary' ghost style={{
                        margin: 20,
                        display: postList.length > 6 ? '' : 'none'
                    }} onClick={handleSeeMore} size='large'>Xem Thêm</Button>
                </Col>
            </Row>
        </Layout>
    )
}

export default Account