import { Row, Col, Divider } from 'antd'
import InformationCard from './InformationCard'
import ImageView from '../PostEdit/ImageView'

const toDate = (millis) => {
    const date = new Date(millis)
    return date.toLocaleString('en-GB')
}

const PostView = ({ allowAction, post }) => {

    if (post?.mode === 'individual') {
        return (
            <Row style={{
                width: '100%',
                padding: '1rem',
                minHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    backgroundColor: '#F0F8FF',
                    width: '100%',
                    borderRadius: 10,
                    height: '30vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <InformationCard allowAction={allowAction} post={post} />
                </div>
                <div>
                    <Divider orientation="center" style={{
                        borderColor: 'transparent'
                    }}>
                        <h1 style={{
                            textTransform: 'uppercase'
                        }}>{post?.title}</h1>
                    </Divider>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <h3>Ngày đăng: {toDate(post?.createDate)}</h3>
                    </div>
                    {
                        post?.amount !== -1 ?
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 20
                            }}>
                                <h2>Lượng sữa muốn cho: <strong>{post?.amount}</strong> (ml)</h2>
                            </div> :
                            <div>
                                <div style={{
                                    marginTop: 15,
                                    marginLeft: 10,
                                    display: 'flex',
                                    width: '100%'
                                }}>
                                    <p style={{
                                        fontSize: 20,
                                        textIndent: 20,
                                        lineHeight: 2,
                                        textAlign: 'justify'
                                    }}>{post.content[0]}</p>
                                </div>
                                <ImageView content={post?.content} allowAction={false}/>
                            </div>
                    }
                </div>
            </Row>
        )
    } else {

        return (
            <Row style={{
                width: '100%',
                padding: '1rem',
                minHeight: '90vh'
            }}>
                <div style={{
                    backgroundColor: '#F0F8FF',
                    width: '100%',
                    borderRadius: 10,
                    height: '30vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <InformationCard allowAction={allowAction} post={post} />
                </div>
                <div style={{
                    width: '100%'
                }}>
                    <Divider orientation="center" style={{
                        borderColor: 'transparent'
                    }}>
                        <h1 style={{
                            textTransform: 'uppercase'
                        }}>{post?.title}</h1>
                    </Divider>
                    <Divider orientation="right" style={{
                        borderColor: 'transparent'
                    }}>
                        <h3>Ngày đăng: {toDate(post?.createDate)}</h3>
                    </Divider>
                    {
                        post?.content && post?.content.map((element, index) => {

                            if (element.type === 'image') {
                                return (
                                    <div key={element.key} style={{
                                        marginTop: 10,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img alt='image' src={element.data} style={{
                                            width: element.imageScale
                                        }} />
                                        <h3>Hình ảnh: {element.imageName}</h3>
                                    </div>
                                )
                            }

                            if (element.type === 'heading') {
                                return (
                                    <div key={element.key} style={{
                                        marginTop: 10,
                                        marginLeft: 10,
                                        display: 'flex',
                                        width: '100%'
                                    }}>
                                        <Divider orientation="left" style={{
                                            borderColor: 'gray'
                                        }}>
                                            <h1>{element.data}</h1>
                                        </Divider>
                                    </div>
                                )
                            }

                            if (element.type === 'paragraph') {
                                return (
                                    <div key={element.key} style={{
                                        marginTop: 15,
                                        marginLeft: 10,
                                        display: 'flex',
                                        width: '100%'
                                    }}>
                                        <p style={{
                                            fontSize: 20,
                                            textIndent: 20,
                                            lineHeight: 2,
                                            textAlign: 'justify'
                                        }}>{element.data}</p>
                                    </div>
                                )
                            }
                        })
                    }
                    <Divider orientation="right" style={{
                        borderColor: 'transparent'
                    }}>
                        <h3>Người đăng: {post?.writer}</h3>
                    </Divider>
                </div>
            </Row>
        )
    }
}

export default PostView