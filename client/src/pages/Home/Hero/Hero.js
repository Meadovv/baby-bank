import './Hero.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FloatButton } from 'antd'
import { useState } from 'react'
import NotificationModal from '../../../components/Modal/NotificationModal'

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
    }
]

const Hero = () => {

    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    const [openMenu, setOpenMenu] = useState(false)
    const [openNotification, setOpenNotification] = useState(false)

    return (
        <>
            <NotificationModal
                visible={openNotification}
                onOk={() => setOpenNotification(false)}
                onCancel={() => setOpenNotification(false)}
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
                            <i className="fa-solid fa-bell"></i>
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

export default Hero