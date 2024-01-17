import './Hero.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FloatButton } from 'antd'
import { useEffect, useState } from 'react'
import NotificationModal from '../../../components/Modal/NotificationModal'
import axios from 'axios'
import { message } from 'antd'

const desktopMenuItem = [
    {
        title: 'Đăng bài',
        url: '/post/create',
        icon: 'fa-solid fa-plus'
    },
    {
        title: 'Thông báo',
        url: '/notification',
        icon: 'fa-solid fa-bell'
    },
    {
        title: 'Hỗ trợ',
        url: '/chat/000000000000000000000000',
        icon: 'fa-solid fa-headset'
    },
    {
        title: 'Assistant',
        url: '/chat/000000000000000000000001',
        icon: 'fa-solid fa-mask'
    }
]

export default function Hero() {

    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    const [openMenu, setOpenMenu] = useState(false)
    const [openNotification, setOpenNotification] = useState(false)
    const [notificationList, setNotificationList] = useState([])

    const getNotificationList = async () => {
        await axios.post('/api/v1/notification/get-notification-list', {

        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.data.success) {
                setNotificationList(res.data.notificationList)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getNotificationList()
    }, [])

    return (
        <>
            <NotificationModal
                visible={openNotification}
                onCancel={() => {
                    setOpenNotification(false)
                }}
                notificationList={notificationList}
            />
            <FloatButton.Group
                className='menu-desktop'
                open={openMenu}
                trigger='click'
                shape='circle'
                style={{
                    right: 24
                }}
                icon={<a className='fa-solid fa-bars'></a>}
                onClick={() => {
                    setOpenMenu(current => !current)
                }}
            >
                {
                    desktopMenuItem && desktopMenuItem.map((item, index) => {
                        return (
                            <FloatButton
                                key={index}
                                icon={<a className={`${item.icon}`}></a>}
                                onClick={() => {
                                    if (item.url === '/notification') {
                                        setOpenNotification(true)
                                    } else {
                                        navigate(`${item.url}`)
                                    }
                                }}
                            />
                        )
                    })
                }
            </FloatButton.Group>
            <div className='home-container'>
                <div className='head-container'>
                    <div className='head-logo'>
                        <img src='/images/logo.png' alt='logo' />
                    </div>

                    <div className='quick-menu-container'>

                        <div className='quick-menu-item'>
                            <i className="fa-solid fa-bell" onClick={() => setOpenNotification(true)}></i>
                        </div>

                        <div className='quick-menu-item' onClick={() => {
                            navigate('/post/create')
                        }}>
                            <i className="fa-solid fa-circle-plus"></i>
                        </div>

                        <div className='quick-menu-item' onClick={() => {
                            navigate('/chat/000000000000000000000000')
                        }}>
                            <i className="fa-solid fa-headset"></i>
                        </div>
                    </div>
                </div>

                <div className='welcome-container'>
                    <div className='welcome'>
                        Xin chào, {user?.name}!
                    </div>
                </div>
            </div></>
    )
}