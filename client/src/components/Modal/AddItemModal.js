import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, InputNumber, message } from 'antd';
import axios from 'axios';

const defaultData = {
    name: 'Sữa',
    amount: 0,
    unit: 'ml',
    note: ''
}
export default function AddItemModal({ mode }) {

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(defaultData);

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

    return (
        <>
            <Button type='primary' size='large' onClick={() => setVisible(true)}>Thêm vào kho</Button>
            <Modal
                title="Thêm vào kho"
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
                    display: mode === 'hospital' ? 'none' : 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Tên
                    </div>
                    <Input size='large' onChange={(e) => setData({ ...data, name: e.target.value })} style={{ width: '100%' }} />
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
                    display: mode === 'hospital' ? 'none' : 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '1rem',
                    }}>
                        Đơn vị
                    </div>
                    <Input size='large' onChange={(e) => setData({ ...data, unit: e.target.value })} style={{ width: '100%' }} />
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