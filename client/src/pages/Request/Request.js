import { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Row, Col, message, List, Card, Tag  } from 'antd'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import RequestView from "./RequestView"
import { useNavigate, useSearchParams } from "react-router-dom"

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const defaultRequest = {
    _id: '-1',
    from: null,
    to: null,
    content: {
        post: null,
        data: {
            request_type: null,
            message: null,
            value: null
        }
    },
    status: null,
    createDate: null
}

const Request = () => {

    const navigate = useNavigate()
    const [searchParam, setSearchParam] = useSearchParams()

    const [loading, setLoading] = useState(false)
    const [requestList, setRequestList] = useState([])
    const [curRequest, setCurRequest] = useState(defaultRequest)

    const getRequestList = async () => {
        await axios.post('/api/v1/request/get-all-request',
            {

            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setRequestList(res.data.requestList)
                } else {
                    message.error(res.data.message)
                    setRequestList([])
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    const getRequest = async (requestId) => {
        setLoading(true)
        await axios.post('/api/v1/request/get-request',
            {
                requestId: requestId
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setCurRequest(res.data.request)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
        setLoading(false)
    }

    const handleRequest = async (requestId, status, appointmentId) => {
        await axios.post('/api/v1/request/handle-request',
            {
                requestId: requestId,
                status: status,
                appointmentId: appointmentId
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
    }

    useEffect(() => {
        getRequestList()
        if (searchParam.get('id')) {
            getRequest(searchParam.get('id'))
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
                    <h1>Danh sách yêu cầu</h1>
                    <List
                        pagination={{
                            align: 'center',
                            position: 'bottom',
                            pageSize: 5
                        }}
                        dataSource={requestList}
                        renderItem={(request, index) => (
                            <Card
                                hoverable
                                title={toDate(request.createDate)}
                                extra={
                                    request.status === 'pending' ?
                                        <Tag icon={<SyncOutlined spin />} color="processing">Đang chờ</Tag> :
                                        request.status === 'approved' ?
                                            <Tag icon={<CheckCircleOutlined />} color="success">Chấp nhận</Tag> :
                                            <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>

                                }
                                style={{
                                    marginTop: 10,
                                }}
                                headStyle={{
                                    backgroundColor: searchParam.get('id') === request._id ? '#7CB9E8' : 'white',
                                    color: searchParam.get('id') === request._id ? '#ffffff' : 'black'
                                }}
                                onClick={() => {
                                    navigate(`/request?id=${request._id}`)
                                }}
                            >
                                <Card.Meta
                                    title='Bạn có yêu cầu mới'
                                    description={request.content.data.message}
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
                            <RequestView handleRequest={handleRequest} curRequest={curRequest}/>
                    }
                </Col>
            </Row>
        </Layout>
    )
}

export default Request