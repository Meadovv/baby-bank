import { useEffect, useRef, useState } from "react";
import {
    Button,
    Row, Col,
    Space,
    Slider,
    Input,
    Select,
    Divider,
    Modal,
    Form
} from 'antd'
import webConfig from "../../config/config.json"
import ImageView from "./ImageView";

const EditPanel = ({ modalStatus, onOk, onCancel, modalForm }) => {
    const uploadButton = useRef(null)
    const [image, setImage] = useState(null)

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        })

    useEffect(() => {
        if (modalForm.getFieldValue('type') === 'image') {
            setImage(modalForm.getFieldValue('data'))
        }
    }, [modalStatus])

    const clearCache = () => {
        setImage(null)
    }

    const onImageUploaded = async (event) => {
        setImage(await getBase64(event.target.files[0]))
    }

    return (
        <>
            <input
                type='file'
                ref={uploadButton}
                style={{ display: 'none' }}
                onChange={onImageUploaded}
            />
            <Modal
                forceRender
                width={1200}
                open={modalStatus}
                onOk={() => {
                    if (modalForm.getFieldValue('type') === 'image')
                        modalForm.setFieldValue('data', image)
                    onOk(modalForm.getFieldValue())
                }}
                onCancel={() => {
                    clearCache()
                    onCancel()
                }}
            >
                <Form
                    form={modalForm}
                    layout='vertical'
                >
                    <h1>
                        {
                            modalForm.getFieldValue('type') === 'image' ? 'Chỉnh sửa hình ảnh' :
                                modalForm.getFieldValue('type') === 'heading' ? 'Chỉnh sửa tiêu đề' : 'Chỉnh sửa đoạn văn'
                        }
                    </h1>
                    {
                        !(modalForm.getFieldValue('type') === 'image') ? null :
                            <Row>
                                <Col span={16} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {
                                        image ? <img alt='example' src={image} style={{
                                            width: modalForm.getFieldValue('imageScale')
                                        }} /> :
                                            <div style={{
                                                width: 250,
                                                height: 250,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <p>UPLOAD IMAGE</p>
                                            </div>
                                    }
                                </Col>
                                <Col span={8} style={{
                                    paddingLeft: 10
                                }}>
                                    <Space direction='vertical' style={{
                                        width: '100%'
                                    }}>
                                        <Button type='primary' ghost danger onClick={() => {
                                            uploadButton.current.click()
                                        }}>Thay thế</Button>
                                        <Form.Item
                                            label='Tên'
                                            name='imageName'
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label='Độ lớn'
                                            name='imageScale'
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Space>
                                </Col>
                            </Row>
                    }
                    <Form.Item
                        label={
                            modalForm.getFieldValue('type') === 'heading' ? 'Heading' :
                                modalForm.getFieldValue('type') === 'paragraph' ? 'Paragraph' : 'Image'
                        }
                        name='data'
                        hidden={modalForm.getFieldValue('type') === 'image'}
                    >
                        {
                            modalForm.getFieldValue('type') === 'heading' ?
                                <Input /> :
                                <Input.TextArea style={{ height: '50vh' }} />
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const PostEdit = ({ user, post, handleChange }) => {
    const [selectValue, setSelectValue] = useState('do-something')
    const [content, setContent] = useState(post?.content)
    const [modalStatus, setModalStatus] = useState(false)

    const [modalForm] = Form.useForm()

    const setModalContent = (value) => {
        modalForm.setFieldValue('key', value.key)
        modalForm.setFieldValue('type', value.type)
        modalForm.setFieldValue('data', value.data)
        modalForm.setFieldValue('imageName', value.imageName)
        modalForm.setFieldValue('imageScale', value.imageScale)
    }

    const closeModal = () => {
        modalForm.resetFields()
        setModalStatus(false)
    }

    const submitModal = (value) => {

        modalForm.resetFields()

        let index = -1
        content.forEach((item, _i) => {
            if (item.key === value.key) {
                index = _i
            }
        })

        if (index !== -1) {
            let backupContent = content;
            backupContent[index] = value
            handleContentChange(backupContent)
        } else {
            handleContentChange([...content, value])
        }
        setModalStatus(false)
    }

    const handleContentChange = (value) => {
        setContent(value)
        handleChange('content', value)
    }

    if (user?.mode === 'individual') {

        return (
            <>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 10,
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <h3>Loại bài viết: </h3>
                        <Select
                            style={{
                                width: '90%'
                            }}
                            defaultValue={post?.amount === -1 ? 'thing-donation' : 'milk-donation'}
                            options={[
                                {
                                    label: 'Bài viết cho sữa',
                                    value: 'milk-donation'
                                },
                                {
                                    label: 'Bài viết cho đồ vật',
                                    value: 'thing-donation'
                                }
                            ]}
                            onChange={(value) => {
                                if(value === 'milk-donation') {
                                    handleChange('amount', 1000)
                                } else {
                                    handleChange('amount', -1)
                                }
                            }}
                        />
                    </div>
                </div>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {
                        post?.amount !== -1 ?
                            <div style={{
                                width: '60%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <Slider
                                    style={{
                                        width: '100%'
                                    }}
                                    size='large'
                                    defaultValue={post?.amount}
                                    step={webConfig.MILK_STEP_DONATION}
                                    min={webConfig.MILK_MIN_DONATION}
                                    max={webConfig.MILK_MAX_DONATION}
                                    tooltip={{
                                        open: true,
                                    }}
                                    onChange={(value) => {
                                        handleChange('amount', value)
                                    }}
                                />
                                <h2 style={{
                                    marginTop: 20
                                }}>Lượng sữa bạn muốn cho (ml)</h2>
                            </div> :
                            <div style={{
                                width: '100%',
                                height: '100vh'
                            }}>
                                <Input addonBefore={'Tiêu đề bài viết'} value={post?.title} onChange={(value) => {
                                    handleChange('title', value.target.value)
                                }}/>
                                <div style={{
                                    marginTop: 10
                                }}>
                                    <Input.TextArea 
                                        placeholder={'Nội dung'} 
                                        style={{ height: '45vh', marginTop: 10 }}
                                        defaultValue={content[0]}
                                        onChange={(value) => {
                                            let backupContent = content;
                                            backupContent[0] = value.target.value
                                            setContent(backupContent)
                                        }}
                                    />
                                </div>
                                <div style={{
                                    marginTop: 10
                                }}>
                                    <ImageView content={content} setContent={handleContentChange} allowAction={true}/>
                                </div>
                            </div>
                    }
                </div>
            </>
        )
    } else {
        return (
            <>
                <EditPanel
                    modalStatus={modalStatus}
                    modalForm={modalForm}
                    onOk={submitModal}
                    onCancel={closeModal}
                />
                <Row style={{
                    width: '100%',
                    padding: '1rem',
                    minHeight: '100vh'
                }}>
                    <Col span={22} style={{
                        padding: 10
                    }}>
                        <Space direction="vertical" style={{
                            width: '100%'
                        }}>
                            <Input addonBefore='Tên bài viết' onChange={(value) => {
                                handleChange("title", value.target.value)
                            }} defaultValue={post?.title} />

                            <Input addonBefore='Tên người viết' onChange={(value) => {
                                handleChange("writer", value.target.value)
                            }} defaultValue={post?.writer} />
                        </Space>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            {
                                content && content.map((element, index) => {

                                    if (element.type === 'image') {
                                        return (
                                            <div key={element.key} style={{
                                                marginTop: 10,
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}>
                                                <Space
                                                    direction='vertical'
                                                    style={{
                                                        marginRight: 10
                                                    }}
                                                >
                                                    <Button type='primary' size='large' ghost onClick={() => {
                                                        setModalContent(element)
                                                        setModalStatus(true)
                                                    }}>Chỉnh sửa</Button>
                                                    <Button type='primary' size='large' ghost danger onClick={() => {
                                                        handleContentChange(content.filter(item => item.key !== element.key))
                                                    }}>Xóa</Button>
                                                </Space>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <img alt='example' src={element.data} style={{
                                                        width: element.imageScale ? element.imageScale : '50%'
                                                    }} />
                                                    <p>Hình ảnh: {element.imageName}</p>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={element.key} style={{
                                                marginTop: 10,
                                                marginLeft: 10,
                                                display: 'flex',
                                                width: '100%'
                                            }}>
                                                <Space
                                                    direction='vertical'
                                                    style={{
                                                        marginRight: 10
                                                    }}
                                                >
                                                    <Button type='primary' size='large' ghost onClick={() => {
                                                        setModalContent(element)
                                                        setModalStatus(true)
                                                    }}>Chỉnh sửa</Button>
                                                    <Button type='primary' size='large' ghost danger onClick={() => {
                                                        handleContentChange(content.filter(item => item.key !== element.key))
                                                    }}>Xóa</Button>
                                                </Space>
                                                {
                                                    element.type === 'heading' ? <Divider orientation="left" style={{
                                                        borderColor: 'black'
                                                    }}>
                                                        <h1>{element.data}</h1>
                                                    </Divider> :
                                                        <p style={{
                                                            fontSize: 20,
                                                            textIndent: 20,
                                                            lineHeight: 2,
                                                            textAlign: 'justify'
                                                        }}>{element.data}</p>
                                                }
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </Col>
                    <Col span={2} style={{
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Select value={selectValue} options={[
                            {
                                label: 'Thêm Nội dung',
                                value: 'do-something'
                            },
                            {
                                label: 'Hình ảnh',
                                value: 'add-image'
                            },
                            {
                                label: 'Tiêu đề',
                                value: 'add-heading'
                            },
                            {
                                label: 'Đoạn văn',
                                value: 'add-paragraph'
                            }
                        ]} style={{ position: 'fixed' }} onChange={(value) => {
                            modalForm.setFieldValue('key', Date.now())
                            if (value === 'add-heading') {
                                modalForm.setFieldValue('type', 'heading')
                            }
                            if (value === 'add-paragraph') {
                                modalForm.setFieldValue('type', 'paragraph')
                            }
                            if (value === 'add-image') {
                                modalForm.setFieldValue('type', 'image')
                                modalForm.setFieldValue('imageScale', '50%')
                            }
                            setModalStatus(true)
                            setSelectValue('do-something')
                        }} />
                    </Col>
                </Row>
            </>
        )
    }
}

export default PostEdit