import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, InputNumber, Select, DatePicker, message } from 'antd';
import axios from 'axios';
import "./ItemModal.css"
import moment from 'moment'

const defaultData = {
    action: 'add',
    amount: 0,
    note: ''
}
export default function ItemModal({ user }) {

    const [selectedMonth, setSelectedMonth] = useState(null);

    const handleDateChange = async (date, dateString) => {
      if (date) {
        // Lấy ngày đầu tháng
        const startOfMonth = moment(dateString).startOf('month');
        
        // Lấy ngày cuối tháng
        const endOfMonth = moment(dateString).endOf('month');

        await axios.post('/api/v1/storage/filter',
        {
            start: startOfMonth.valueOf(),
            end: endOfMonth.valueOf()
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then(res => {
            if(res.data.success) {
                setInformation({
                    ...information,
                    filter: res.data.filter
                })
                message.success(res.data.message)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
        })
  
        // Lưu giữ tháng đã chọn
        setSelectedMonth(date);
      }
    };

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(defaultData);
    const [information, setInformation] = useState({
        total: {
            total: 3000,
            add: 4500,
            remove: 1500,
        },
        now: {
            total: 3000,
            add: 4500,
            remove: 1500,
        },
        pre: {
            total: 3000,
            add: 4500,
            remove: 1500,
        },
        filter: {
            total: 0,
            add: 0,
            remove: 0,
        }
    })

    const addItem = async () => {
        await axios.post('/api/v1/storage/add-item',
        {
            data: data
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
                setVisible(false)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const getInformation = async (userId) => {
        await axios.post('/api/v1/storage/get-information',
        {
            data: data
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then(res => {
            if(res.data.success) {
                setInformation(res.data.information)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getInformation(user?._id)
    }, [visible])

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }}>
                <div style={{
                    marginTop: '1rem'
                }}>
                    <Button type='primary' size='large' onClick={() => setVisible(true)}>Hành động</Button>
                </div>
                <div className='information-container'>
                    <div className='information-total-container'>
                        <div className='title'>Tổng cộng</div>
                        <div className='information-total-main-container'>
                            Lượng sữa: {information?.total?.total} ml
                        </div>
                        <div className='information-total-sub-container'>
                            <div className='information-sub-add'>
                                <i className="fa-solid fa-arrow-up" style={{
                                    padding: 5
                                }}></i>
                                Thêm vào: {information?.total?.add} ml
                            </div>

                            <div className='information-sub-remove'>
                                <i className="fa-solid fa-arrow-down" style={{
                                    padding: 5
                                }}></i>
                                Lấy ra: {information?.total?.remove} ml
                            </div>
                        </div>
                    </div>

                    <div className='information-total-container'>
                        <div className='title'>Tháng này</div>
                        <div className='information-total-main-container'>
                            Lượng sữa: {information?.now?.total} ml
                        </div>
                        <div className='information-total-sub-container'>
                            <div className='information-sub-add'>
                                <i className="fa-solid fa-arrow-up" style={{
                                    padding: 5
                                }}></i>
                                Thêm vào: {information?.now?.add} ml
                            </div>

                            <div className='information-sub-remove'>
                                <i className="fa-solid fa-arrow-down" style={{
                                    padding: 5
                                }}></i>
                                Lấy ra: {information?.now?.remove} ml
                            </div>
                        </div>
                    </div>

                    <div className='information-total-container'>
                        <div className='title'>Tháng trước</div>
                        <div className='information-total-main-container'>
                            Lượng sữa: {information?.pre?.total} ml
                        </div>
                        <div className='information-total-sub-container'>
                            <div className='information-sub-add'>
                                <i className="fa-solid fa-arrow-up" style={{
                                    padding: 5
                                }}></i>
                                Thêm vào: {information?.pre?.add} ml
                            </div>

                            <div className='information-sub-remove'>
                                <i className="fa-solid fa-arrow-down" style={{
                                    padding: 5
                                }}></i>
                                Lấy ra: {information?.pre?.remove} ml
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem',
                    borderRadius: 10
                }}>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        padding: '1rem'
                    }}>Xem Chi Tiết 1 Tháng</div>
                    <DatePicker  
                        size='large' 
                        onChange={handleDateChange} 
                        value={selectedMonth}
                        showMonthYearPicker
                        format={'DD/MM/YYYY'}
                    />
                    <div className='information-total-main-container' style={{
                        marginTop: 10
                    }}>
                        Lượng sữa: {information?.filter?.total} ml
                    </div>
                    <div className='information-total-sub-container'>
                        <div className='information-sub-add'>
                            <i className="fa-solid fa-arrow-up" style={{
                                padding: 5
                            }}></i>
                            Thêm vào: {information?.filter?.add} ml
                        </div>

                        <div className='information-sub-remove'>
                            <i className="fa-solid fa-arrow-down" style={{
                                padding: 5
                            }}></i>
                            Lấy ra: {information?.filter?.remove} ml
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Hành động"
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={addItem}
                okButtonProps={{
                    size: 'large',
                }}
                cancelButtonProps={{
                    size: 'large',
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Hành động
                    </div>
                    <Select
                        size='large'
                        value={data.action}
                        options={[
                            {
                                label: 'Thêm vào',
                                value: 'add'
                            },
                            {
                                label: 'Lấy ra',
                                value: 'remove'
                            }
                        ]}
                        onChange={(value) => setData({...data, action: value})}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Số lượng
                    </div>
                    <InputNumber size='large' onChange={(value) => setData({ ...data, amount: value })} style={{ width: '100%' }} />
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Ghi chú
                    </div>
                    <Input.TextArea size='large' onChange={(e) => setData({ ...data, note: e.target.value })} style={{ width: '100%' }} />
                </div>
            </Modal>
        </>
    )
}