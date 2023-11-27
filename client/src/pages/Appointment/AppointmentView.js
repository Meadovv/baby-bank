import { Divider, Avatar, Button, Space } from 'antd'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { UserOutlined } from '@ant-design/icons'

const AppointmentView = ({ allowAction, handleAppointment, curAppointment }) => {

    const navigate = useNavigate()
    const [searchParam, setSearchParam] = useSearchParams()
    const { user } = useSelector(state => state.user)

    const handleConfirm = async ( confirm ) => {
        handleAppointment(curAppointment._id, 'completed')
        if(confirm) {

        } else {

        }
    }


    return (
        <div style={{
            width: '100%',
            minHeight: '80vh',
            display: searchParam.get('id') === null ? 'none' : 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Divider orientation="center" style={{
                borderColor: 'transparent',
                padding: 5
            }}>
                <h2>Thông tin cuộc hẹn</h2>
            </Divider>
            <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Avatar size={120} icon={<UserOutlined />} />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    margin: 5,
                    width: '50%'
                }}>
                    <h1 style={{
                        margin: 5
                    }}>
                        {
                            curAppointment?.from.name
                        }
                    </h1>
                    <p style={{
                        fontSize: 20,
                        textIndent: 20,
                        lineHeight: 2,
                        textAlign: 'justify'
                    }}>
                        {
                            curAppointment?.message.data.message
                        }
                    </p>
                    <p onClick={() => {
                        navigate(`/post/${curAppointment?.message.post}`)
                    }} style={{
                        cursor: 'pointer',
                        fontSize: 20,
                        textIndent: 20,
                        lineHeight: 2,
                        textAlign: 'justify'
                    }}>
                        {
                            "Post Id (Click to Follow): " + curAppointment?.message.post
                        }
                    </p>
                    <p style={{
                        fontSize: 20,
                        textIndent: 20,
                        lineHeight: 2,
                        textAlign: 'justify'
                    }}>
                        {
                            curAppointment?.message.data.request_type === 'artifact_donation' ?
                                "Ủng hộ Hiện vật: " + curAppointment?.message.data.value :
                                curAppointment?.message.data.request_type === 'money_donation' ?
                                    "Ủng hộ Tiền : " + curAppointment?.message.data.value + " (Ngàn đồng)" :
                                    curAppointment?.message.data.request_type === 'nhan_sua_hospital' ?
                                        "Xin sữa từ bệnh viện : " + curAppointment?.message.data.value + " (ml)" :
                                        curAppointment?.message.data.request_type === 'cho_sua_hospital' ?
                                            "Hiến sữa cho bệnh viện : " + curAppointment?.message.data.value + " (ml)" : "Xin sữa từ người dùng: " + curAppointment?.message.data.value + " (ml)"
                        }
                    </p>
                </div>
            </div>
            <div style={{
                height: '30vh'
            }}></div>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    margin: 5,
                    width: '50%'
                }}>
                    <h1 style={{
                        margin: 5
                    }}>
                        {
                            curAppointment?.to.name
                        }
                    </h1>
                    <p style={{
                        fontSize: 20,
                        textIndent: 20,
                        lineHeight: 2,
                        textAlign: 'justify'
                    }}>
                        {
                            curAppointment?.reply
                        }
                    </p>
                </div>
                <Avatar size={120} icon={<UserOutlined />} />
            </div>
            <Divider orientation="center" style={{
                borderColor: 'transparent',
                padding: 5
            }}>
                <h2>
                    Hành động
                </h2>
            </Divider>
            <Space style={{
                display: allowAction ? '' : 'none'
            }}>
                <Button type='primary' size='large' ghost onClick={() => {handleConfirm(true)}}>Xác nhận thành công</Button>
                <Button type='primary' size='large' ghost danger onClick={() => {handleConfirm(false)}}>Có lỗi xảy ra</Button>
            </Space>

            <Space style={{
                display: allowAction ? 'none' : ''
            }}>
                <Button type='primary' size='large' ghost disabled>
                    {
                        curAppointment.status === 'rejected' ? 'Đã từ chối cuộc hẹn' : 
                            curAppointment.status === 'approved' ? 'Đang chờ phê duyệt' : 'Cuộc hẹn đã hoàn thành'
                    }
                </Button>
            </Space>
        </div>
    )
}

export default AppointmentView