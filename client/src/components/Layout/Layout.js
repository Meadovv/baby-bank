import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import ChatDrawer from '../Chat/ChatDrawer'

const Layout = ({ children }) => {

    return (
        <div>
            <ChatDrawer />
            <Header/>
            {children}
            <Footer />
        </div>
    )
}

export default Layout