import React, { useEffect, useState } from "react"
import "./Recommend.css"
import PostList from "../../../components/PostList/PostList"
import { useNavigate } from "react-router-dom"
import { Button, Divider, message } from "antd"
import axios from 'axios'

const Recommend = ({ title, seeMore, getLink }) => {

  const navigate = useNavigate()
  const [postList, setPostList] = useState()

  const getPost = async () => {
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
  }

  useEffect(() => {
    getPost()
  }, [])

  return (
    <div className="list-container">
      <div className="row">
        <Divider orientation="left" style={{
          borderColor: 'black'
        }}>
          <h2 style={{
            textTransform: 'uppercase'
          }}>{title}</h2>
        </Divider>
        <PostList posts={postList} columns={3} />
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button style={{
            margin: 20
          }} size="large" onClick={() => { navigate(seeMore) }}>Xem Thêm</Button>
        </div>
      </div>
    </div>
  )
}

export default Recommend
