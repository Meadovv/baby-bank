import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from "react"

const Layout = ({ children }) => {

    const { user } = useSelector(state => state.user)

    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default Layout