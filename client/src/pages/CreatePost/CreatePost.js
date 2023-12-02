import { useState } from "react";
import {
    Button,
    Steps,
    Row, Col,
    Card,
    Space,
    message,
} from 'antd'
import Layout from "../../components/Layout/Layout"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostView from "../../components/PostView/PostView";
import axios from 'axios'
import PostEdit from "../../components/PostEdit/PostEdit";

const Welcome = ({ user }) => {

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Row gutter={[16, 16]} style={{
                width: '100%'
            }}>
                <Col span={12}>
                    <Card title="Loại tài khoản" bordered={false} hoverable>
                        <Card.Meta
                            title={user?.mode === 'individual' ? 'Người dùng' : user?.mode === 'hospital' ? 'Bệnh viện' : 'Tổ chức'}
                            description='Là loại tài khoản của bạn'
                        ></Card.Meta>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Loại bài viết" bordered={false} hoverable>
                        <Card.Meta
                            title={user?.mode === 'individual' ? 'Cho sữa, Cho đồ ' : user?.mode === 'hospital' ? 'Kiến thức' : 'Kêu gọi ủng hộ'}
                            description='Loại bài viết mà bạn có thể đăng'
                        ></Card.Meta>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Hình ảnh" bordered={false} hoverable>
                        <Card.Meta
                            title={user?.mode === 'individual' ? 'Có thể chứa hình ảnh trong bài đăng cho đồ' : user?.mode === 'hospital' ? 'Có thể chứa hình ảnh' : 'Có thể chứa hình ảnh'}
                            description='Hình ảnh bạn đăng phải tuân thủ Điều khoản của chúng tôi. Nếu vi phạm, bạn sẽ bị khóa tài khoản'
                        ></Card.Meta>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Lưu ý" bordered={false} hoverable>
                        <Card.Meta
                            title="Kiểm tra kỹ bài viết trước khi đăng"
                            description='Tránh thiếu những nội dung quan trọng để bài đăng của bạn được truyền tải tới mọi người'
                        ></Card.Meta>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

const PostContent = ({ user, post, handleChange }) => {
    return <PostEdit user={user} post={post} handleChange={handleChange} />
}

const PostPreview = ({ post }) => {
    return <PostView allowAction={false} post={post} />
}

const steps = [
    {
        title: 'Lưu ý',
        content: 'First-content',
    },
    {
        title: 'Nội dung',
        content: 'Second-content',
    },
    {
        title: 'Xem trước',
        content: 'Last-content',
    },
];

const CreatePost = () => {

    const { user } = useSelector(state => state.user)
    const [current, setCurrent] = useState(0);
    const [postContent, setPostContent] = useState({
        mode: user?.mode,
        ownerId: user?._id,
        ownerName: user?.name,
        title: '',
        content: [],
        amount: 1000,
        lat: user?.location.lat,
        lng: user?.location.lng,
        writer: user?.name,
        createDate: Date.now()
    })

    const handleSetPost = (key, value) => {
        setPostContent({
            ...postContent,
            [key]: value
        })
    }

    const navigate = useNavigate()

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const post = async () => {
        await axios.post('/api/v1/post/create-post',
            {
                post: postContent
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    message.success(res.data.message)
                    navigate(`/profile/${user?._id}`)

                    // reset
                    setPostContent({
                        mode: user?.mode,
                        ownerId: user?._id,
                        ownerName: user?.name,
                        title: null,
                        content: null,
                        amount: 1000,
                        lat: user?.location.lat,
                        lng: user?.location.lng,
                        createDate: Date.now()
                    })
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <Layout>
            <div style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Steps
                    style={{
                        width: '100%',
                    }}
                    current={current}
                    items={items}
                />
                {
                    current === 0 ? <Welcome user={user} /> :
                        current === 1 ? <PostContent user={user} post={postContent} handleChange={handleSetPost} /> : <PostPreview post={postContent} />
                }
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Button type="primary" ghost onClick={prev} disabled={current === 0 ? true : false} size='large'>Trước đó</Button>
                    <Space>
                        <Button type="primary" ghost onClick={() => { navigate(`/profile/${user._id}`) }} danger size='large'>Thoát</Button>
                        <Button type="primary" ghost onClick={post} disabled={current === steps.length - 1 ? false : true} danger size='large'>Đăng bài</Button>
                    </Space>
                    <Button type="primary" ghost onClick={next} disabled={current === steps.length - 1 ? true : false} size='large'>Tiếp theo</Button>
                </div>
            </div>
        </Layout>
    )
}

export default CreatePost