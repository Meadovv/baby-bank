import { Card, Col, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'

const toDate = ( millis ) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const PostCard = ({ post, width }) => {

    const navigate = useNavigate()

    const color = post.mode === "individual" ? "#55acee" :
                    post.mode === "organization" ? "#3b5999" : 
                        post.mode === "hospital" ? "#cd201f" : "#131921"


    const mode = post.mode === "individual" ? "Người dùng" :
                    post.mode === "organization" ? "Tổ chức" : 
                        post.mode === "hospital" ? "Bệnh viện" : "Quản trị viên"

    const imageLink = post.mode === "individual" ? (Number(post.amount) !== -1 ? "/images/post/milk-donation.png" : "/images/post/thing-donation.png") :
                        post.mode === "organization" ? "/images/post/organization.png" :
                            post.mode === "hospital" ? "/images/post/hospital.png" : "/images/post/admin.jpg"

    return (
        <Col span={width}>
            <Card 
                title={post.user}
                cover={<img alt='hospital-img' src={imageLink} />}
                extra={
                    <>
                        <Tag color={color} key='my-tag'>{mode}</Tag>
                        {
                            !post?.active ? <Tag color='red' key='my-tag2'>Đã hủy kích hoạt</Tag> : <></>
                        }
                    </>
                }
                hoverable
                onClick={() => {
                    navigate(`/post/${post._id}`)
                }}
            >
                <Card.Meta title={post.title} description={toDate(post.time)} />
            </Card>
        </Col>
    )
}

export default PostCard