import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { message, Button, Input } from 'antd'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../reducer/actions/alertSlice';
import "./Login.css";
import { useNavigate } from 'react-router-dom';


export default function Forgot() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: null,
        password: null
    })

    const handleForgot = async () => {
        if(!form.email || !form.password) {
            message.error('Chưa nhập đủ thông tin')
            return
        }
        dispatch(showLoading())
        await axios.post('/api/v1/authentication/forgot',
        form,
        {
            // header
        }).then(res => {
            if(res.data.success) {
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
                    <h2>Quên mật khẩu</h2>
                    <div className='form-item' style={{
                        display: 'flex'
                    }}>
                        <label className='form-label'>Email</label>
                        <Input size='large' onChange={(e) => setForm({...form, email: e.target.value})}/>
                    </div>

                    <div className='form-item' style={{
                        display: 'flex'
                    }}>
                        <label className='form-label'>Mật khẩu mới</label>
                        <Input.Password size='large' onChange={(e) => setForm({...form, password: e.target.value})}/>
                    </div>

                    <div className='form-item' style={{
                        display: 'flex'
                    }}>
                        <Button type='primary' size='large' onClick={handleForgot}>Khôi phục</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}