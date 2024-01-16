import Layout from "../../components/Layout/Layout"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { message, Space, Button } from "antd"
import Quill from 'quill';
import './Post.css'
import GridView from "../../components/GridView/GridView"
import { useSelector } from "react-redux"
import Spinner from "../../components/Spinner"
import RequestModal from "../../components/Modal/RequestModal"


export default function ViewPost() {

    const params = useParams()
    const [post, setPost] = useState(null)
    const quillRef = useRef();

    const { user } = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const switchPost = async (postId) => {
        await axios.post(`/api/v1/post/switch-post`,
            {
                postId: postId,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(res => {
                if (res.data.success) {
                    message.success(res.data.message)
                    getPost(postId)
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
            })
    }

    const getPost = async (postId) => {
        setLoading(true)
        await axios.post(`/api/v1/post/get-post`,
            {
                postId: postId,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(res => {
                if (res.data.success) {
                    setPost(res.data.post)
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
            })
        setLoading(false)
    }

    useEffect(() => {
        getPost(params.postId)
    }, [params])

    useEffect(() => {
        const quill = new Quill(quillRef.current, {
            readOnly: true, // Make the Quill editor read-only
            theme: null, // No theme to make it look like normal text and not an editor
            bounds: '.text-editor',
        });
        quill.setContents(post?.content); // Set the content
    }, [post]);

    const userIcon = (mode) => {
        if (mode === 'individual') {
            return <i className="fa-solid fa-user"></i>
        }
        if (mode === 'hospital') {
            return <i className="fa-solid fa-stethoscope"></i>
        }
        if (mode === 'organization') {
            return <i className="fa-solid fa-house-medical-flag"></i>
        }

        return <i className="fa-solid fa-triangle-exclamation"></i>
    }

    useEffect(() => {
        if (post?.ownerId !== user?._id && post?.active === false) {
            message.error('Bài viết này đã bị ẩn')
            navigate('/')
        }
    }, [post, user])

    return (
        <>
            {
                loading ? <Spinner /> :
                    <Layout>
                        <div className="view-post-container">
                            <div className="view-post-user-tab-container">
                                <div style={{
                                    display: 'flex'
                                }}>
                                    <div style={{
                                        fontSize: 64,
                                    }}>
                                        {userIcon(post?.ownerMode)}
                                    </div>
                                    <div style={{
                                        marginLeft: 10,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{
                                            fontSize: 24,
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }} onClick={() => {
                                            navigate(`/profile/${post?.ownerId}`)
                                        }}>{post?.ownerName}</div>
                                        <div style={{
                                            fontSize: 18,
                                        }}>{
                                                post?.ownerMode === 'individual' ? 'Cá nhân' : post?.ownerMode === 'hospital' ? 'Bệnh viện' : 'Tổ chức'
                                            }</div>
                                    </div>
                                </div>
                                <div>
                                    <RequestModal amount={post?.amount} mode={post?.ownerMode} userId={post?.ownerId} postId={post?._id} hashTag={post?.hashTag} />
                                    <Space direction='horizontal'>
                                        <Button type='primary' size='large' style={{
                                            display: user?._id === post?.ownerId ? 'block' : 'none'
                                        }} onClick={() => {
                                            navigate(`/post/${post?._id}/edit`)
                                        }}>Chỉnh sửa</Button>

                                        <Button type='primary' size='large' style={{
                                            display: user?._id === post?.ownerId ? 'block' : 'none'
                                        }} onClick={() => {
                                            switchPost(post?._id)
                                        }} danger={post?.active}>
                                            {
                                                post?.active ? 'Ẩn bài viết' : 'Hiện bài viết'
                                            }
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                            <div ref={quillRef} />
                            <GridView images={post?.images} />
                        </div>
                    </Layout>
            }
        </>
    )
}