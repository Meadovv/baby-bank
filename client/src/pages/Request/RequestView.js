import { UserOutlined } from '@ant-design/icons'
import { Tag, Button, Divider, Avatar, Space } from 'antd'
import ScheduleModal from "../../components/Modal/ScheduleModal"
import { useNavigate, useSearchParams } from "react-router-dom"

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const RequestView = ({ handleRequest, curRequest }) => {

    const navigate = useNavigate()
    const [searchParam, setSearchParam] = useSearchParams()

    return (
        <div style={{
            width: '100%',
            minHeight: '80vh',
            display: searchParam.get('id') === null ? 'none' : 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Divider orientation="right" style={{
                borderColor: 'black',
                padding: 5
            }}>
                <h2>Thông tin người gửi yêu cầu</h2>
            </Divider>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Avatar size={120} icon={<UserOutlined />} >
                        {
                            curRequest.from?.mode === 'individual' ? 'Cá nhân' :
                                curRequest.from?.mode === 'hospital' ? 'Bệnh viện' : 'Tổ chức'
                        }
                    </Avatar>
                    <div style={{
                        margin: 15,
                    }}>
                        <h2 style={{
                            fontSize: 30,
                            cursor: 'pointer'
                        }} onClick={() => {
                            navigate(`/profile/${curRequest.from?._id}`)
                        }}>
                            {
                                curRequest.from?.name
                            }
                        </h2>
                        <hr style={{ border: '1px solid black', marginTop: 10 }} />
                        <Tag color="geekblue" style={{ fontSize: 20, height: 30, padding: 5, marginTop: 15, borderColor: 'blue' }}>
                            {
                                curRequest.from?.mode === 'individual' ? 'Cá nhân' :
                                    curRequest.from?.mode === 'hospital' ? 'Bệnh viện' : 'Tổ chức'
                            }
                        </Tag>
                    </div>
                </div>

                <div style={{ margin: 20 }}>
                    <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-fingerprint fa-xl" /> ID</h2>
                    <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curRequest.from?._id}</h3>
                </div>

                <div style={{ margin: 20 }}>
                    <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-phone fa-xl" /> Điện thoại</h2>
                    <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curRequest.from?.phone.value}</h3>
                </div>

                <div style={{ margin: 20 }}>
                    <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-at fa-xl" /> Email</h2>
                    <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curRequest.from?.email.value}</h3>
                </div>

                <div style={{ margin: 20 }}>
                    <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-location-dot fa-xl" /> Địa chỉ</h2>
                    <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curRequest.from?.location.address}</h3>
                </div>

                <div style={{ margin: 20 }}>
                    <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-check fa-xl" /> Ngày đăng kí</h2>
                    <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{toDate(curRequest.from?.createDate)}</h3>
                </div>
            </div>

            <Divider orientation="right" style={{
                borderColor: 'black',
                padding: 5
            }}>
                <h2>Thông tin yêu cầu</h2>
            </Divider>

            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                {
                    curRequest.type === 'individual' ?
                        <>
                            <div style={{ margin: 20 }}>
                                <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-gift fa-xl" /> Tài nguyên muốn xin</h2>
                                {
                                        isNaN(curRequest.content.data.value) ? 
                                        <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >Đồ vật: {curRequest.content?.data.value}</h3> :
                                        <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >Sữa: {curRequest.content?.data.value} (ml)</h3>
                                    }
                            </div>
                        </> :
                        <>
                            <div style={{ margin: 20 }}>
                                <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-truck-fast fa-xl" /> Tài nguyên</h2>
                                <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >
                                    {
                                        curRequest?.content.data.request_type === 'artifact_donation' ?
                                            <div>Hiện vật: {curRequest?.content.data.value}</div> :
                                            curRequest?.content.data.request_type === 'money_donation' ?
                                                <div>Tiền: {curRequest?.content.data.value} Ngàn đồng</div> :
                                                curRequest?.content.data.request_type === 'nhan_sua_hospital' ?
                                                    <div>Nhận sữa: {curRequest?.content.data.value} (ml)</div> : <div>Cho sữa: {curRequest?.content.data.value} (ml)</div>
                                    }
                                </h3>
                            </div>
                        </>
                }

                <div style={{ margin: 20 }}>
                    <h2 style={{ fontSize: 20 }}><i className="fa-solid fa-comment fa-xl" /> Lời nhắn</h2>
                    <h3 style={{ margin: 5, fontSize: 20, fontWeight: 'normal' }} >{curRequest.content?.data.message}</h3>
                </div>
            </div>

            <Divider orientation="right" style={{
                borderColor: 'black',
                padding: 5
            }}>
                <h2>Hành động</h2>
            </Divider>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Space style={{
                    margin: 5
                }}>
                    {
                        curRequest.status === 'pending' ?
                            <>
                                <ScheduleModal curRequest={curRequest} />
                                <Button type='primary' size='large' ghost danger onClick={() => {
                                    handleRequest(curRequest._id, 'rejected', curRequest.appointmentId)
                                    navigate('/request')
                                }}>Từ chối</Button>
                            </> :
                            <>
                                <Button type='primary' size='large' ghost disabled>
                                    {
                                        curRequest.status === 'rejected' ? 'Đã từ chối' : 'Đã đồng ý'
                                    }
                                </Button>
                            </>
                    }
                </Space>
            </div>
        </div>
    )
}

export default RequestView