import PostCard from "../PostCard/PostCard"
import { Row } from 'antd'
import Spinner from '../Spinner'

const PostList = ({ posts, columns, loading }) => {

    return (
        loading ? <Spinner /> : 
        <Row gutter={[16, 16]}>
            {
                posts && posts.map((post, index) => <PostCard key={index} post={post} width={24 / columns}/>)
            }         
        </Row>
    )
}

export default PostList