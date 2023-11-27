import { useState, useEffect } from "react"
import { Divider, Radio, List, Card, Statistic, Tag, message } from "antd"
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const History = () => {

    const navigate = useNavigate()

    const [action, setAction] = useState('all')
    const [time, setTime] = useState(0)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)

    const getHistory = async (action, time) => {
        setLoading(true)
        await axios.post('/api/v1/storage/get-history',
            {
                action: action,
                time: time
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setList(res.data.list)
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
        getHistory(action, time)
    }, [action, setAction, time, setTime])

    return (
        <>
            <Divider orientation="left" style={{
                borderColor: 'black',
                padding: 10,
            }}>
                <h2 style={{
                    textTransform: 'uppercase'
                }}>CÀI ĐẶT</h2>
            </Divider>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3>Hành động</h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        marginTop: 10
                    }}>
                        <Radio.Group onChange={(value) => {
                            setAction(value.target.value)
                        }} value={action} style={{
                            width: '90%',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Radio value='all'>Tất cả</Radio>
                            <Radio value='push'>Thêm vào</Radio>
                            <Radio value='pop'>Lấy ra</Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div style={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3>Thời gian</h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        marginTop: 10
                    }}>
                        <Radio.Group onChange={(value) => {
                            setTime(value.target.value)
                        }} value={time} style={{
                            width: '80%',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Radio value={2592000000}>1 Tháng</Radio>
                            <Radio value={7776000000}>3 Tháng</Radio>
                            <Radio value={15552000000}>6 Tháng</Radio>
                            <Radio value={31104000000}>1 Năm</Radio>
                            <Radio value={0}>Tất cả</Radio>
                        </Radio.Group>
                    </div>
                </div>
            </div>
            <List
                loading={loading}
                pagination={{
                    position: 'bottom',
                    defaultPageSize: 10,
                    align: 'center'
                }}
                itemLayout='horizontal'
                dataSource={list}
                renderItem={(item, index) => (
                    <Card
                        hoverable
                        title={
                            item.action === 'push' ? 'HÀNH ĐỘNG THÊM SỮA' : 'HÀNH ĐỘNG LẤY SỮA'
                        }
                        bordered={false}
                        style={{
                            margin: 20
                        }}
                        extra={
                            <Tag color={item.action === 'push' ? '#cf1322' : '#3f8600'}>{toDate(item.createDate)}</Tag>
                        }
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{
                                fontSize: 18
                            }}>
                                <div>
                                    <strong>Nguồn: </strong>
                                    {item.from === 'doctor' ? 'Bác sĩ' : 'Người dùng'}
                                </div>
                                {
                                    item.from === 'doctor' ? <></> : 
                                    <div style={{
                                        cursor: 'pointer'
                                    }}
                                        onClick={() => {
                                            navigate(`/profile/${item.from}`)
                                        }}
                                    >
                                        <strong>ID Người dùng: </strong> {item.from}
                                    </div>
                                }
                            </div>
                            <Statistic
                                value={item.amount}
                                valueStyle={{
                                    color: item.action === 'push' ? '#cf1322' : '#3f8600'
                                }}
                                prefix={
                                    item.action === 'push' ? <ArrowDownOutlined /> : <ArrowUpOutlined />
                                }
                                suffix="ml"
                            />
                        </div>
                    </Card>
                )}
            />
        </>
    )
}

export default History