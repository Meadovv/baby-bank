import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { removeUser } from '../../reducer/actions/userSlice'

const Logout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        localStorage.clear()
        navigate('/login')
        dispatch(removeUser())
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            Đăng xuất thành công
        </div>
    )
}

export default Logout