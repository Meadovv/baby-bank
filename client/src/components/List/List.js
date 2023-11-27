import Layout from '../Layout/Layout'
import { useSearchParams, useNavigate } from "react-router-dom"
import {
    Row,
    Col,
    Divider,
    Slider,
    Button,
    message,
    Card
} from "antd"
import webConfig from '../../config/config.json'
import Spinner from '../Spinner'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const List = ({ type }) => {

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [distance, setDistance] = useState(0)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(state => state.user)

    const getList = async (distance) => {
        await axios.post('/api/v1/function/get-list',
            {
                type: type,
                distance: distance,
                location: user?.location
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setList(res.data.list)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
    }

    useEffect(() => {
        setDistance(Number(searchParams.get('distance')))
        getList(searchParams.get('distance'))
    }, [searchParams.get('distance')])

    return (
        <Layout>
            <Row>
                <Col span={6} style={{
                    padding: 5,
                }}>
                    <div style={{
                        height: '50vh',
                        backgroundColor: '#F0F8FF',
                        borderRadius: 15,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 10
                    }}>
                        <Divider orientation="center" style={{
                            borderColor: 'black',
                            padding: 5
                        }}>
                            <h2>Cài đặt tìm kiếm</h2>
                        </Divider>
                        <div style={{
                            padding: 20,
                        }}>
                            <h2>Khoảng cách (km):</h2>
                            <Slider
                                value={distance}
                                min={webConfig.MIN_DISTANCE}
                                max={webConfig.MAX_DISTANCE}
                                step={1}
                                tooltip={{
                                    open: true,
                                    placement: 'bottom'
                                }}
                                onChange={(value) => {
                                    setDistance(value)
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Button type='primary' ghost danger size='large' onClick={() => {
                                navigate(`/${type}?distance=0`)
                            }}>Xóa bộ lọc</Button>
                            <Button type='primary' ghost danger size='large' onClick={() => {
                                navigate(`/${type}?distance=${distance}`)
                            }}>Áp dụng</Button>
                        </div>
                    </div>
                </Col>
                <Col span={18}>
                    <div style={{
                        padding: 10,
                        minHeight: '100vh'
                    }}>
                        <div style={{
                            maxWidth: 1600,
                            margin: '0 auto'
                        }}>
                            {
                                loading ? <Spinner /> :
                                    <Row gutter={[16, 16]}>
                                        {
                                            list && list.map(item => {

                                                const imageLink = type === 'hospital' ? 
                                                '/images/post/hospital.png' : '/images/post/organization.png'

                                                return (
                                                    <Col span={8} key={item._id}>
                                                        <Card
                                                            cover={<img alt='hospital' src={imageLink} />}
                                                            hoverable
                                                            onClick={() => {
                                                                navigate(`/profile/${item._id}`)
                                                            }}
                                                        >
                                                            <Card.Meta 
                                                                title={item.name} 
                                                                description={"Khoảng cách: " + item.distance + " km"}
                                                            />
                                                        </Card>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </Layout>
    )
}

export default List