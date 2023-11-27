import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { message, Select, Input, Button, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../reducer/actions/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: null,
        username: null,
        password: null,
        verifyCode: null,
        mode: 'null',
    })

    const sendVerifyCode = async () => {
        if(!form.username) {
            message.error('Nhập email trước')
            return
        }
        setLoading(true)
        await axios.post('/api/v1/authentication/send-verify-code', {
            email: form.username
        })
        .then(res => {
            if(res.data.success) {
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
        if(!form.username || !form.password || !form.name || form.mode === 'null' || !form.verifyCode) {
            message.error('Chưa nhập đủ thông tin')
            return
        }
        dispatch(showLoading())
        await axios.post('/api/v1/authentication/register',
        form,
        {
            // header
        }).then(res => {
            if(res.data.success) {
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
                    width: '30%'}}/>
                </div>
                <form className='max-w-[400px] w-full mx-auto bg-white p-4'>
                    <h2 className='text-4xl font-bold text-center py-6'>Đăng ký</h2>
                    <div className='flex flex-col py-2'>
                        <label>Họ Tên</label>
                        <Input
                            size='large'
                            onChange={(value) => {
                                setForm({...form,
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
                                setForm({...form,
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
                                setForm({...form,
                                    password: value.target.value
                                })
                            }}
                        />
                    </div>
                    <div className='flex flex-col py-2'>
                        <label>Loại tài khoản</label>
                        <Select
                            size='large'
                            defaultValue='null'
                            options={[
                                {
                                    value: 'null',
                                    label: 'Chọn'
                                },
                                {
                                    value: 'individual',
                                    label: 'Cá nhân'
                                },
                                {
                                    value: 'organization',
                                    label: 'Tổ chức'
                                }
                            ]}
                            onChange={(value) => {
                                setForm({...form,
                                    mode: value
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
                                setForm({...form,
                                    verifyCode: value.target.value
                                })
                            }}/>
                            <Button loading={loading} ghost type='primary' size='large' onClick={sendVerifyCode}>
                                Nhận mã
                            </Button>
                        </Space>
                    </div>
                    <Button 
                        type='primary'
                        block
                        onClick={handleRegister}
                        style={{
                            marginTop: 10
                        }}
                        size='large'
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