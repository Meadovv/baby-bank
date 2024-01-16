import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import PostEditor from "../../components/PostEditor/PostEditor";
import "./Post.css";
import { Upload, Button, Select, InputNumber, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const [images, setImages] = useState([]);
    const [content, setContent] = useState(null);
    const [postTitle, setPostTitle] = useState('');
    const navigate = useNavigate();
    const [postHashtag, setPostHashtag] = useState(null);
    const [postAmount, setPostAmount] = useState(0);

    const { user } = useSelector(state => state.user)

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

    const createPost = async () => {
        await axios.post('/api/v1/post/create-post',
        {
            hashTag: postHashtag,
            ownerName: user?.name,
            title: postTitle,
            amount: postAmount,
            lat: user?.location?.lat,
            lng: user?.location?.lng,
            content: content,
            images: images,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
                navigate('/')
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err);
            message.error(err.message)
        })
    }

    return (
        <Layout>
            <div className="title-container-center">
                <div className="title">TẠO BÀI ĐĂNG</div>
            </div>
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <div>
                    Loại bài đăng
                </div>
                <Select
                    options={[
                        {
                            label: 'Cho sữa',
                            value: 'milk',
                            disabled: user?.mode === 'individual' ? false : true
                        },
                        {
                            label: 'Tặng đồ',
                            value: 'no-milk',
                            disabled: user?.mode === 'individual' ? false : true
                        },
                        {
                            label: 'Kêu gọi ủng hộ',
                            value: 'donation',
                            disabled: user?.mode === 'organization' ? false : true
                        },
                        {
                            label: 'Kiến thức y khoa',
                            value: 'knowledge',
                            disabled: user?.mode === 'hospital' ? false : true
                        },
                        {
                            label: 'Thông báo',
                            value: 'admin',
                            disabled: user?.mode === 'admin' ? false : true
                        }
                    ]}
                    style={{
                        width: '80%',
                        marginBottom: 10,
                        marginTop: 10
                    }}
                    placeholder="Chọn loại bài đăng"
                    onChange={(value) => setPostHashtag(value)}
                />
                <div>
                    Tên bài đăng
                </div>
                <Input style={{
                    width: '80%',
                    marginBottom: 10,
                    marginTop: 10
                }} onChange={(e) => setPostTitle(e.target.value)}/>
                <div style={{
                    width: '80%',
                    display: postHashtag === 'milk' ? 'flex' : 'none',
                }}>
                    <InputNumber style={{
                        width: '100%',
                        marginBottom: 10
                    }} addonBefore='Lượng sữa' value={postAmount} onChange={(value) => setPostAmount(value)} addonAfter='ml'/>
                </div>
            </div>
            <div style={{
                display: postHashtag === 'milk' ? 'none' : 'flex',
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
                display: postHashtag === 'milk' ? 'none' : '',
            }}>
                <PostEditor content={content} setContent={setContent}/>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
            }}>
                <Button type="primary" onClick={createPost}>Đăng bài</Button>
            </div>
            <div style={{
                display: postHashtag === 'milk' ? 'flex' : 'none',
                width: "100%",
                height: '100vh'
            }}></div>
        </Layout>
    )
}