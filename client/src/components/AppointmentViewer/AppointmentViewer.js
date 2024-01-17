import React, { useEffect, useState } from 'react';
import "./AppointmentViewer.css"
import Spinner from '../Spinner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Space, Button, message } from 'antd'
import axios from 'axios';

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}


export default function AppointmentViewer({ appointmentList, loading }) {

    const { user } = useSelector(state => state.user)
    const [current, setCurrent] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setCurrent(null)
    }, [appointmentList])

    const approved = async () => {
        await axios.post('/api/v1/request/approve-request',
        {
            requestId: current?._id,
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
                setCurrent(null)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }

    const rejected = async () => {
        await axios.post('/api/v1/request/reject-request',
        {
            requestId: current?._id,
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
                setCurrent(null)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }

    return (
        loading ? <Spinner /> :
            <div className='appointment-view-container'>
                <div className={`appointment-list-view ${current ? 'deactivate' : 'activate'}`}>
                    {
                        appointmentList && appointmentList.map((appointment, index) => {
                            return (
                                <div key={index} className='appointment-card-container' style={{
                                    backgroundColor: current?._id === appointment._id ? '#89CFF0' : 'white',
                                }} onClick={() => setCurrent(appointment)}>

                                    <div className='appointment-card-sticker' style={{
                                        display: (appointment.status !== 'completed' && appointment.status !== 'rejected') && appointment.to._id === user?._id ? 'flex' : 'none',
                                    }}>
                                        <i className="fa-solid fa-triangle-exclamation" style={{
                                            marginRight: 10,
                                        }}></i>Hành động
                                    </div>

                                    <div className='appointment-card-name appointment-card-item'>
                                        Người gửi: {appointment.from.name}
                                    </div>

                                    <div className='appointment-card-name appointment-card-item'>
                                        Người nhận: {appointment.to.name}
                                    </div>

                                    <div className='appointment-card-date appointment-card-item'>
                                        Thời gian gửi: {toDate(appointment.createDate)}
                                    </div>

                                    <div className='appointment-card-status appointment-card-item'>
                                        Trạng thái: {appointment.status === 'pending' ? 'Đang chờ' :
                                            appointment.status === 'approved' ? 'Đã chấp nhận' :
                                                appointment.status === 'rejected' ? 'Đã từ chối' : 'Đã hoàn thành'}
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>

                <div className='appointment-current-view'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{
                            display: current ? 'flex' : 'none',
                            justifyContent: 'space-between',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <i className={`fa-solid fa-arrow-left`} onClick={() => setCurrent(null)}></i>
                            <div>Chi tiết</div>
                            <i className={`fa-solid fa-message`} onClick={() => navigate(`/chat/${current?.to._id}`)}></i>
                        </div>
                        <div className='appointment-current-view-container' style={{
                            display: current ? 'flex' : 'none',
                        }}>
                            <div className='appointment-current-card-item' style={{
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                textTransform: 'uppercase',
                            }}>
                                {
                                    current?.data.type === 'donation' ? 
                                        current?.from._id === user?._id ? 
                                            'Bạn đang yêu cầu ủng hộ tài nguyên cho người dùng' : 
                                            'Có người dùng muốn ủng hộ tài nguyên cho bạn' : 
                                        current?.from._id === user?._id ?
                                            'Bạn đang yêu cầu tài nguyên từ người dùng' :
                                            'Có người dùng muốn yêu cầu tài nguyên của bạn'
                                }
                            </div>

                            <div className='appointment-current-card-item'>
                                ID: <strong>{current?._id}</strong>
                            </div>

                            <div className='appointment-current-card-item'>
                                Người gửi: <strong>{current?.from.name}</strong>
                            </div>

                            <div className='appointment-current-card-item'>
                                Người nhận: <strong>{current?.to.name}</strong>
                            </div>


                            <div className='appointment-current-card-item' style={{
                                cursor: 'pointer'
                            }} onClick={() => navigate(`/post/${current?.data.postId}/view`)}>
                                Gửi từ bài đăng: <strong style={{
                                    textDecoration: 'underline',
                                    color: 'blue'
                                }}>{current?.data.postId}</strong>
                            </div>
                            
                            <div className='appointment-current-card-item'>
                                Tên tài nguyên: <strong>{current?.data.name}</strong>
                            </div>

                            <div className='appointment-current-card-item'>
                                Số lượng: <strong>{current?.data.amount}</strong>
                            </div>

                            <div className='appointment-current-card-item'>
                                Đơn vị: <strong>{current?.data.unit}</strong>
                            </div>

                            <div className='appointment-current-card-item'>
                                Ghi chú: <strong>{current?.data.note}</strong>
                            </div>

                            <div className='appointment-current-card-item'>
                                        Trạng thái: <strong>{current?.status === 'pending' ? 'Đang chờ' :
                                            current?.status === 'approved' ? 'Đã chấp nhận' :
                                            current?.status === 'rejected' ? 'Đã từ chối' : 'Đã hoàn thành'}</strong>
                                    </div>

                            <div className='appointment-current-card-item' style={{
                                display: current?.to._id === user?._id && (current?.status !== 'completed' && current?.status !== 'rejected') ? 'flex' : 'none',
                                flexDirection: 'column',
                            }}>
                                Hành động:
                                <Space style={{
                                    marginTop: 10,
                                }}>
                                    <Button type='primary' size='large' onClick={approved}>
                                        {
                                            current?.status === 'approved' ? 'Hoàn thành' : 'Đồng ý'
                                        }
                                    </Button>
                                    <Button type='primary' size='large' danger onClick={rejected}>Từ chối</Button>
                                </Space>
                            </div>

                            <div className='appointment-current-card-item' style={{
                                color: 'red'
                            }}>
                                *Ghi chú từ quản trị viên: <strong>Hãy kiểm tra kỹ thông tin trước khi thực hiện các hành động</strong>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
    )
}