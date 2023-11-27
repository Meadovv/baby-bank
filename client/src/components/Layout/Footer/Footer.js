import "./Footer.css"
import webConfig from '../../../config/config.json'

const Footer = () => {

    return (
        <div className="footer">
            <div className="sb__footer section__padding">
                <hr />
                <div className="sb__footer-below">
                    <div className="sb__footer-copyright">
                        <p>
                            @{new Date().getFullYear()} {webConfig.APP_NAME}. All Right Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer