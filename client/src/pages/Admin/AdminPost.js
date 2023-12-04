import { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import Spinner from "../../components/Spinner"
import { Input, message, Divider, Radio } from 'antd'
import axios from 'axios'

const AdminPost = () => {

    const [postList, setPostList] = useState([])
    const [key, setKey] = useState('all')
    const [loading, setLoading] = useState(false)

    const getPostList = () => {
        setLoading(true)
        axios.post('/api/v1/admin/get-post-list',
            {
                key: key
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
        setLoading(false)
    }

    const handleChange = async (_id, key, value) => {
        await axios.post('/api/v1/admin/post-setting',
            {
                _id: _id,
                key: key,
                value: value
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    message.success(res.data.message)
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    useEffect(() => {
        getPostList()
    }, [key, setKey])

    return (
        <Layout>
            {
                loading ? <Spinner /> :
                    <div style={{
                        width: '100%',
                        height: '100vh',
                        padding: 10
                    }}>
                        <Input.Search
                            placeholder="ID Bài đăng"
                            size='large'
                            enterButton={'Tìm kiếm'}
                            onSearch={(value) => {
                                setKey(value)
                            }}
                            allowClear
                            style={{
                                width: '100%',
                                marginTop: 10
                            }}
                        />
                        <div style={{
                            overflow: 'auto',
                            height: '80vh',
                            width: '100%',
                            marginTop: 10,
                            padding: 10
                        }}>
                            {
                                postList && postList.map((post, index) => {

                                    return (
                                        <div key={post._id} style={{
                                            border: '1px solid black',
                                            borderRadius: 10,
                                            height: '25vh',
                                            width: '100%',
                                            marginTop: 10,
                                            padding: 10
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontSize: 24
                                                }}><strong>Tiêu đều: </strong>{post.title} - <strong>ID: </strong> {post._id}</div>
                                                <div style={{
                                                    fontSize: 24,
                                                    marginTop: 10
                                                }}><strong>Người đăng: </strong>{post.ownerName} - {post.ownerId}</div>
                                            </div>
                                            <Divider orientation="left" style={{
                                                borderColor: 'black'
                                            }}>
                                                <h3>CÀI ĐẶT</h3>
                                            </Divider>
                                            <div style={{
                                                display: 'flex',
                                                padding: 10
                                            }}>
                                                <div style={{
                                                    width: '50%',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <strong>TRẠNG THÁI BÀI ĐĂNG</strong>
                                                    <Radio.Group defaultValue={post.active} style={{
                                                        marginTop: 10,
                                                        width: '80%',
                                                        display: 'flex',
                                                        justifyContent: 'space-between'
                                                    }} onChange={(event) => {
                                                        handleChange(post._id, 'active', event.target.value)
                                                    }}>
                                                        <Radio value={true}>Kích hoạt</Radio>
                                                        <Radio value={false}>Không Kích hoạt</Radio>
                                                    </Radio.Group>
                                                </div>

                                                <div style={{
                                                    width: '50%',
                                                }}>
                                                    <strong>CHẾ ĐỘ</strong>
                                                    <Radio.Group defaultValue={post.mode} style={{
                                                        marginTop: 10,
                                                        width: '80%',
                                                        display: 'flex',
                                                        justifyContent: 'space-between'
                                                    }} onChange={(event) => {
                                                        handleChange(post._id, 'mode', event.target.value)
                                                    }} disabled>
                                                        <Radio value={'individual'}>Người dùng</Radio>
                                                        <Radio value={'organization'}>Tổ chức</Radio>
                                                        <Radio value={'hospital'}>Bệnh viện</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
            }
        </Layout>
    )
}

export default AdminPost