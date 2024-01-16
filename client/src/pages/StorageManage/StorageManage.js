import Layout from "../../components/Layout/Layout";
import "./StorageManage.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { message, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import StorageViewer from "../../components/StorageViewer/StorageViewer";
import AddItemModal from "../../components/Modal/AddItemModal";

export default function StorageManage() {

    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [storageList, setStorageList] = useState([])

    const getItemList = async () => {
        setLoading(true)
        await axios.post('/api/v1/storage/get-items',
            {

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
        if(user?.mode === 'individual') {
            message.error('Bạn không có quyền truy cập vào trang này')
            navigate('/')
        } else {
            getItemList()
        }
    }, [user])

    return (
        loading ? <Spinner /> :
        <Layout>
            <div>
                <div className="title-container-center">
                    <div className="title">Quản lý kho</div>
                </div>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Space direction="horizontal">
                        <AddItemModal mode={user?.mode}/>
                    </Space>
                </div>
                <div className="title-container-center">
                    <div className="title">Lịch sử</div>
                </div>
                <StorageViewer storageList={storageList} loading={loading}/>
            </div>
        </Layout>
    )
}