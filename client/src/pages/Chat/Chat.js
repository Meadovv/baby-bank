import Layout from "../../components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message, Input } from "antd";
import "./Chat.css"
import Spinner from "../../components/Spinner";

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

export default function Chat() {

    const bottomRef = useRef(null)
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()
    const params = useParams()
    const [chat, setChat] = useState(null)
    const [loading, setLoading] = useState(false)
    const [messageInput, setMessageInput] = useState(null)
    const [chatList, setChatList] = useState([])

    const getChatHistory = async (userId) => {
        setLoading(true)
        await axios.post('/api/v1/chat/get-chat-history',
            {
                id: [user?._id, userId]
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setChat(res.data.chat)
                } else {

                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
        setLoading(false)
    }

    const getChatList = async () => {
        await axios.post('/api/v1/chat/get-chat-list',
            {

            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.success) {
                    setChatList(res.data.chats)
                } else {
                    message.error(res.data.message)
                    setChatList([])
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const sendMessage = async (message, chatId, from, to) => {
        if (!message) return
        await axios.post('/api/v1/chat/send-message',
            {
                chatId: chatId,
                message: {
                    from: from,
                    to: to,
                    message: message,
                    createDate: Date.now()
                }
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setChat(res.data.chat)
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const banChat = async (chatId) => {

    }

    useEffect(() => {
        const userId = params.userId
        if (userId === 'home') {
            getChatList(user?._id)
            setChat(null)
        } else {
            getChatList(user?._id)
            getChatHistory(params.userId)
        }
    }, [params])

    useEffect(() => {
        if (chat) {
            bottomRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }, [chat, setChat])

    return (
        loading ? <Spinner /> :
            <Layout>
                <div className="title-container-center">
                    <div className="title">Trò chuyện</div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: chat ? 'space-between' : 'center',
                    padding: '1rem',
                    fontSize: '1.2rem'
                }}>
                    <i className="fa-solid fa-arrow-left" onClick={() => navigate('/chat/home')} style={{
                        display: chat ? 'block' : 'none'
                    }}></i>
                    <div className="sub-title">
                        {
                            params.userId === 'home' ? 'Danh sách trò chuyện' :
                                chat?.from?._id === user?._id ? chat?.to?.name : chat?.from?.name
                        }
                    </div>
                    <i className="fa-solid fa-ban" style={{
                        display: chat ? 'block' : 'none'
                    }}></i>
                </div>
                <div className="chat-container">
                    <div className={`chat-list-container ${chat ? 'deactivated' : 'activated'}`}>
                        {
                            chatList && chatList.map((item, index) => {
                                return (
                                    <div className="chat-list-item" key={index} onClick={() => navigate(`/chat/${item._id}`)}>
                                        <div className="chat-list-item-header">
                                            <div className="chat-list-item-header-name">{item.name}</div>
                                            <div className="chat-list-item-header-tag">{
                                                item.mode === 'individual' ? 'Cá nhân' :
                                                    item.mode === 'hospital' ? 'Bệnh viện' : 'Tổ chức'
                                            }</div>
                                        </div>
                                        <div className="chat-list-item-content">
                                            {
                                                item.last && item.last.message
                                            }
                                        </div>
                                        <div className="chat-list-item-date">
                                            {
                                                item.last && item.last.createDate && toDate(item.last.createDate)
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className="chat-list-item" onClick={() => navigate(`/chat/000000000000000000000000`)}>
                            <div className="chat-list-item-header">
                                <div className="chat-list-item-header-name">Trợ lý thông minh</div>
                                <div className="chat-list-item-header-tag">Quản trị viên</div>
                            </div>
                            <div className="chat-list-item-content">
                                {
                                    'Xin chào, tôi có thể giúp gì cho bạn?'
                                }
                            </div>
                        </div>

                    </div>
                    <div className="chat-view-container">
                        <div className="chat-view">
                            {
                                chat && chat.data && chat.data.map((item, index) => {
                                    return (
                                        <div className={`chat-item ${item.from === user?._id ? 'right' : 'left'}`} key={index}>
                                            <div className="chat-item-content">
                                                <div className="chat-item-content-message">{item.message}</div>
                                                <div className="chat-item-content-date">{toDate(item.createDate)}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div ref={bottomRef} />
                        </div>
                        <div className='chat-reply'>
                            <Input.Search
                                style={{
                                    display: params.userId === 'home' ? 'none' : 'block'
                                }}
                                enterButton="Gửi"
                                onSearch={() => {
                                    sendMessage(messageInput, chat?._id, user?._id, chat?.from._id)
                                    setMessageInput(null)
                                }}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Layout>
    )
}