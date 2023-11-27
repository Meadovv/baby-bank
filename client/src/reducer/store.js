import { configureStore } from '@reduxjs/toolkit'
import { alertSlice } from './actions/alertSlice'
import { userSlice } from './actions/userSlice'

export default configureStore({
    reducer: {
        alerts: alertSlice.reducer,
        user: userSlice.reducer,
    },
})