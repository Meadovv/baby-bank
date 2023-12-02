import { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { Input, message, Divider, Radio } from 'antd'
import axios from 'axios'

const AdminAccountManager = () => {

    const [userList, setUserList] = useState([])
    const [key, setKey] = useState('all')

    const getUserList = () => {
        axios.post('/api/v1/admin/get-user-list',
            {
                key: key
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setUserList(res.data.userList)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const handleChange = async (_id, key, value) => {
        await axios.post('/api/v1/admin/account-setting',
        {
            _id: _id,
            key: key,
            value: value
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },   
        }).then(res => {
            if(res.data.success) {
                message.success(res.data.message)
            } else {
                message.error(res.data.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }

    useEffect(() => {
        getUserList()
    }, [key, setKey])

    return (
        <Layout>
            <div style={{
                width: '100%',
                height: '100vh',
                padding: 10
            }}>
                <Input.Search
                    size='large'
                    enterButton={'Tìm kiếm'}
                    onSearch={(value) => {
                        setKey(value)
                    }}
                    allowClear
                    style={{
                        width: '100%',
                        marginTop: 10
                    }}
                />
                <div style={{
                    overflow: 'auto',
                    height: '80vh',
                    width: '100%',
                    marginTop: 10,
                    padding: 10
                }}>
                    {
                        userList && userList.map((user, index) => {

                            return (
                                <div key={user._id} style={{
                                    border: '1px solid black',
                                    borderRadius: 10,
                                    height: '20vh',
                                    width: '100%',
                                    marginTop: 10,
                                    padding: 10
                                }}>
                                    <div style={{
                                        display: 'flex'
                                    }}>
                                        <div style={{
                                            fontSize: 24,
                                            fontWeight: 'bold'
                                        }}>{user.name}</div>
                                        <div style={{
                                            fontSize: 24,
                                            marginLeft: 10,
                                            marginRight: 10
                                        }}> - </div>
                                        <div style={{
                                            fontSize: 24
                                        }}>{user._id}</div>
                                        <div style={{
                                            fontSize: 24,
                                            marginLeft: 10,
                                            marginRight: 10
                                        }}> - </div>
                                        <div style={{
                                            fontSize: 24
                                        }}>{user.username}</div>
                                    </div>
                                    <Divider orientation="left" style={{
                                        borderColor: 'black'
                                    }}>
                                        <h3>CÀI ĐẶT</h3>
                                    </Divider>
                                    <div style={{
                                        display: 'flex',
                                        padding: 10
                                    }}>
                                        <div style={{
                                            width: '50%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <strong>TRẠNG THÁI TÀI KHOẢN</strong>
                                            <Radio.Group defaultValue={user.active} style={{
                                                marginTop: 10,
                                                width: '80%',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }} onChange={(event) => {
                                                handleChange(user._id, 'active', event.target.value)
                                            }}>
                                                <Radio value={true}>Kích hoạt</Radio>
                                                <Radio value={false}>Không Kích hoạt</Radio>
                                            </Radio.Group>
                                        </div>

                                        <div style={{
                                            width: '50%',
                                        }}>
                                            <strong>CHẾ ĐỘ</strong>
                                            <Radio.Group defaultValue={user.mode} style={{
                                                marginTop: 10,
                                                width: '80%',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }} onChange={(event) => {
                                                handleChange(user._id, 'mode', event.target.value)
                                            }}>
                                                <Radio value={'individual'}>Người dùng</Radio>
                                                <Radio value={'organization'}>Tổ chức</Radio>
                                                <Radio value={'hospital'}>Bệnh viện</Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Layout>
    )
}

export default AdminAccountManager