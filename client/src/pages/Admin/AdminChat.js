import { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { Row, Col, message, Tag, Input } from 'antd'
import axios from "axios"
import { useNavigate, useSearchParams } from 'react-router-dom'
import MessageCard from "../../components/Chat/MessageCard"

const AdminChat = () => {

    const navigate = useNavigate()

    const [userList, setUserList] = useState([])
    const [current, setCurrent] = useState({
        _id: '-1'
    })

    const [chatList, setChatList] = useState([])

    const loadUserList = async () => {
        await axios.post('/api/v1/admin/get-user-chat-list',
            {

            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setUserList(res.data.users)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const loadHistory = async ( userId ) => {
        if(userId === '-1') return
        await axios.post('/api/v1/chat/load-history',
        {
            targetId: userId 
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            setChatList(res.data.message)
        }).catch(err => {
            console.log(err.message)
        })
    }

    const send = async (value) => {
        if(!value) return
        await axios.post('/api/v1/chat/send-chat',
        {
            question: value,
            to: current._id
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                setChatList([
                    ...chatList,
                    {
                        key: Date.now(),
                        role: 'user',
                        content: value
                    }
                ])
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }

    useEffect(() => {
        loadUserList()
    }, [])

    useEffect(() => {
        loadHistory(current._id)
        current.status = 'read'
    }, [current])

    return (
        <Layout>
            <Row style={{
                width: '100%',
                height: '90vh'
            }}>
                <Col span={6} style={{
                    height: '100%',
                    overflow: 'auto',
                    padding: 10,
                    borderRadius: 10
                }}>
                    {
                        userList && userList.map((user, index) => {

                            return (
                                <div key={index} style={{
                                    width: '100%',
                                    height: '10%',
                                    backgroundColor: current._id === user._id ? '#B9D9EB' : '#F0F8FF',
                                    borderRadius: 10,
                                    marginBottom: 10,
                                    padding: 10
                                }} onClick={() => {
                                    setCurrent(user)
                                    navigate(`/admin-chat?userId=${user._id}`)
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%'
                                    }}>
                                        <h2>{user.name}</h2>
                                        <Tag color={user.mode === "individual" ? "#55acee" :
                                            user.mode === "organization" ? "#3b5999" :
                                                user.mode === "hospital" ? "#cd201f" : "#131921"} key='my-tag'>{user.mode === "individual" ? "Người dùng" :
                                                    user.mode === "organization" ? "Tổ chức" :
                                                        user.mode === "hospital" ? "Bệnh viện" : "Quản trị viên"}</Tag>
                                    </div>
                                    <h2 style={{
                                        color: 'gray',
                                        margin: 10
                                    }}>
                                        {
                                            user.status === 'unread' ? 'Có tin nhắn mới' : ''
                                        }
                                    </h2>
                                </div>
                            )
                        })
                    }
                </Col>
                <Col span={18} style={{
                    padding: 10
                }}>
                    <div style={{
                        height: '80vh',
                        overflow: 'auto',
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: '#F5F5F5'
                    }}>
                        {
                            chatList && chatList.map((item) => <MessageCard key={item.key} message={item}/>)
                        }
                    </div>
                    <Input.Search
                        size='large'
                        enterButton={'Gửi'}
                        onSearch={send}
                        allowClear
                        style={{
                            width: '100%',
                            marginTop: 10
                        }}
                    />
                </Col>
            </Row>
        </Layout>
    )
}

export default AdminChat