import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Header.css'
import { FloatButton } from 'antd';

const Header = () => {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.user)

  const userMenuItems = [
    {
      title: 'Trang chủ',
      url: '/',
      icon: 'fa-solid fa-home'
    },
    {
      title: 'Khám phá',
      url: '/explore',
      icon: 'fa-solid fa-compass'
    },
    {
      title: 'Cuộc hẹn',
      url: '/appointment',
      icon: 'fa-solid fa-calendar-check'
    },
    {
      title: 'Trò chuyện',
      url: '/chat/home',
      icon: 'fa-solid fa-message'
    },
    {
      title: 'Tài khoản',
      url: `/profile/${user?._id}`,
      icon: 'fa-solid fa-user'
    }
  ]
  
  const menuItems = userMenuItems
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <>
      <FloatButton.BackTop
        style={{
          left: 24,
        }}
      />
      <FloatButton.Group
        className='menu-mobile'
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
          menuItems && menuItems.map((item, index) => {
            return (
              <FloatButton
                key={index}
                icon={<a className={`${item.icon}`}></a>}
                onClick={() => {
                  navigate(`${item.url}`)
                }}
              />
            )
          })
        }
      </FloatButton.Group>

      <div className='header-container'>
        <img className='logo' src='/images/logo.png' alt='logo' onClick={() => {
          navigate('/')
        }} />
        <div className='nav-bar-container'>
          {
            menuItems && menuItems.map((item, index) => {
              return (
                <div className='nav-bar-item' key={index} onClick={() => {
                  navigate(`${item.url}`)
                }}>
                  {item.title}
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
};

export default Header;