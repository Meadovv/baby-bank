import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Recovery() {

    const { token } = useParams()
    const navigate = useNavigate()

    const recovery = async (token) => {
        await axios.get(`/api/v1/authentication/recovery/${token}`)
            .then(res => {
                if(res.data.success) {
                    message.success(res.data.message)
                    navigate('/login')
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log(err.response.data)
            })
    }

    useEffect(() => {
        recovery(token)
    }, [token])

    return null
}