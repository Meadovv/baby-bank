import Layout from "../../components/Layout/Layout";
import PostEditor from "../../components/PostEditor/PostEditor";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, Button, Select, InputNumber, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Spinner from "../../components/Spinner";

export default function EditPost() {

    const { user } = useSelector(state => state.user)
    const [post, setPost] = useState(null);
    const [images, setImages] = useState([]);
    const [postContent, setPostContent] = useState(null);
    const params = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const getPost = (postId) => {
        setLoading(true)
        axios.post(`/api/v1/post/get-post`,
            {
                postId: postId
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },

            })
            .then(res => {
                if (res.data.success) {
                    setPost(res.data.post)
                    setImages(res.data.post.images)
                    setPostContent(res.data.post.content)
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
        getPost(params.postId)
        console.log(postContent)
    }, [params])

    useEffect(() => {
        if (post) {
            if (post?.ownerId !== user?._id) {
                message.error('Bạn không có quyền chỉnh sửa bài viết này')
                navigate('/')
            }
        }
    }, [])

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        })

    const handleImageRemove = (index) => {
        setImages(oldImages => oldImages.filter((_, i) => i !== index));
    };

    const handleSavePost = async () => {
        await axios.post(`/api/v1/post/update-post`,
        {
            post: {
                ...post,
                images: images,
                content: postContent
            }
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
                navigate(`/post/${post?._id}/view`)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }


    return (
        loading ? <Spinner /> : <Layout>
        <div className="title-container-center">
            <div className="title">CHỈNH SỬA BÀI ĐĂNG</div>
        </div>
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <div>
                Tên bài đăng
            </div>
            <Input style={{
                width: '80%',
                marginBottom: 10,
                marginTop: 10
            }} value={post?.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
            <div style={{
                width: '80%',
                display: post?.hashTag === 'milk' ? 'flex' : 'none',
            }}>
                <InputNumber style={{
                    width: '100%',
                    marginBottom: 10
                }} addonBefore='Lượng sữa' value={post?.amount} onChange={(value) => setPost({ ...post, amount: value })} addonAfter='ml' />
            </div>
        </div>
        <div style={{
            display: post?.hashTag === 'milk' ? 'none' : 'flex',
            width: "100%",
            justifyContent: "center",
        }}>
            <div style={{
                width: "90%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}>
                <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                        getBase64(file).then((image) => {
                            setImages(oldImages => [...oldImages, image]);
                        });
                        return false;
                    }}
                >
                    {
                        images.length < 8 && (
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        )
                    }
                </Upload>
                <div className="image-list">
                    {images.map((image, index) => (
                        <div className="image-container" key={index}>
                            <img src={image} alt="" />
                            <button onClick={() => handleImageRemove(index)}>Xóa</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="create-post-container" style={{
            display: post?.hashTag === 'milk' ? 'none' : '',
        }}>
            <PostEditor content={postContent} setContent={setPostContent} />
        </div>
        <div style={{
            display: "flex",
            justifyContent: "center",
        }}>
            <Button type="primary" onClick={handleSavePost}>Lưu lại</Button>
        </div>
        <div style={{
            display: post?.hashTag === 'milk' ? 'flex' : 'none',
            width: "100%",
            height: '100vh'
        }}></div>
    </Layout>
    )
}