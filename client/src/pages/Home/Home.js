import Layout from '../../components/Layout/Layout'
import Hero from './Hero/Hero'
import Recommend from './Recommend/Recommend'
import Carousel from './Carousel/Carousel'
import About from './About/About'
import NotificationDrawer from '../../components/NotificationDrawer'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        if(user?.mode === 'admin') {
            navigate('/admin')
        }
    }, [user])

    return (
        <Layout>
            <NotificationDrawer />
            <Hero />
            <About />
            <Carousel />
            <Recommend  
                title={"Bài viết mới"} 
                seeMore={'/post?type=all&distance=0'} 
                getLink={'/api/v1/function/get-new-post'}
            />
            <Recommend  
                title={"Bài viết cho sữa"} 
                seeMore={'/post?type=milk&distance=0'} 
                getLink={'/api/v1/function/get-individual-milk-new-post'}
            />
            <Recommend  
                title={"Bài viết cho đồ dùng"} 
                seeMore={'/post?type=no-milk&distance=0'} 
                getLink={'/api/v1/function/get-individual-no-milk-new-post'}
            />
            <Recommend  
                title={"Bài viết của bệnh viện"} 
                seeMore={'/post?type=knowledge&distance=0'} 
                getLink={'/api/v1/function/get-hospital-new-post'}
            />
            <Recommend  
                title={"Bài viết của tổ chức"} 
                seeMore={'/post?type=donation&distance=0'} 
                getLink={'/api/v1/function/get-organization-new-post'}
            />
            <Recommend  
                title={"THÔNG BÁO TỪ QUẢN TRỊ VIÊN"} 
                seeMore={'/post?type=admin&distance=0'} 
                getLink={'/api/v1/function/get-admin-new-post'}
            />
        </Layout>
    )
}

export default Home