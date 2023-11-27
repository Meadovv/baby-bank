import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { message, Button, Input } from 'antd'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../reducer/actions/alertSlice';

export default function Login() {

    const dispatch = useDispatch()
    const [form, setForm] = useState({
        username: null,
        password: null
    })

    const handleLogin = async () => {
        if(!form.username || !form.password) {
            message.error('Chưa nhập đủ thông tin')
            return
        }
        dispatch(showLoading())
        await axios.post('/api/v1/authentication/login',
        form,
        {
            // header
        }).then(res => {
            if(res.data.success) {
                localStorage.setItem('token', res.data.token)
                message.success(res.data.message)
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
                <img className='w-full h-full object-cover' src='/images/login.png' alt="login-background"/>
            </div>
            <div className='bg-white-100 flex flex-col justify-center'>
                <div className='flex justify-center items-center'>
                    <img className='w-50 h-auto max-w-xl' alt='logo' src='/images/logo.png' style={{
                    width: '30%'}}/>
                </div>
                <form className='max-w-[400px] w-full mx-auto bg-white p-4'>
                    <h2 className='text-4xl font-bold text-center py-6'>Đăng nhập</h2>
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
                    <Button 
                        type='primary'
                        size='large'
                        block
                        onClick={handleLogin}
                        style={{
                            marginTop: 10
                        }}
                    >Đăng nhập</Button>
                    <div style={{
                        marginTop: 10,
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Link to='/register' style={{ textDecoration: 'none' }}>Tạo tài khoản mới</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}