import Layout from "../../components/Layout/Layout";
import PostList from "../../components/PostList/PostList";
import { useSelector } from "react-redux";
import "./Profile.css";
import { Avatar, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RequestModal from "../../components/Modal/RequestModal";

export default function Profile() {

    const { user } = useSelector(state => state.user);
    const { profileId } = useParams();
    const [currentUser, setUser] = useState(null)
    const [postList, setPostList] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

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
        setLoading(true)
        getUser(profileId);
        getPostList(profileId)
        setLoading(false)
    }, [profileId])

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
        if (user?.mode === 'admin') {
            return <i className="fa-solid fa-screwdriver-wrench"></i>
        }
        return <i className="fa-solid fa-triangle-exclamation"></i>
    }


    return (
        <Layout>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100%',
            }}>
                <div className="account-panel-container">
                    <div className="account-panel">
                        <div className="account-sub-panel">
                            <Avatar
                                size={128}
                                icon={userIcon(currentUser)}
                            />
                            <div className="account-name">{currentUser?.name}</div>
                            <div className="account-tag">
                                {currentUser?.mode === 'individual' ? 'Cá nhân' : currentUser?.mode === 'hospital' ? 'Bệnh viện' : currentUser?.mode === 'admin' ? 'Quản trị viên' : 'Tổ chức'}
                            </div>
                            <div className="account-setting-container">
                                <Button type='primary' size='large' style={{
                                    display: currentUser?._id === user?._id ? 'none' : 'block',
                                    marginRight: 10,
                                }} onClick={() => navigate(`/chat/${currentUser?._id}`)}>Nhắn tin</Button>
                                <Button type='primary' size='large' onClick={() => {
                                    navigate('/setting')
                                }} style={{
                                    display: currentUser?._id === user?._id ? 'block' : 'none'
                                }}>
                                    Chỉnh sửa thông tin
                                </Button>
                                <RequestModal amount={-1} mode={currentUser?.mode} userId={currentUser?._id} postId={null} />
                            </div>
                        </div>

                        <div className="account-main-panel">
                            <h1>Thông tin tài khoản</h1>
                            <hr className="line" />
                            <div className="account-information-tab">
                                <div className="information-tab-title">
                                    Địa chỉ thư điện tử
                                </div>
                                <div className="information-tab-content">
                                    {
                                        currentUser?._id === user?._id ? currentUser?.email.value : 
                                            !currentUser?.email.private ? currentUser?.email.value : 'Chưa cập nhật'
                                    }
                                </div>
                            </div>

                            <div className="account-information-tab">
                                <div className="information-tab-title">
                                    Số điện thoại
                                </div>
                                <div className="information-tab-content">
                                    {
                                        currentUser?._id === user?._id ? currentUser?.phone.value :     
                                            !currentUser?.phone.private ? currentUser?.phone.value : 'Chưa cập nhật'
                                    }
                                </div>
                            </div>

                            <div className="account-information-tab">
                                <div className="information-tab-title">
                                    Địa chỉ
                                </div>
                                <div className="information-tab-content">
                                    {
                                        currentUser?._id === user?._id ? currentUser?.location.address : 
                                            !currentUser?.location.private ? currentUser?.location.address : 'Chưa cập nhật'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="post-container">
                    <h1>Danh sách bài đăng</h1>
                    <hr className="line" />
                </div>

                <div className="user-post-container">
                    <PostList posts={postList} type='post' loading={loading}/>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <Button type="primary" size="large" onClick={() => {
                        navigate(`/explore?type=all&userId=${currentUser?._id}`)
                    }}>Xem thêm</Button>
                </div>
            </div>
        </Layout>
    )
}