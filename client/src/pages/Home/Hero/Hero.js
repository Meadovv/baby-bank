import './Hero.css'
import { useSelector } from 'react-redux'
import webConfig from '../../../config/config.json'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    const userLastName = user?.name.split(' ')[user?.name.split(' ').length - 1]

    const handleAction = () => {
        if(user && !user?.updated) {
            navigate(`/profile/${user?._id}?action=change-information`)
        } else {
            
        }
    }
    return (
        <div className="my-container">
            <div className='welcome-block'>
                <div className='main-welcome'>
                    {
                        user && !user?.updated ? `Chào Mừng Tới ${webConfig.APP_NAME}, ${userLastName}` : `Chào Mừng Trở Lại, ${userLastName}`
                    }
                </div>
                <div className='sub-welcome'>
                    {
                        user && !user?.updated ? 
                        <div>
                            <div>{`Có vẻ đây là lần đầu bạn sử dụng ${webConfig.APP_NAME},`}</div>
                            <div>Hãy cập nhật một số thông tin để có trải nghiệm hoàn hảo nhất.</div>
                        </div> :
                        <div>
                            <div>Chúc bạn một ngày tốt lành.</div>
                            <div>Ghé thăm Thanh thông báo để biết những hoạt động mới nhất.</div>
                        </div>
                    }
                </div>
                <div className='button-container'>
                    <button className='hero-button' onClick={handleAction}>
                        {
                            user && !user.updated ? "CẬP NHẬT THÔNG TIN" : "XEM THÊM"
                        }
                        <i className='fa fa-long-arrow-alt-right'></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hero