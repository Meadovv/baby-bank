import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { message, Select, Input, Button, Space, Checkbox } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../reducer/actions/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [disable, setDisable] = useState(true)

    const [phase, setPhase] = useState(1)
    const [mode, setMode] = useState('individual')

    const [form, setForm] = useState({
        name: null,
        username: null,
        password: null,
        verifyCode: null,
        mode: 'individual',
    })

    const sendVerifyCode = async () => {
        if (!form.username) {
            message.error('Nhập email trước')
            return
        }
        setLoading(true)
        await axios.post('/api/v1/authentication/send-verify-code', {
            email: form.username
        })
            .then(res => {
                if (res.data.success) {
                    message.success(res.data.message)
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
            })
        setLoading(false)
    }

    const handleRegister = async () => {
        if (!form.username || !form.password || !form.name || form.mode === 'null' || !form.verifyCode) {
            message.error('Chưa nhập đủ thông tin')
            return
        }
        dispatch(showLoading())
        await axios.post('/api/v1/authentication/register',
            form,
            {
                // header
            }).then(res => {
                if (res.data.success) {
                    localStorage.setItem('token', res.data.token)
                    message.success(res.data.message)
                    navigate('/login')
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message(err.message)
            })
        dispatch(hideLoading())
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
            <div className='hidden sm:block'>
                <img className='w-full h-full object-cover' src='/images/login.png' alt="login-background" />
            </div>
            <div className='bg-white-100 flex flex-col justify-center'>
                <div className='flex justify-center items-center'>
                    <img className='w-50 h-auto max-w-xl' alt='logo' src='/images/logo.png' style={{
                        width: '30%'
                    }} />
                </div>
                <div className='max-w-[400px] w-full mx-auto bg-white p-4' style={{
                    display: phase === 1 ? '' : 'none'
                }}>
                    <h2 className='text-xl font-bold text-center py-6'>Baby Bank chào mừng bạn mới!</h2>
                    <div className='flex flex-col py-2'>
                        <Select
                            size='large'
                            placeholder='Bạn dùng Baby Bank với vai trò gì...'
                            options={[
                                {
                                    label: 'Người dùng',
                                    value: 'individual'
                                },
                                {
                                    label: 'Bệnh viện',
                                    value: 'hospital'
                                },
                                {
                                    label: 'Tổ chức',
                                    value: 'organization'
                                }
                            ]}
                            onChange={(value) => {
                                setMode(value)
                                setPhase(current => current + 1)
                            }}
                        />
                    </div>
                </div>
                <form className='max-w-[400px] w-full mx-auto bg-white p-4' style={{
                    display: phase === 2 ? '' : 'none'
                }}>
                    <h2 className='text-4xl font-bold text-center py-6'>Đăng ký</h2>
                    <div className='flex flex-col py-2'>
                        <label>
                            {
                                mode === 'individual' ? 'Họ Tên' : 
                                    mode === 'hospital' ? 'Tên Bệnh Viện' : 'Tên Tổ Chức'
                            }
                        </label>
                        <Input
                            size='large'
                            onChange={(value) => {
                                setForm({
                                    ...form,
                                    name: value.target.value
                                })
                            }}
                        />
                    </div>
                    <div className='flex flex-col py-2'>
                        <label>Email</label>
                        <Input
                            size='large'
                            onChange={(value) => {
                                setForm({
                                    ...form,
                                    username: value.target.value
                                })
                            }}
                        />
                    </div>
                    <div className='flex flex-col py-2'>
                        <label>Mật khẩu</label>
                        <Input.Password
                            size='large'
                            onChange={(value) => {
                                setForm({
                                    ...form,
                                    password: value.target.value
                                })
                            }}
                        />
                    </div>
                    <div className='flex flex-col py-2'>
                        <label>Mã xác nhận</label>
                        <Space style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Input size='large' onChange={(value) => {
                                setForm({
                                    ...form,
                                    verifyCode: value.target.value
                                })
                            }} />
                            <Button loading={loading} ghost type='primary' size='large' onClick={sendVerifyCode}>
                                Nhận mã
                            </Button>
                        </Space>
                    </div>
                    <div>
                        <Checkbox onChange={() => {
                            setDisable(current => !current)
                        }}>
                            <div style={{
                                display: 'flex',
                            }}>
                                <div>
                                    Tôi đồng ý với
                                </div>
                                <div style={{
                                    cursor: 'pointer',
                                    color: 'blue',
                                    marginLeft: 5
                                }} onClick={() => {
                                    navigate('/terms-of-use')
                                }}>
                                    Điều khoản sử dụng của Baby Bank
                                </div>
                            </div>
                        </Checkbox>
                    </div>
                    <Button
                        type='primary'
                        block
                        onClick={handleRegister}
                        style={{
                            marginTop: 10
                        }}
                        size='large'
                        disabled={disable}
                    >Đăng ký</Button>
                    <div style={{
                        marginTop: 10,
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Link to='/login' style={{ textDecoration: 'none' }}>Đăng nhập tài khoản</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}