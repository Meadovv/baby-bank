import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import ChatDrawer from '../Chat/ChatDrawer'
import { useSelector } from 'react-redux'

const Layout = ({ children }) => {

    const { user } = useSelector(state => state.user)

    return (
        <div>
            {
                user?.mode === 'admin' ? <></> : <ChatDrawer />
            }
            <Header/>
            {children}
            <Footer />
        </div>
    )
}

export default Layout