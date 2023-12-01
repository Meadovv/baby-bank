import MenuItems from './MenuItems';
import { useSelector } from 'react-redux';

const Navigator = () => {

  const { user } = useSelector(state => state.user)
  const userMenuItems = [
    {
      title: 'Trang chủ',
      url: '/'
    },
    {
      title: 'Bệnh viện',
      url: '/hospital?distance=0'
    },
    {
      title: 'Tổ chức',
      url: '/organization?distance=0'
    },
    {
      title: 'Bài viết',
      url: '/post?type=all&distance=0',
      submenu: [
        {
          title: 'Cho sữa',
          url: '/post?type=milk&distance=0'
        },
        {
          title: 'Cho đồ',
          url: '/post?type=no-milk&distance=0'
        },
        {
          title: 'Tổ chức',
          url: '/post?type=donation&distance=0'
        },
        {
          title: 'Bệnh viện',
          url: '/post?type=knowledge&distance=0'
        }
      ]
    },
    {
      title: 'Yêu cầu',
      url: '/request'
    },
    {
      title: 'Cuộc hẹn',
      url: '/appointment'
    },
    {
      title: 'Tài khoản',
      submenu: [
        {
          title: 'Cài đặt',
          url: `/profile/${user?._id}`
        },
        {
          title: 'Đăng xuất',
          url: '/logout'
        }
      ]
    }
  ]

  const adminMenuItems = [
    {
      title: 'Trang chủ',
      url: '/admin'
    },
    {
      title: 'Tin nhắn',
      url: '/admin-chat'
    },
    {
      title: 'Báo cáo',
      url: '/admin-report'
    },
    {
      title: 'Tài khoản',
      submenu: [
        {
          title: 'Cài đặt',
          url: `/profile/${user?._id}`
        },
        {
          title: 'Đăng xuất',
          url: '/logout'
        }
      ]
    }
  ]


  const menuItems = user?.mode === 'admin' ? adminMenuItems : userMenuItems

  return (
    <nav>
      <ul className="menus">
        {menuItems.map((menu, index) => {
          const depthLevel = 0;
          return (
            <MenuItems
              items={menu}
              key={index}
              depthLevel={depthLevel}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigator;