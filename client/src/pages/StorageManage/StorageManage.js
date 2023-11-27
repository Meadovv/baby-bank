import { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { Row, Col, Menu, message } from 'antd'
import Spinner from "../../components/Spinner"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Statistical from "./Statistical"
import History from "./History"
import axios from "axios"
import More from "./More"

const menuItems = [
    {
        label: 'Thống kê',
        key: 'statistical'
    },
    {
        label: 'Lịch sử',
        key: 'history'
    },
    {
        label: 'Hành động',
        key: 'action'
    }
]

const StorageManage = () => {

    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)
    const [currentMenu, setCurrentMenu] = useState(menuItems[0].key)

    const changeContent = (value) => {
        setCurrentMenu(value.key)
    }

    const [storage, setStorage] = useState({
        total: 0,
        income: 0,
        outcome: 0,
        this_month: {
            total: 0,
            income: 0,
            outcome: 0,
        }
    })

    const onChangeStorage = async (action, value) => {

        if (action === 'pop' && Number(value) > storage.total) {
            message.error('Lượng sữa trong kho không đủ')
            return
        }

        await axios.post('/api/v1/storage/action',
            {
                from: 'doctor',
                action: action,
                value: value
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setStorage(current => (
                        {
                            total: Math.max(0, current.total + (action === 'push' ? (1) : (-1)) * value),
                            income: action === 'push' ? current.income + Number(value) : current.income,
                            outcome: action === 'pop' ? current.outcome + Number(value) : current.outcome,
                            this_month: {
                                total: Math.max(0, current.this_month.total + (action === 'push' ? (1) : (-1)) * value),
                                income: action === 'push' ? current.this_month.income + Number(value) : current.this_month.income,
                                outcome: action === 'pop' ? current.this_month.outcome + Number(value) : current.this_month.outcome,
                            },
                            history: current.history
                        }
                    ))
                    message.success(res.data.message)
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const [chart, setChart] = useState({
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
        datasets: [
            {
                label: 'Thu vào',
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                backgroundColor: '#cf1322',
                stack: '0'
            },
            {
                label: 'Lấy ra',
                data: [9, 8, 7, 6, 5, 4, 3, 2, 1],
                backgroundColor: '#3f8600',
                stack: '1'
            },
        ],
    })

    const getStorage = async () => {
        setLoading(true)
        await axios.post('/api/v1/storage/get-storage',
        {

        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                setStorage(res.data.storage)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
        setLoading(false)
    }

    const getChart = async () => {
        setLoading(true)
        await axios.post('/api/v1/storage/get-chart',
        {
            
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                setChart(res.data.chart)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
        setLoading(false)
    }

    useEffect(() => {
        getStorage()
        getChart()
    }, [])

    return (
        <Layout>
            {
                loading ? <Spinner /> :
                    <Row style={{
                        minHeight: '100vh',
                        padding: 5
                    }}>
                        <Col span={4}>
                            <Menu style={{
                                height: '100vh'
                            }} onClick={changeContent} selectedKeys={[currentMenu]} mode="vertical" items={menuItems} />
                        </Col>
                        <Col span={20} style={{
                            padding: 10
                        }}>
                            {
                                currentMenu === menuItems[0].key ?
                                    <Statistical storage={storage} chart={chart} onChangeStorage={onChangeStorage} /> : currentMenu === menuItems[1].key ? <History storage={storage} /> : <More />
                            }
                        </Col>
                    </Row>
            }
        </Layout>
    )
}

export default StorageManage