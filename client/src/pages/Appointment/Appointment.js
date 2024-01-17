import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./Appointment.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Select } from "antd";
import { message } from "antd";
import AppointmentViewer from "../../components/AppointmentViewer/AppointmentViewer";

const typeList = [
    {
        label: 'Tất cả',
        value: 'all',
        icon: 'fa-solid fa-calendar'
    },
    {
        label: 'Đang chờ',
        value: 'pending',
        icon: 'fa-solid fa-calendar-minus'
    },
    {
        label: 'Chấp nhận',
        value: 'approved',
        icon: 'fa-solid fa-calendar-check'
    },
    {
        label: 'Từ chối',
        value: 'rejected',
        icon: 'fa-solid fa-calendar-xmark'
    },
    {
        label: 'Hoàn thành',
        value: 'completed',
        icon: 'fa-solid fa-file-zipper'
    }
]

export default function Appointment() {

    const { user } = useSelector(state => state.user)
    const [current, setCurrent] = useState(typeList[0].value)
    const [requestList, setRequestList] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const getRequestList = async () => {
        setLoading(true)
        await axios.post('/api/v1/request/get-all-request',
            {
                status: current,
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
            })
        setLoading(false)
    }

    useEffect(() => {
        getRequestList()
    }, [current, setCurrent])

    useEffect(() => {
        const type = searchParams.get('status')
        if(searchParams.get('status') && typeList.find(item => item.value === searchParams.get('status'))) setCurrent(type)
        else navigate(`/appointment?status=${typeList[0].value}`)
    }, [searchParams])

    return (
        <Layout>
            <div className="explore-container" style={{
                minHeight: '100vh'
            }}>
                <div className="title-container-center">
                    <div className="title">Cuộc hẹn</div>
                </div>
                <div className="post-type-container">
                    {
                        typeList && typeList.map((type, index) => {
                            return (
                                <div className="post-type" key={index} onClick={() => {
                                    navigate(`/appointment?status=${type.value}`)
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
                            navigate(`/appointment?status=${value}`)
                        }}
                    />
                </div>
                <AppointmentViewer appointmentList={requestList} loading={loading} />
            </div>
        </Layout>
    )
}