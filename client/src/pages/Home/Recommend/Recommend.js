import React, { useEffect, useState } from "react"
import "./Recommend.css"
import PostList from "../../../components/PostList/PostList"
import { useNavigate } from "react-router-dom"
import { Button, Divider, message } from "antd"
import axios from 'axios'

const Recommend = ({ title, seeMore, getLink }) => {

  const navigate = useNavigate()
  const [postList, setPostList] = useState()
  const [loading, setLoading] = useState(false)

  const getPost = async () => {
    setLoading(true)
    await axios.get(getLink)
    .then(res => {
        if (res.data.success) {
            setPostList(res.data.postList)
        }
    })
    .catch(err => {
        console.log(err)
        message.error(err.message)
    })
    setLoading(false)
  }

  useEffect(() => {
    getPost()
  }, [])

  return (
    <div className="list-container">
      <div className="title-container">
        <div className="title">
          {title}
        </div>
        <div className="line"></div>
      </div>
      <PostList posts={postList} loading={loading} type='post'/>
      <div className="post-list-footer">
        <Button type='primary' size='large' onClick={() => {
          navigate(seeMore)
        }}>Xem Thêm</Button>
      </div>
    </div>
  )
}

export default Recommend
