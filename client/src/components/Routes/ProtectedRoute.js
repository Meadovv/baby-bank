import { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../reducer/actions/alertSlice';
import { setUser } from '../../reducer/actions/userSlice';

export default function ProtectedRoute({ children, admin }) {

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)

    // eslint-disable-next-line
    const getUser = async () => {
        try {
            dispatch(showLoading())
            const user = await axios.post('/api/v1/authentication/get-user-data',
                {
                    // request body
                },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                    },
                })
            dispatch(hideLoading())
            if (user.data.success) {
                dispatch(setUser(user.data.user))
            } else {
                <Navigate to='/login' />
                localStorage.clear()

            }
        } catch (err) {
            dispatch(hideLoading())
            localStorage.clear()
            console.log(err)
        }
    }

    useEffect(() => {
        if (!user) {
            getUser()
        }
    }, [user, getUser])

    if (localStorage.getItem('token')) {
        if(admin) {
            if(user?.mode === 'admin') return children
            else return <Navigate to='/' />
        } else return children;
    } else {
        return <Navigate to='/login' />
    }
}