import { useEffect, useState } from 'react';
import { Modal, Button, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const defaultData = (postId, amount, mode) => {
    return {
        type: mode === 'individual' ? 'received' : 'donation',
        postId: postId,
        amount: amount,
        name: 'Sữa',
        unit: 'ml',
        note: null,
    }
}

export default function RequestModal({ amount, mode, userId, postId }) {

    const { user } = useSelector(state => state.user)
    const [visible, setVisible] = useState(false)

    const [data, setData] = useState(null)

    const createRequest = async () => {
        await axios.post('/api/v1/request/create-request',
            {
                data: data
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }).then(res => {
                if (res.data.success) {
                    message.success(res.data.message)
                    setVisible(false)
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    useEffect(() => {
        setData(defaultData(postId, amount, mode))
    }, [visible, setVisible])

    return (
        <>
            <Button type='primary' size='large' style={{
                display: (amount > 0 || amount === 0 && mode === 'individual') && userId !== user?._id ? 'block' : 'none'
            }} onClick={() => setVisible(true)}>Đăng ký nhận</Button>

            <Button type='primary' size='large' style={{
                display: (mode !== 'individual') && userId !== user?._id ? 'block' : 'none'
            }} onClick={() => setVisible(true)}>Ủng hộ</Button>

            <Modal
                open={visible}
                title={
                    amount === 0 ? 
                        mode === 'individual' ? 'Đăng ký nhận' : 'Ủng hộ' :
                        'Ủng hộ'
                }
                onOk={createRequest}
                onCancel={() => setVisible(false)}
                okButtonProps={{
                    size: 'large'
                }}
                cancelButtonProps={{
                    size: 'large'
                }}
            >
                <div style={{
                    display: (mode === 'hospital') ? 'flex' : 'none',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Loại yêu cầu
                    </div>
                    <Select
                        size='large'
                        defaultValue='donation'
                        onChange={(value) => setData({...data, type: value})}
                        options={[
                            {
                                label: 'Cho sữa',
                                value: 'donation'
                            },
                            {
                                label: 'Nhận sữa',
                                value: 'received'
                            }
                        ]}
                    />
                </div>
                <div style={{
                    display: (mode === 'individual' && amount !== 0) || (mode === 'hospital') ? 'none' : 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Tên
                    </div>
                    <Input size='large' onChange={(e) => setData({...data, name: e.target.value})}/>
                </div>

                <div style={{
                    display: mode === 'individual' && amount !== 0 ? 'none' : 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Số lượng
                    </div>
                    <InputNumber size='large' onChange={(value) => setData({...data, amount: value})} style={{width: '100%'}}/>
                </div>

                <div style={{
                    display: mode === 'individual' && amount !== 0 ? 'none' : 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Đơn vị
                    </div>
                    <Input size='large' onChange={(e) => setData({...data, unit: e.target.value})}/>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Ghi chú
                    </div>
                    <Input.TextArea size='large' onChange={(e) => setData({...data, note: e.target.value})}/>
                </div>
            </Modal>
        </>
    )
}