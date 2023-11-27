import { Avatar, Card } from "antd"
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import ParagraphCard from "./ParagraphCard";

const toDate = ( millis ) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const MessageCard = ({ message }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: message.role === 'bot' ? 'flex-start' : 'flex-end'
        }}>
            <Avatar 
                size={64} 
                icon={<RobotOutlined />}
                style={{
                    display: message.role === 'bot' ? '' : 'none'
                }}
            />
            <Card style={{
                width: '60%',
                margin: 10
            }}>
                <ParagraphCard content={message.content}/>
            </Card>
            <Avatar 
                size={64} 
                icon={<UserOutlined />}
                style={{
                    display: message.role === 'bot' ? 'none' : ''
                }}
            />
        </div>
    )
}

export default MessageCard