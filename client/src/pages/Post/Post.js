import { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import PostList from "../../components/PostList/PostList"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { 
    message, 
    Row, 
    Col, 
    Divider, 
    Slider, 
    Button, 
    Select,
    InputNumber
} from "antd"
import webConfig from '../../config/config.json'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const options = [
    {
        label: 'Tất cả',
        value: 'all'
    },
    {
        label: 'Cho sữa',
        value: 'milk'
    },
    {
        label: 'Cho đồ dùng',
        value: 'no-milk'
    },
    {
        label: 'Tổ chức',
        value: 'donation'
    },
    {
        label: 'Bệnh viện',
        value: 'knowledge'
    },
    {
        label: 'Thông báo',
        value: 'admin'
    }
]

const Post = () => {

    const navigate = useNavigate()
    const [postList, setPostList] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();

    const [distance, setDistance] = useState(0)
    const [postType, setPostType] = useState(options[0])
    const [minAmount, setMinAmount] = useState(50)
    const [loading, setLoading] = useState(false)

    const { user } = useSelector(state => state.user)

    const getPostList = async () => {
        setLoading(true)
        await axios.post('/api/v1/post/get-all-post',
            {
                type: searchParams.get('type'),
                min: Number(searchParams.get('min')),
                distance: Number(searchParams.get('distance')),
                location: user?.location
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
            }).then(res => {
                if (res.data.success) {
                    setPostList(res.data.postList)
                } else {
                    setPostList([])
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                message.error(err.message)
            })
        setLoading(false)
    }

    useEffect(() => {
        setDistance(Number(searchParams.get('distance')))
        setPostType(searchParams.get('type'))
        if(searchParams.get('min')) {
            setMinAmount(Number(searchParams.get('min')))
        } else {
            setMinAmount(0)
        }
        getPostList()
    }, [searchParams.get('distance'), searchParams.get('type'), searchParams.get('min')])

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
                            padding: 20,
                        }}>
                            <h2>Loại bài:</h2>
                            <Select
                                style={{
                                    marginTop: 10,
                                    width: '100%'
                                }}
                                value={postType}
                                options={options}
                                onChange={(value) => {
                                    setPostType(value)
                                    if(value !== options[1].value) {
                                        setMinAmount(0)
                                    } else {
                                        setMinAmount(50)
                                    }
                                }}
                            />
                            <InputNumber value={minAmount} addonBefore='Lượng sữa tối thiểu (ml):' style={{
                                marginTop: 10,
                                width: '100%',
                                display: postType === options[1].value ? '' : 'none'
                            }} onChange={(value) => {
                                setMinAmount(Number(value))
                            }}/>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Button type='primary' ghost danger size='large' onClick={() => {
                                navigate('/post?type=all&distance=0')
                            }}>Xóa bộ lọc</Button>

                            <Button type='primary' ghost danger size='large' onClick={() => {
                                if(minAmount) {
                                    navigate(`/post?type=${postType}&min=${minAmount}&distance=${distance}`)
                                } else {
                                    navigate(`/post?type=${postType}&distance=${distance}`)
                                }
                            }} loading={loading}>Áp dụng</Button>
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
                            <PostList posts={postList} columns={4} loading={loading}/>
                        </div>
                    </div>
                </Col>
            </Row>
        </Layout>
    )
}

export default Post