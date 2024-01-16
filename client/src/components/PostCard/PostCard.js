import Tag from '../Tag/Tag'
import { useNavigate } from 'react-router-dom'
import './PostCard.css'

const toDate = ( millis ) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const PostCard = ({ post, type }) => {

    const navigate = useNavigate()

    const color = post.ownerMode === "individual" ? "#55acee" :
                    post.ownerMode === "organization" ? "#3b5999" : 
                        post.ownerMode === "hospital" ? "#cd201f" : "#131921"


    const mode = type === 'post' ? (post.ownerMode === "individual" ? "Người dùng" :
    post.ownerMode === "organization" ? "Tổ chức" : 
        post.ownerMode === "hospital" ? "Bệnh viện" : "Quản trị viên") : (post.mode === "hospital" ? "Bệnh viện" : "Tổ chức")

    const imageLink = type === 'post' ? (post.hashTag === "milk" ? "/images/post/milk-donation.png" : 
    post.hashTag === 'no-milk' ? "/images/post/thing-donation.png" :
        post.hashTag === "donation" ? "/images/post/organization.png" :
            post.hashTag === "knowledge" ? "/images/post/hospital.png" : "/images/post/admin.jpg") : (post.mode === "hospital" ? "/images/post/hospital.png" : "/images/post/organization.png")

    return (
        <div className='post-card' onClick={() => {
            if(type === 'post') {
                navigate(`/post/${post?._id}/view`)
            } else {
                navigate(`/profile/${post?._id}`)
            }
        }}>
            <div className='post-card-header'>
                <div className='post-card-header-title'>{
                    type === 'post' ? post?.title : post?.name
                }</div>
                <div className='post-card-header-date'>{
                    (type === 'post' ? 'Đăng vào ' : 'Tham gia vào ') + toDate(post?.createDate)
                }</div>
            </div>
            <div className='post-card-body'>
                <img src={imageLink} alt='body-image' className='post-card-body-image' />
            </div>
            <div className='post-card-footer'>
                <div className='post-card-footer-title'>{type === 'post' ? post?.ownerName : post?.name}</div>
                <>
                    <Tag color={color} >{mode}</Tag>
                    {
                        !post?.active ? <Tag color='red' >Đã hủy kích hoạt</Tag> : <></>
                    }
                </>
            </div>
        </div>
    )
}

export default PostCard