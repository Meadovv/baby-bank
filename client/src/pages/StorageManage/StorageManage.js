import Layout from "../../components/Layout/Layout";
import "./StorageManage.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { message, DatePicker, Menu } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import StorageViewer from "../../components/StorageViewer/StorageViewer";
import ItemModal from "../../components/Modal/ItemModal";
import moment from 'moment'

const menuItems = [
    {
        label: 'Tổng quan',
        key: 'overview',
        icon: <i className="fa-solid fa-database"></i>
    },
    {
        label: 'Lịch sử',
        key: 'histpry',
        icon: <i className="fa-solid fa-clock-rotate-left"></i>
    }
]

export default function StorageManage() {

    const [selectedMonth, setSelectedMonth] = useState(null);
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [storageList, setStorageList] = useState([])
    const [currentMenu, setCurrentMenu] = useState(menuItems[0].key)

    const getItemList = async (start, end) => {
        setLoading(true)
        await axios.post('/api/v1/storage/get-items',
            {
                start: start,
                end: end
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setStorageList(res.data.storageList)
                } else {
                    message.error(res.data.message)
                    setStorageList([])
                }
            }).catch(err => {
                console.log(err)
            })
        setLoading(false)
    }

    useEffect(() => {
        if(user?.mode !== 'hospital') {
            message.error('Bạn không có quyền truy cập vào trang này')
            navigate('/')
        } else {
            getItemList(0, 0)
        }
    }, [user])

    useEffect(() => {
        getItemList(0, 0)
    }, [currentMenu])

    const handleDateChange = async (date, dateString) => {
        if (date) {
          // Lấy ngày đầu tháng
          const startOfMonth = moment(dateString).startOf('month');
          
          // Lấy ngày cuối tháng
          const endOfMonth = moment(dateString).endOf('month');

          getItemList(startOfMonth.valueOf(), endOfMonth.valueOf())

          // Lưu giữ tháng đã chọn
          setSelectedMonth(date);
        } else {
            getItemList(0, 0)
        }
      };

    return (
        loading ? <Spinner /> :
        <Layout>
            <div style={{
                minHeight: '100vh'
            }}>
                <div className="title-container-center">
                    <div className="title">Quản lý kho</div>
                </div>
                <Menu
                    selectedKeys={[currentMenu]}
                    items={menuItems}
                    mode='horizontal'
                    onClick={(e) => setCurrentMenu(e.key)}
                />
                {
                    currentMenu === menuItems[0].key ? 
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <ItemModal user={user}/>
                    </div> : 
                    <>
                        <div className="title-container-center">
                            <div className="title">Lịch sử</div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <DatePicker
                                allowClear
                                size='large' 
                                onChange={handleDateChange} 
                                value={selectedMonth}
                                showMonthYearPicker
                                format={'DD/MM/YYYY'}
                            />
                        </div>
                        <StorageViewer storageList={storageList} loading={loading}/>
                    </>

                }
            </div>
        </Layout>
    )
}