import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import PostList from "../../components/PostList/PostList";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ManagePost() {

    const [postList, setPostList] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(state => state.user)

    const getAllUserPost = async () => {
        await axios.post('/api/v1/post/get-all-user-post',
        {

        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                setPostList(res.data.postList)
            } else {
                setPostList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getAllUserPost()
    }, [user])

    return (
        <Layout>
            <div className="manage-post-container">
                <div className="title-container-center">
                    <div className="title">Quản lý bài viết</div>
                </div>
                <PostList posts={postList} loading={loading} type='post' />
            </div>
        </Layout>
    )
}