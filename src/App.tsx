import { BrowserRouter,Navigate,Route, Routes,} from 'react-router-dom'
import { lazy ,Suspense} from 'react'
import {useSelector,useDispatch} from 'react-redux'

// import Navbar from './components/Navbar'
const Navbar = lazy(()=> import ('./components/Navbar'))
// import Login from './components/Login'
const Login = lazy(()=> import('./components/Login'))
// import Register from './components/Register'
const Register = lazy(()=> import('./components/Register'))
// import Inventory from './components/Inventory'
const Inventory = lazy(()=> import('./components/Inventory'))
// import ForgetPassword from './components/ForgetPassword';
const ForgetPassword = lazy(()=> import('./components/ForgetPassword'));
// import ResetPassword from './components/ResetPassword';
const ResetPassword = lazy(()=> import("./components/ForgetPassword"))
// import Home from './components/Home';
const Home = lazy(()=> import("./components/Home"))
// import Users from './components/Users'
const Users = lazy(()=> import('./components/Users'))
import { authenticate } from './features/showSlice'


function App() {

  const token = localStorage.getItem("token")
  const dispatch = useDispatch()
  if(token){
    dispatch(authenticate())
  }

  const data = useSelector((state:any)=>{
        return state.show.value
    })
  
  const theme = useSelector((state:any)=>{
     return state.theme.dark
   })

  return (
    <div className={`p-4 pl-9 ${theme?'bg-gradient-to-r from-[#0b0b0b] via-[#383838] to-[#060606]':'bg-[#f5f7fb]'}`}>
      <main className='py-20 min-h-screen'>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/*' element={(data)?<Suspense><Home/></Suspense>:<Suspense><Navigate to='/login'/></Suspense>}></Route>
          {/* <Route path='/*' element={(data)?<Home/>:<Navigate to='/login'/>}></Route> */}
          <Route path='/users/*' element={(data)?<Suspense><Users/></Suspense>:<Suspense><Navigate to='/login'/></Suspense>}></Route>
          {/* <Route path='/users/*' element={(data)?<Users/>:<Navigate to='/login'/>}></Route> */}
          <Route path="/register/*" element={<Suspense><Register/></Suspense>}></Route>
          {/* <Route path="/register/*" element={<Register/>}></Route> */}
          <Route path="/login/*" element={(data) ? <Suspense><Navigate to="/auth" /></Suspense> : <Suspense><Login /></Suspense>} />
          {/* <Route path="/login/*" element={(data) ? <Navigate to="/auth" />: <Login />} /> */}
          <Route path="/auth/*" element={data ? <Suspense><Inventory /></Suspense> : <Suspense><Navigate to="/login" /></Suspense>} />
          {/* <Route path="/auth/*" element={data ?<Inventory />: <Navigate to="/login" />} /> */}
          <Route path="/logout" element={<Suspense><Navigate to='/login' replace /></Suspense>} />
          {/* <Route path="/logout" element={<Navigate to='/login' replace />} /> */}
          <Route path="/forgetpassword/*" element={<Suspense><ForgetPassword /></Suspense>} />
          {/* <Route path="/forgetpassword/*" element={<ForgetPassword />} /> */}
          <Route path="/resetpassword/*" element={<Suspense><ResetPassword/></Suspense>} />
          {/* <Route path="/resetpassword/*" element={<ResetPassword/>} /> */}
        </Routes>
      </BrowserRouter>
      </main>
    </div>
  )
}

export default App
