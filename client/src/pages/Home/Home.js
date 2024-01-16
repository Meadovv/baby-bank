import Layout from '../../components/Layout/Layout'
import Hero from './Hero/Hero'
import Recommend from './Recommend/Recommend'
import Carousel from './Carousel/Carousel'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()

    return (
        <Layout>
            <Hero />
            <Carousel />
            <Recommend
                title={"Bài viết mới"}
                seeMore={'/explore?type=all'}
                getLink={'/api/v1/function/get-new-post'}
            />
            <Recommend
                title={"Bài viết cho sữa"}
                seeMore={'/explore?type=milk'}
                getLink={'/api/v1/function/get-individual-milk-new-post'}
            />
            <Recommend
                title={"Bài viết cho đồ dùng"}
                seeMore={'/explore?type=no-milk'}
                getLink={'/api/v1/function/get-individual-no-milk-new-post'}
            />
            <Recommend
                title={"Bài viết của bệnh viện"}
                seeMore={'/explore?type=knowledge'}
                getLink={'/api/v1/function/get-hospital-new-post'}
            />
            <Recommend
                title={"Bài viết của tổ chức"}
                seeMore={'/explore?type=donation'}
                getLink={'/api/v1/function/get-organization-new-post'}
            />
            <Recommend
                title={"Thông báo"}
                seeMore={'/explore?type=admin'}
                getLink={'/api/v1/function/get-admin-new-post'}
            />
        </Layout>
    )
}

export default Home