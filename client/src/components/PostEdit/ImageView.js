import { useState, useRef } from "react"
import { Button, Space } from 'antd'

const ImageView = ({ content, setContent, allowAction }) => {

    const [imgIndex, setImgIndex] = useState(content.length - 1)

    const uploadButton = useRef(null)

    const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    })

    const onImageUploaded = async (event) => {
        setContent([
            ...content,
            {
                id: Date.now(),
                data: await getBase64(event.target.files[0])
            }
        ])
        setImgIndex(content.length)
    }

    return (
        <>
            <input
                type='file'
                ref={uploadButton}
                style={{ display: 'none' }}
                onChange={onImageUploaded}
            />
            <div style={{
                width: '100%',
                height: '40vh',
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid black'
            }}>
                {
                    imgIndex > 0 ?
                    <img style={{
                        width: 'auto',
                        height: '38vh'
                    }} alt='example' src={content[imgIndex]?.data}/> : 
                    <>
                        Chưa có hình ảnh
                    </>
                }
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
                <Space style={{
                    display: allowAction ? '' : 'none'
                }}>
                    <Button type='primary' ghost size="large" onClick={() => {
                        uploadButton.current.click()
                    }}>Thêm ảnh</Button>
                    <Button type='primary' ghost size="large" danger onClick={() => {
                        let backupContent = []
                        content.forEach((item, index) => {
                            if(index === imgIndex) return
                            backupContent.push(item)
                        })
                        setContent(backupContent)
                    }}>Xóa ảnh</Button>
                </Space>
                <div style={{
                    height: '1vh',
                    marginTop: 10,
                    justifyContent: 'flex-end',
                    display: 'flex',
                    width: '80%'
                }}>
                    {
                        content && content.map((item, index) => {
                            if (index == 0) return

                            return (
                                <div key={index} style={{
                                    height: '1vh',
                                    backgroundColor: imgIndex === index ? 'black' : 'gray',
                                    width: '2%',
                                    borderRadius: 10,
                                    margin: 5,
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    setImgIndex(index)
                                }} />
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default ImageView