import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./Explore.css";
import { useEffect, useState } from "react";
import PostList from "../../components/PostList/PostList";
import axios from "axios";
import { useSelector } from "react-redux";
import { Select, Modal, Slider, Button } from "antd";

const typeList = [
    {
        label: 'Tất cả',
        value: 'all',
        icon: 'fa-solid fa-globe'
    },
    {
        label: 'Cho sữa',
        value: 'milk',
        icon: 'fa-solid fa-person-breastfeeding'
    },
    {
        label: 'Cho đồ',
        value: 'no-milk',
        icon: 'fa-solid fa-layer-group'
    },
    {
        label: 'Ủng hộ',
        value: 'donation',
        icon: 'fa-solid fa-hand-holding-dollar'
    },
    {
        label: 'Y học',
        value: 'knowledge',
        icon: 'fa-solid fa-stethoscope'
    },
    {
        label: 'Bệnh viện',
        value: 'hospital',
        icon: 'fa-solid fa-hospital'
    },
    {
        label: 'Tổ chức',
        value: 'organization',
        icon: 'fa-solid fa-house-chimney-medical'
    },
    {
        label: 'Thông báo',
        value: 'admin',
        icon: 'fa-solid fa-screwdriver-wrench'
    },
]

export default function Explore() {

    const { user } = useSelector(state => state.user)
    const [current, setCurrent] = useState(typeList[0].value)
    const [postList, setPostList] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState({
        distance: 0,
        amount: 0
    })

    const navigate = useNavigate();

    const getPostList = async () => {
        setLoading(true)
        await axios.post('/api/v1/post/get-all-post',
            {
                type: current,
                ownerId: searchParams.get('userId'),
                location: user?.location,
                filter: filter
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
                }
            }).catch(err => {
                console.log(err)
            })
        setLoading(false)
    }

    useEffect(() => {
        getPostList()
    }, [current, setCurrent])

    useEffect(() => {
        setFilter({
            distance: 0,
            amount: 0
        })
        const type = searchParams.get('type')
        if(searchParams.get('type') && typeList.find(item => item.value === searchParams.get('type'))) setCurrent(type)
        else navigate(`/explore?type=${typeList[0].value}`)
    }, [searchParams])

    return (
        <Layout>
            <Modal
                title="Tìm kiếm"
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={() => {
                    setVisible(false)
                    getPostList()
                }}
                okButtonProps={{
                    size: 'large',
                }}
                cancelButtonProps={{
                    size: 'large',
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}>
                    <div>Khoảng cách (km): </div>
                    <Slider
                        value={filter.distance}
                        min={0}
                        max={20}
                        onChange={(value) => setFilter({...filter, distance: value})}
                    />
                    <div>Đơn vị: Ki-lô-mét (km)</div>
                </div>

                <div style={{
                    display: current === 'milk' ? 'flex' : 'none',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}>
                    <div>Lượng sữa tối thiểu (ml): </div>
                    <Slider
                        value={filter.amount}
                        min={0}
                        max={5000}
                        step={1000}
                        onChange={(value) => setFilter({...filter, amount: value})}
                    />
                </div>
            </Modal>
            <div className="explore-container">
                <div className="title-container-center">
                    <div className="title">Khám phá</div>
                    <Button type="primary" size='large' onClick={() => setVisible(true)}>Tìm kiếm</Button>
                </div>
                <div className="post-type-container">
                    {
                        typeList && typeList.map((type, index) => {
                            return (
                                <div className="post-type" key={index} onClick={() => {
                                    navigate(`/explore?type=${type.value}`)
                                }} style={{
                                    backgroundColor: current === type.value ? '#00308F' : 'white',
                                    color: current === type.value ? 'white' : '#00308F',
                                    borderRadius: 10
                                }}>
                                    <i className={`${type.icon}`}></i>
                                    <p className="post-type-label">{type.label}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="post-type-container-mobile">
                    <Select
                        style={{
                            width: '100%',
                        }}
                        size="large"
                        options={typeList}
                        defaultValue={typeList[0]}
                        onChange={(value) => {
                            navigate(`/explore?type=${value}`)
                        }}
                    />
                </div>
                <PostList posts={postList} loading={loading} type={
                    (current === 'hospital' || current === 'organization') ? 'user' : 'post'
                }/>
            </div>
        </Layout>
    )
}