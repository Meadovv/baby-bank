import React, { useEffect, useState } from 'react';
import "./StorageViewer.css"
import Spinner from '../Spinner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Space, Button, message } from 'antd'
import axios from 'axios';

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

export default function StorageViewer({ storageList, loading }) {

    const { user } = useSelector(state => state.user)
    const [current, setCurrent] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setCurrent(null)
    }, [storageList])

    return (
        loading ? <Spinner /> :
            <div className='storage-view-container'>
                <div className={`storage-list-view ${current ? 'deactivate' : 'activate'}`}>
                    {
                        storageList && storageList.map((item, index) => {
                            return (
                                <div key={index} className='item-card-container' style={{
                                    backgroundColor: current?._id === item._id ? '#89CFF0' : 'white',
                                }} onClick={() => setCurrent(item)}>
                                    <div className='item-card-name item-card'>
                                        {item?.action === 'add' ? 'Thêm vào' : 'Lấy ra'} : {item?.amount} ml
                                    </div>
                                    <div className='item-card-date item-card'>
                                        Thời gian: {toDate(item.createDate)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className='storage-current-view'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <i className={`fa-solid fa-arrow-left`} onClick={() => setCurrent(null)}></i>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div className='storage-current-view-container' style={{
                            display: current ? 'flex' : 'none',
                        }}>

                            <div className='storage-current-card-item' onClick={() => navigate(`/profile/${current?.from._id}`)}>
                                Số lượng: <strong>{current?.amount}</strong>
                            </div>

                            <div className='storage-current-card-item' onClick={() => navigate(`/profile/${current?.from._id}`)}>
                                Ghi chú: <strong>{current?.note}</strong>
                            </div>

                            <div className='storage-current-card-item' onClick={() => navigate(`/profile/${current?.from._id}`)}>
                                Thời gian: <strong>{toDate(current?.createDate)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}