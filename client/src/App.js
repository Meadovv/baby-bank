import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'

import PublicRoute from './components/Routes/PublicRoute'
import ProtectedRoute from './components/Routes/ProtectedRoute'

import Login from './pages/Authentication/Login'
import Register from './pages/Authentication/Register'
import Logout from './pages/Authentication/Logout'
import Home from './pages/Home/Home'
import Post from './pages/Post/Post'
import PostDetail from './pages/PostDetail/PostDetail'
import Account from './pages/Account/Account'
import Error from './pages/Error/Error'
import Request from './pages/Request/Request';
import CreatePost from './pages/CreatePost/CreatePost';
import Appointment from './pages/Appointment/Appointment';
import Hospital from './pages/Hospital/Hospital'
import Organization from './pages/Organization/Organization'
import PostManager from './pages/PostManager/PostManager'
import StorageManage from './pages/StorageManage/StorageManage'
import EditPost from './pages/EditPost/EditPost'
import AdminHome from './pages/Admin/AdminHome'
import AdminChat from './pages/Admin/AdminChat'
import AdminReport from './pages/Admin/AdminReport'

import Terms from './pages/Terms/Terms'

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
              <ProtectedRoute admin={false} children={<Account />}/>
            }/>

            <Route path='/post' element={
              <ProtectedRoute admin={false} children={<Post />}/>
            }/>

            <Route path='/post/:postId' element={
              <ProtectedRoute admin={false} children={<PostDetail />}/>
            }/>

            <Route path='/request' element={
              <ProtectedRoute admin={false} children={<Request />}/>
            }/>

            <Route path='/appointment' element={
              <ProtectedRoute admin={false} children={<Appointment />} />
            }/>

            <Route path='/hospital' element={
              <ProtectedRoute admin={false} children={<Hospital />} />
            }/>

            <Route path='/organization' element={
              <ProtectedRoute admin={false} children={<Organization />} />
            }/>

            <Route path='/create-post' element={
              <ProtectedRoute admin={false} children={<CreatePost />}/>
            }/>

            <Route path='/post/:postId/edit' element={
              <ProtectedRoute admin={false} children={<EditPost />}/>
            }/>

            <Route path='/manage-post' element={
              <ProtectedRoute admin={false} children={<PostManager />}/>
            }/>
            
            <Route path='/manage-storage' element={
              <ProtectedRoute admin={false} children={<StorageManage />}/>
            }/>

            <Route path='*' element={
              <Error />
            }/>

            <Route path='/terms-of-use' element={
              <Terms />
            }/>

            <Route path='/admin' element={
              <ProtectedRoute admin={true} children={<AdminHome />}/>
            }/>

            <Route path='/admin-chat' element={
              <ProtectedRoute admin={true} children={<AdminChat />}/>
            }/>

            <Route path='/admin-report' element={
              <ProtectedRoute admin={true} children={<AdminReport />}/>
            }/>
          </Routes>
        }
      </BrowserRouter>
    </>
  );
}

export default App;
