import React, { useState } from 'react'
import { message, Button, Input, Checkbox, Select } from 'antd'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../reducer/actions/alertSlice';
import "./Login.css";
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: null,
        password: null,
        email: null,
        mode: null
    })

    const [checked, setChecked] = useState(false)

    const handleRegister = async () => {
        if (!form.name || !form.password || !form.email) {
            message.error('Chưa nhập đủ thông tin')
            return
        }
        dispatch(showLoading())
        await axios.post('/api/v1/authentication/register',
            {user: form},
            {
                // header
            }).then(res => {
                if (res.data.success) {
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
        <div className='container'>
            <div className='side-background-container'>
                <img className='side-background' src='/images/login.png' alt='background' />
            </div>
            <div className='form-container'>
                <div className='logo-container'>
                    <img className='auth-logo' src='/images/logo.png' alt='logo' />
                </div>
                <div className='form'>
                    <h2>
                        {
                            form.mode === null ? 'Chào mừng bạn tới Baby Bank' : 'Đăng ký'
                        }
                    </h2>

                    <div className='form-item' style={{
                        display: form.mode === null ? 'flex' : 'none'
                    }}>
                        <label className='form-label'>Loại tài khoản</label>
                        <Select
                            size='large'
                            placeholder='Chọn loại tài khoản'
                            onChange={(value) => setForm({ ...form, mode: value })}
                            options={[
                                {
                                    label: 'Người dùng',
                                    value: 'individual'
                                },
                                {
                                    label: 'Tổ chức',
                                    value: 'organization'
                                },
                                {
                                    label: 'Bệnh viện',
                                    value: 'hospital'
                                }
                            ]}
                        />
                    </div>

                    <div className='form-item' style={{
                        display: form.mode !== null ? 'flex' : 'none'
                    }}>
                        <label className='form-label'>
                            {
                                form.mode === 'individual' ? 'Tên người dùng' : form.mode === 'organization' ? 'Tên tổ chức' : 'Tên bệnh viện'
                            }
                        </label>
                        <Input size='large' onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>

                    <div className='form-item' style={{
                        display: form.mode !== null ? 'flex' : 'none'
                    }}>
                        <label className='form-label'>Email</label>
                        <Input size='large' onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>

                    <div className='form-item' style={{
                        display: form.mode !== null ? 'flex' : 'none'
                    }}>
                        <label className='form-label'>Mật khẩu</label>
                        <Input.Password size='large' onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        <Checkbox className='form-label' checked={checked} onChange={(e) => setChecked(e.target.checked)}>Tôi đồng ý với <strong style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }} onClick={() => navigate('/terms-of-use')}>điều khoản của Baby Bank</strong></Checkbox>
                    </div>

                    <div className='form-item' style={{
                        display: form.mode !== null ? 'flex' : 'none'
                    }}>
                        <Button type='primary' size='large' onClick={handleRegister} disabled={!checked}>Đăng ký</Button>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <label className='form-label'><strong style={{
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }} onClick={() => setForm({...form, mode: null})}>Trước đó</strong></label>
                            <label className='form-label'>Đã có tài khoản? <strong style={{
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/login')}>Đăng nhập</strong></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}