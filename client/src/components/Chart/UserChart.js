import { Radio, Button, Input, message } from 'antd'
import { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const UserChart = () => {
    const [value, setValue] = useState(10)
    const [content, setContent] = useState()
    const { user } = useSelector(state => state.user)

    const send = async () => {
        await axios.post('/api/v1/notification/send-all',
        {
            distance: value,
            message: content,
            location: user?.location
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
        setContent(null)
    }

    return (
        <>
            <h2>Khoảng cách</h2>
            <Radio.Group onChange={(value) => {
                setValue(value.target.value);
            }} value={value} style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 10
            }}>
                <Radio value={10}>Bán kính 10 km</Radio>
                <Radio value={15}>Bán kính 15 km</Radio>
                <Radio value={20}>Bán kính 20 km</Radio>
                <Radio value={25}>Bán kính 25 km</Radio>
            </Radio.Group>
            <h2>Lời nhắn</h2>
            <div style={{
                padding: 10
            }}>
                <Input.TextArea style={{
                    height: '30vh'
                }} onChange={(value) => {
                    setContent(value.target.value)
                }} value={content}/>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: 10
            }}>
                <Button type='primary' ghost onClick={send}>Gửi thông báo</Button>
            </div>
        </>
    )
}

export default UserChart