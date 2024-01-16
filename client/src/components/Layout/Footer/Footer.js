import "./Footer.css"
import {
    FacebookOutlined,
    InstagramOutlined,
    GoogleOutlined,
    YoutubeOutlined,
    WhatsAppOutlined
} from '@ant-design/icons'
import webConfig from '../../../config/config.json'
import { useNavigate } from "react-router-dom"


export default function Footer() {

    const navigate = useNavigate()

    return (
        <div className='footer'>
            <div className="footer-web-name">
                {webConfig.APP_NAME}
                <hr className="footer-web-name-line"/>
                <div className="footer-web-name-subtitle">
                    Một giọt sữa, một trái tim
                </div>
            </div>
            <div className="footer-social">
                <FacebookOutlined className="footer-icon" onClick={() => {
                    window.open(webConfig.FACEBOOK_LINK, '_blank')
                }}/>
                <InstagramOutlined className="footer-icon" onClick={() => {
                    window.open(webConfig.INSTAGRAM_LINK, '_blank')
                }}/>
                <GoogleOutlined className="footer-icon" onClick={() => {
                    window.open(webConfig.GOOGLE_LINK, '_blank')
                }}/>
                <YoutubeOutlined className="footer-icon" onClick={() => {
                    window.open(webConfig.YOUTUBE_LINK, '_blank')
                }}/>
                <WhatsAppOutlined className="footer-icon" onClick={() => {
                    window.open(webConfig.PHONE_NUMBER, '_blank')
                }}/>
            </div>
            <div className="footer-dev-information">
                <div className="footer-dev-information-person">Nguyễn Gia Hân</div>
                <div className="footer-dev-information-person">Nguyễn Phương Linh</div>
                <div className="footer-dev-information-person">Copyright © WarmMilk</div>
            </div>
        </div>
    )
}