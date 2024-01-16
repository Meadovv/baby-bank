import PostCard from "../PostCard/PostCard"
import { Button } from 'antd'
import Spinner from '../Spinner'
import './PostList.css'

const PostList = ({ posts, loading, type }) => {

    return (
        loading ? <Spinner /> : 
        <div className="post-list-container">
            {
                posts && posts.map(post => (
                    <PostCard post={post} key={post._id} type={type}/>
                ))
            }
        </div>
    )
}

export default PostList