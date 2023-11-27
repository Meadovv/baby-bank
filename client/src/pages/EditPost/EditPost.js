import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { useSelector } from 'react-redux'
import Spinner from '../../components/Spinner'
import PostEdit from '../../components/PostEdit/PostEdit'
import Error from '../Error/Error'
import axios from 'axios'
import { Button, Space, message } from 'antd'

const EditPost = () => {

    const param = useParams()
    const { user } = useSelector(state => state.user)
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const getPost = async (postId) => {
        setLoading(true)
        await axios.post('/api/v1/post/get-post',
            {
                postId: postId
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    if (res.data.post.ownerId === user?._id) {
                        setPost(res.data.post)
                    }
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
        setLoading(false)
    }

    const handleSetPost = (key, value) => {
        setPost({
            ...post,
            [key]: value
        })
    }

    const handleSave = async () => {
        await axios.post('/api/v1/post/update-post',
        {
            post: post
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
                navigate(`/post/${post._id}`)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.data.message)
        })
    }

    const handleCancel = () => {
        navigate(`/post/${post._id}`)
    }

    useEffect(() => {
        getPost(param.postId)
    }, [])

    return (
        <>
            {
                loading ? <Spinner /> :
                    !post ? <Error /> :
                        <Layout>
                            <div style={{
                                minHeight: '100vh',
                                width: '100%',
                                padding: '1rem',
                            }}>
                                <PostEdit user={user} post={post} handleChange={handleSetPost} />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                margin: 10
                            }}>
                                <Space>
                                    <Button type='primary' ghost size='large' onClick={handleSave}>Lưu lại</Button>
                                    <Button type='primary' ghost size='large' danger onClick={handleCancel}>Hủy bỏ</Button>
                                </Space>
                            </div>
                        </Layout>
            }
        </>
    )
}

export default EditPost