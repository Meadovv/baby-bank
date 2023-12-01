import React, { useEffect, useRef, useState } from 'react';
import { Button, Drawer, FloatButton, Input, Space, message, Card, Avatar } from "antd"
import { RobotOutlined } from '@ant-design/icons';
import axios from 'axios'
import MessageCard from './MessageCard';
import webConfig from '../../config/config.json'

const initiationChat = [
    {
        key: 0,
        role: 'bot',
        content: `Bạn đang ở chế độ Trợ lí ${webConfig.APP_NAME}.`
    },
    {
        key: 1,
        role: 'bot',
        content: `Xin chào, tôi là trợ lí ${webConfig.APP_NAME}. Hãy hỏi tôi bất cứ điều gì liên quan tới mẹ và bé, tôi sẽ cố gắng tìm câu trả lời. Tuy nhiên, câu trả lời của tôi chỉ mang tính chất tham khảo. Ngoài ra, bạn có thể chuyển sang chế độ trò chuyện với quản trị viên bằng cách nhấn vào Nút Trò chuyện.`
    }
]

const ChatDrawer = () => {
    const [open, setOpen] = useState(false);
    const bottomRef = useRef(null)

    const [messageList, setMessageList] = useState(initiationChat)
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState('assistant')

    const showDrawer = () => {
        setOpen(true);
    }

    const closeDrawer = () => {
        setOpen(false);
    }

    const loadHistory = async () => {
        setLoading(true)
        await axios.post('/api/v1/chat/load-history',
        {

        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            setMessageList(res.data.message)
        }).catch(err => {
            setMessageList([
                {
                    key: Date.now(),
                    role: 'bot',
                    content: err.message
                }
            ])
        })
        setLoading(false)
    }

    const getAnswer = async (question) => {
        if(question.length === 0) {
            return
        }
        setMessageList(messageList => [
            ...messageList,
            {
                key: Date.now(),
                role: 'user',
                content: question
            }
        ])
        setLoading(true)
        await axios.post(`${
            mode === 'assistant' ?
            '/api/v1/assistant/get-answer' :
            '/api/v1/chat/send-chat'
        }`,
            {
                question: question,
                to: 'bot',
                type: 'bot'
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                setMessageList(messageList => [
                    ...messageList,
                    {
                        key: Date.now(),
                        role: 'bot',
                        content: res.data.message
                    }
                ])
            }).catch(err => {
                console.log(err)
                setMessageList(messageList => [
                    ...messageList,
                    {
                        key: Date.now(),
                        role: 'bot',
                        content: err.message
                    }
                ])
            })
        setLoading(false)
    }

    const changeMode = (value) => {
        setMode(value)
        if(value === 'assistant') {
            setMessageList(initiationChat)
        } else {
            loadHistory()
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth'
        })
    }, [messageList])

    return (
        <>
            <FloatButton
                icon={<i className="fa-solid fa-headset"></i>}
                style={{
                    right: 24
                }}
                onClick={showDrawer}
            />
            <Drawer
                open={open}
                onClose={() => {
                    setMode('assistant')
                    setMessageList(initiationChat)
                    closeDrawer()
                }}
                title='Hỗ trợ'
                size='large'
            >
                <div style={{
                    width: '100%',
                    backgroundColor: '#F0F8FF',
                    height: '75vh',
                    overflow: 'auto',
                    padding: 10,
                    borderRadius: 10
                }}>
                    {
                        messageList && messageList.map(message => <MessageCard key={message.key} message={message} />)
                    }
                    <div style={{
                        display: loading ? 'flex' : 'none',
                        justifyContent: 'flex-start',
                    }}>
                        <Avatar
                            size={64}
                            icon={<RobotOutlined />}
                        />
                        <Card
                            loading={loading}
                            style={{
                                width: '60%',
                                margin: 10
                            }}
                        >
                        </Card>
                    </div>
                    <div ref={bottomRef} />
                </div>
                <div style={{
                    width: '100%',
                    marginTop: 10
                }}>
                    <Input.Search
                        placeholder={mode === 'assistant' ? 'Ví dụ: Làm cách nào để bảo quản sữa mẹ?' : 'Bạn muốn nói với chúng tôi điều gì?'}
                        size='large'
                        enterButton={'Gửi'}
                        onSearch={getAnswer}
                        allowClear
                    />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}>
                    <Button type='primary' size='large' ghost onClick={() => {
                            changeMode(mode === 'assistant' ? 'chat' : 'assistant')
                    }}>
                        {
                            mode === 'assistant' ? 'Trò chuyện' : 'Trợ lí'
                        }
                    </Button>
                    <h4>Powered by Google Bard</h4>
                </div>
            </Drawer>
        </>
    )
}

export default ChatDrawer