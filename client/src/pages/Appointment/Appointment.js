import { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Row, Col, message, List, Card, Tag } from 'antd'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import { useNavigate, useSearchParams } from "react-router-dom"
import AppointmentView from "./AppointmentView"
import { useSelector } from "react-redux"

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const defaultAppointment = {
    _id: '-1',
    from: {
        _id: null,
        name: null
    },
    to: {
        _id: null,
        name: null
    },
    message: {
        post: null,
        data: {
            appointment_type: null,
            message: null,
            value: null
        }
    },
    reply: null,
    status: null,
    createDate: null
}

const Appointment = () => {

    const navigate = useNavigate()
    const [searchParam, setSearchParam] = useSearchParams()
    const { user } = useSelector(state => state.user)

    const [loading, setLoading] = useState(false)
    const [appointmentList, setAppointmentList] = useState([])
    const [curAppointment, setCurAppointment] = useState(defaultAppointment)

    const getAppointmentList = async () => {
        await axios.post('/api/v1/appointment/get-all-appointment',
            {

            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setAppointmentList(res.data.appointmentList)
                } else {
                    message.error(res.data.message)
                    setAppointmentList([])
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const getAppointment = async (appointmentId) => {
        setLoading(true)
        await axios.post('/api/v1/appointment/get-appointment',
            {
                appointmentId: appointmentId
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setCurAppointment(res.data.appointment)
                } else {
                    setCurAppointment(defaultAppointment)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
        setLoading(false)
    }

    const handleAppointment = async (appointmentId, status) => {
        await axios.post('/api/v1/appointment/handle-appointment',
            {
                appointmentId: appointmentId,
                status: status
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    message.success(res.data.message)
                } else {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
        navigate('/appointment')
    }

    useEffect(() => {
        getAppointmentList()
        if (searchParam.get('id')) {
            getAppointment(searchParam.get('id'))
        } else {
            setCurAppointment(defaultAppointment)
        }
    }, [searchParam.get('id')])

    return (
        <Layout>
            <Row style={{
                minHeight: '90vh'
            }}>
                <Col span={8} style={{
                    padding: 10
                }}>
                    <h1>Danh sách cuộc hẹn</h1>
                    <List
                        pagination={{
                            align: 'center',
                            position: 'bottom',
                            pageSize: 5
                        }}
                        dataSource={appointmentList}
                        renderItem={(appointment, index) => (
                            <Card
                                hoverable
                                title={toDate(appointment.createDate)}
                                extra={<>
                                    {
                                        appointment.status === 'pending' ?
                                            <Tag icon={<SyncOutlined spin />} color="processing">Đang chờ</Tag> :
                                            appointment.status === 'approved' ?
                                                <Tag icon={<ClockCircleOutlined />} color="blue">Chấp nhận</Tag> :
                                                    appointment.status === 'rejected' ?
                                                    <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag> :
                                                    <Tag icon={<CheckCircleOutlined />} color="success">Hoàn thành</Tag>
                                    }
                                    {
                                        appointment.to === user?._id && appointment.status === 'approved' ?
                                            <Tag icon={<ExclamationCircleOutlined />} color="warning">
                                                Hành động
                                            </Tag> : null
                                    }
                                </>

                                }
                                style={{
                                    marginTop: 10,
                                }}
                                headStyle={{
                                    backgroundColor: searchParam.get('id') === appointment._id ? '#7CB9E8' : 'white',
                                    color: searchParam.get('id') === appointment._id ? '#ffffff' : 'black'
                                }}
                                onClick={() => {
                                    navigate(`/appointment?id=${appointment._id}`)
                                }}
                            >
                                <Card.Meta
                                    title={
                                        appointment.from === user._id ?
                                            appointment.status === 'pending' ?
                                                'Đang chờ cuộc hẹn xét duyệt' :
                                                appointment.status === 'approved' ?
                                                    'Cuộc hẹn đã được chấp nhận' :
                                                        appointment.status === 'rejected' ?
                                                        'Cuộc hẹn đã bị từ chối' : 
                                                        'Cuộc hẹn đã hoàn thành' :
                                            'Bạn có cuộc hẹn mới'
                                    }
                                    description={appointment.message.data.message}
                                />
                            </Card>
                        )}
                    />
                </Col>
                <Col span={16} style={{
                    padding: 10
                }}>
                    <div style={{
                        display: searchParam.get('id') === null ? 'flex' : 'none',
                        width: '100%',
                        minHeight: '80vh',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <i className="fa-solid fa-comments fa-2xl"></i>
                    </div>
                    {
                        loading ? <Spinner /> :
                            <AppointmentView
                                allowAction={curAppointment.from._id !== user?._id && curAppointment.status === 'approved'}
                                handleAppointment={handleAppointment}
                                curAppointment={curAppointment}
                            />
                    }
                </Col>
            </Row>
        </Layout>
    )
}

export default Appointment