import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            if(state.user.role === 'hospital') {
                if(state.user.doctorAccept.length) {
                    state.user.doctor_number = state.user.doctorAccept.length
                } else {
                    state.user.doctor_number = 0
                }
            }
        },
        removeUser: (state) => {
            state.user = null
        }
    }
})

export const { setUser, removeUser } = userSlice.actions