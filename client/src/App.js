import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'

import PublicRoute from './components/Routes/PublicRoute'
import ProtectedRoute from './components/Routes/ProtectedRoute'

import Login from './pages/Authentication/Login'
import Register from './pages/Authentication/Register'
import Logout from './pages/Authentication/Logout'


import Home from './pages/Home/Home'
import Explore from './pages/Explore/Explore'
import Setting from './pages/Setting/Setting'
import Appointment from './pages/Appointment/Appointment'
import Profile from './pages/Profile/Profile'
import Chat from './pages/Chat/Chat'


import ViewPost from './pages/Post/ViewPost'
import CreatePost from './pages/Post/CreatePost';
import EditPost from './pages/Post/EditPost'

import Error from './pages/Error/Error'
import Terms from './pages/Terms/Terms'
import Recovery from './pages/Recovery/Recovery'
import Forgot from './pages/Authentication/Forgot'
import ManagePost from './pages/Post/ManagePost'
import StorageManage from './pages/StorageManage/StorageManage'

function App() {

  const { loading } = useSelector(state => state.alerts)

  return (
    <>
      <BrowserRouter>
        {
          loading ? <Spinner /> :
          <Routes>

            <Route path='/' element={
              <ProtectedRoute admin={false} children={<Home />}/>
            }/>

            <Route path='/login' element={
              <PublicRoute admin={false} children={<Login />}/>
            }/>

            <Route path='/register' element={
              <PublicRoute admin={false} children={<Register />}/>
            }/>

            <Route path='/logout' element={
              <ProtectedRoute admin={false} children={<Logout />}/>
            }/>

            <Route path='/profile/:profileId' element={
              <ProtectedRoute admin={false} children={<Profile />}/>
            }/>

            <Route path='/setting' element={
              <ProtectedRoute admin={false} children={<Setting />}/>
            }/>

            <Route path='/explore' element={
              <ProtectedRoute admin={false} children={<Explore />}/>
            }/>

            <Route path='/appointment' element={
              <ProtectedRoute admin={false} children={<Appointment />}/>
            }/>

            <Route path='/chat/:userId' element={
              <ProtectedRoute admin={false} children={<Chat />}/>
            }/>

            <Route path='/post/create' element={
              <ProtectedRoute admin={false} children={<CreatePost />}/>
            }/>

            <Route path='/post/:postId/view' element={
              <ProtectedRoute admin={false} children={<ViewPost />}/>
            }/>

            <Route path='/post/:postId/edit' element={
              <ProtectedRoute admin={false} children={<EditPost />}/>
            }/>

            <Route path='/manage/post' element={
              <ProtectedRoute admin={false} children={<ManagePost />}/>
            }/>

            <Route path='/manage/storage' element={
              <ProtectedRoute admin={false} children={<StorageManage />}/>
            }/>

            <Route path='/recovery/:token' element={
              <Recovery />
            }/>

            <Route path='/terms-of-use' element={
              <Terms />
            }/>

            <Route path='/forgot-password' element={
              <Forgot />
            }/>

            <Route path='*' element={
              <Error />
            }/>
          </Routes>
        }
      </BrowserRouter>
    </>
  );
}

export default App;
