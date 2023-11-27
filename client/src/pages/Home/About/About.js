import { useEffect, useState } from 'react'
import './About.css'
import { Row, Col, Card, Divider, message } from 'antd'
import axios from 'axios'

const About = () => {

    const [information, setInformation] = useState()

    const getInformation = async () => {
        await axios.get('/api/v1/function/get-web-information')
        .then(res => {
            setInformation(res.data)
        })
        .catch(err => {
            console.log(err)
            message.error(err.message)
        })
    }

    useEffect(() => {
        getInformation()
    }, [])

    return (
        <div className='about-container'>
            <Divider orientation="left" style={{
                borderColor: 'black'
            }}>
                <h2 style={{
                    textTransform: 'uppercase'
                }}>Về chúng tôi</h2>
            </Divider>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card
                        bordered={false}
                        style={{
                            height: '15vh'
                        }}
                        title='TÀI KHOẢN ĐĂNG KÝ'
                    >
                        <Card.Meta title={information?.user} description={`Đăng ký mới trong tháng: ${information?.thisMonth.user}`} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        bordered={false}
                        style={{
                            height: '15vh'
                        }}
                        title='BỆNH VIỆN HỢP TÁC'
                    >
                        <Card.Meta title={information?.hospital} description={`Đăng ký mới trong tháng: ${information?.thisMonth.hospital}`} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        bordered={false}
                        style={{
                            height: '15vh'
                        }}
                        title='BÀI VIẾT TƯƠNG TÁC'
                    >
                        <Card.Meta title={information?.post} description={`Bài viết mới trong tháng: ${information?.thisMonth.post}`} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        bordered={false}
                        style={{
                            height: '15vh'
                        }}
                        title='BÀI VIẾT HỌC THUẬT'
                    >
                        <Card.Meta title={information?.hospitalPost} description={`Bài viết mới trong tháng: ${information?.thisMonth.hospitalPost}`} />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default About