import {
    Avatar,
    Tag,
    Space,
    Button,
    message
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import RequestUserModal from '../Modal/RequestUserModal'
import { useSelector } from 'react-redux'
import RequestHospitalModal from '../Modal/RequestHospitalModal'
import DonationModal from '../Modal/DonationModal'
import axios from 'axios'
import ReportModal from '../Modal/ReportModal'

const distance = (userLat, userLng, postLat, postLng) => {
    const userRadianLat = userLat * 0.01745329252
    const userRadiantLng = userLng * 0.01745329252
    const postRadiantLat = postLat * 0.01745329252
    const postRadiantLng = postLng * 0.01745329252

    const distance = (6378 * Math.acos(Math.sin(userRadianLat) * Math.sin(postRadiantLat) + Math.cos(userRadianLat) * Math.cos(postRadiantLat) * Math.cos(postRadiantLng - userRadiantLng)))
    if (isNaN(distance)) {
        return 0
    } else return Math.round(distance)
}

const InformationCard = ({ allowAction, post }) => {

    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)

    const deletePost = async () => {
        await axios.post('/api/v1/post/delete-post',
            {
                postId: post._id
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    message.success(res.data.message)
                    navigate('/manage-post')
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Avatar size={120} icon={<UserOutlined />} style={{
                    margin: 10
                }} />
                <h2 style={{
                    cursor: 'pointer'
                }} onClick={() => {
                    navigate(`/profile/${post?.ownerId}`)
                }}>{post?.ownerName}</h2>
                <Tag color="geekblue" style={{ fontSize: 20, height: 30, padding: 5, margin: 10, borderColor: 'blue' }}>
                    {
                        post.mode === "individual" ? "Người dùng" :
                            post.mode === "organization" ? "Tổ chức" :
                                post.mode === "hospital" ? "Bệnh viện" : "Quản trị viên"
                    }
                </Tag>
                <div><i className="fa-solid fa-people-arrows fa-xl" /> - {distance(user?.location?.lat, user?.location?.lng, post?.lat, post?.lng)} km</div>
            </div>
            <Space style={{
                margin: 20,
            }}>
                {
                    post?.ownerId === user?._id ? <></> :
                        <>
                            {
                                post?.mode === 'individual' ? <RequestUserModal post={post} /> :
                                    post?.mode === 'hospital' ? <RequestHospitalModal post={post} /> : <DonationModal post={post} />
                            }
                            <ReportModal type='post' id={post?._id} />
                        </>
                }
                {
                    allowAction && post?.ownerId === user?._id ?
                        <Space>
                            <Button type='primary' size='large' ghost onClick={() => {
                                navigate(`/post/${post._id}/edit`)
                            }}>Chỉnh sửa</Button>
                            <Button type='primary' size='large' ghost danger onClick={() => {
                                deletePost()
                            }}>Xóa</Button>
                            <Button type='primary' size='large' ghost danger={post?.active} onClick={() => {

                            }}>{
                                    post?.active ? 'Hủy kích hoạt' : 'Kích hoạt'
                                }</Button>
                        </Space> :
                        <></>
                }
            </Space>
        </div>
    )
}

export default InformationCard