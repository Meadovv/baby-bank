import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Recovery() {

    const { token } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState(false)

    const recovery = async (token) => {
        await axios.get(`/api/v1/authentication/recovery/${token}`)
            .then(res => {
                if(res.data.success) {
                    message.success(res.data.message)
                    setStatus(true)
                } else {
                    message.error(res.data.message)
                    setStatus(false)
                }
            })
            .catch(err => {
                console.log(err.response.data)
            })
    }

    useEffect(() => {
        recovery(token)
    }, [token])

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem'
        }}>
            {
                status ? 'Thành công' : 'Thất bại'
            }
        </div>
    )
}