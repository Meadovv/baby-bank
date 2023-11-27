import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { message, Divider } from 'antd'
import { useSelector } from 'react-redux'
import PostList from '../../components/PostList/PostList'

const PostManager = () => {

    const [postList, setPostList] = useState([])
    const { user } = useSelector(state => state.user)

    const getPostList = async (userId) => {
        await axios.post('/api/v1/post/get-all-user-post',
            {
                limit: 1000,
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
        getPostList(user?._id)
    }, [])

    return (
        <Layout>
            <div style={{
                maxWidth: 1600,
                margin: '0 auto',
                minHeight: '100vh',
                padding: 10
            }}>
                <Divider orientation="left" style={{
                    borderColor: 'black'
                }}>
                    <h2 style={{
                        textTransform: 'uppercase'
                    }}>Tất cả Bài đăng của người dùng</h2>
                </Divider>
                <PostList posts={postList} columns={4} />
            </div>
        </Layout>
    )
}

export default PostManager