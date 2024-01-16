import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { message, Button, Input } from 'antd'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../reducer/actions/alertSlice';
import "./Login.css";
import { useNavigate } from 'react-router-dom';


export default function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
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
        <div className='container'>
            <div className='side-background-container'>
                <img className='side-background' src='/images/login.png' alt='background'/>
            </div>
            <div className='form-container'>
                <div className='logo-container'>
                    <img className='auth-logo' src='/images/logo.png' alt='logo'/>
                </div>
                <div className='form'>
                    <h2>Đăng nhập</h2>
                    <div className='form-item' style={{
                        display: 'flex'
                    }}>
                        <label className='form-label'>Tên đăng nhập</label>
                        <Input size='large' onChange={(e) => setForm({...form, username: e.target.value})}/>
                    </div>

                    <div className='form-item' style={{
                        display: 'flex'
                    }}>
                        <label className='form-label'>Mật khẩu</label>
                        <Input.Password size='large' onChange={(e) => setForm({...form, password: e.target.value})}/>
                        <label className='form-label'><strong style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }} onClick={() => navigate('/forgot-password')}>Quên mật khẩu</strong></label>
                    </div>

                    <div className='form-item' style={{
                        display: 'flex'
                    }}>
                        <Button type='primary' size='large' onClick={handleLogin}>Đăng nhập</Button>
                        <label className='form-label'>Chưa có tài khoản? <strong style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }} onClick={() => navigate('/register')}>Đăng ký</strong></label>
                    </div>
                </div>
            </div>
        </div>
    )
}