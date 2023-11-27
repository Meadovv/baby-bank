import Layout from "../../components/Layout/Layout"
import { useEffect, useState } from "react"
import PostView from "../../components/PostView/PostView"
import { useParams } from "react-router-dom"
import { message } from "antd"
import axios from 'axios'
import Spinner from '../../components/Spinner'

const PostDetail = () => {

    const param = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(false)

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
            if(res.data.success) {
                setPost(res.data.post)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
        setLoading(false)
    }

    useEffect(() => {
        getPost(param.postId)
    }, [param.postId])

    return (
        <Layout>
            {
                loading ? <Spinner /> : <PostView allowAction={true} post={post}/>
            }
        </Layout>
    )
}

export default PostDetail