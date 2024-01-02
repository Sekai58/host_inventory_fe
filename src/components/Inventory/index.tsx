import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';

import InventoryItemsUser from '../InventoryItems/User';
// const InventoryItemsUser = lazy(()=> import('../InventoryItems/User'))
import InventoryItemsAdmin from '../InventoryItems/Admin';
// const InventoryItemsAdmin = lazy(()=> import('../InventoryItems/Admin'))
import AddItemModal from '../Model';
// const AddItemModal = lazy(()=> import('../Model'))
import RequestedItems from './RequestedItems';
// const RequestedItems = lazy(()=> import('./RequestedItems'))
import ApprovedItems from './ApprovedItems';
// const ApprovedItems = lazy(()=> import('./ApprovedItems'))
import Notifications from '../Notification';
// const Notifications = lazy(()=> import('../Notification'))
import { addItem,setShowCount,showRole } from '../../features/showSlice';

interface IUserInfo {
  firstname:string,
  userName:string,
  email:string,
  role:string,
  gender:string,
url:string
}

const ProtectedRoute = () => {
  const [data, setData] = useState<IUserInfo>();
  const [field,setField] = useState('allitems')
  const [query,setQuery] = useState('')
  const [showAddItem,setShowAddItem] = useState(false)
  const [socket,setSocket] = useState<any>(null)
  const [notification,setNotification] = useState<any>([])
  const [showNotification,setShowNotification] = useState("")
  const [userNotification,setUserNotification] = useState<any>([])
  const [message,setMessage] = useState(false)
  const [userInfo,setUserInfo] = useState(false)

  const dispatch = useDispatch()
  const theme = useSelector((state:any)=>{
    return state.theme.dark
  })

  const count = useSelector((state:any)=>{
    return state.count.count
  })

  const role = useSelector((state:any)=>{
    return state.role.role
  })

  //Model add item close
  const handleClose = ()=>{
    setShowAddItem(false)
    dispatch(addItem(true))
  }

  //Connection between user and Admin
  useEffect(()=>{
    const socket = io('http://localhost:7000')
    setSocket(socket)
    console.log(socket)

    socket?.emit('fromclient', 'Hello from the client!');

    socket?.on('fromserver', (message:any) => {
      console.log('Received message from server:', message);
    });
  },[])

  //Reply by admin on approve
  useEffect(()=>{
    socket?.on('getReply', (message:any) => {
      const newArr = [...userNotification]
      newArr.push(message)
      setUserNotification(newArr)
      setShowNotification("user")
    });

  })

  //Get notification and show in admin side
  useEffect(()=>{
    socket?.on('getMessage',(message:any)=>{console.log("notification from user",message)
    const newArr = [...notification]
    newArr.push(message)
    setNotification(newArr)
    setShowNotification("admin")
    dispatch(setShowCount(true))
  })  
  })

  //Get user info i.e. username and role
  useEffect(() => {
    const fetchdata = async()=>{
      await axios.post('http://localhost:7000/api/user/auth',{}, {
        headers: {
          Authorization: `${(localStorage.getItem('token'))}`,
        },
      })
      .then(response => {
          console.log("user data here at inventory 88",response.data)
          localStorage.setItem("role",response.data.role)
          localStorage.setItem("user",response.data.userName)
          dispatch(showRole({"role":response.data.role,"userName":response.data.userName}))
        setData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

    if(!showAddItem){
      fetchdata()
      setShowAddItem(false)
    }
  }, []);

  return (
    <>
    {data?
    <div className='pr-8 sm:px-10 fixed  w-[95%]'>
        {/* DIV TO ADD ITEM TO INVENTORY:FOR ADMIN ONLY LINE:3       */}
        <div className={`${showAddItem?'solid':'hidden'}`}>
          <AddItemModal onClose={handleClose}/>
        </div>

        {/* MAIN DIV THAT CONTAINS ALL */}
      <div className={`min-h-[300px] ${theme?'bg-[rgba(34,33,33,0.5)] shadow-black shadow-2xl':'bg-[#ededfc] shadow-md'}  rounded-md`}>
      
      {/* REAL TIME NOTIFICATION BLOCK UPTO:155 */}
      {(showNotification=="admin" && role==='ADMIN')?<>
        <div className={`absolute top-1 left-0 z-10 flex flex-col justify-center  w-full sm:w-[50%] lg:w-[30%] p-1 ${theme?'shadow-[#616060] shadow-2xl bg-[#3d3d3d] border-[#575757]':'shadow-[#898888] shadow-2xl bg-[#c0c0c0]'} rounded-lg`}>
        <div className={`text-xl ${theme?'text-white':'text-[#24243b]'} px-[6px] rounded-full`} >
                <i className="fa-solid fa-xmark hover:bg-red-500 rounded-full p-1" onClick={()=>{setShowNotification("");setNotification([])}}></i>
              </div>
          <div className={`${theme?'bg-[#3d3d3d] border-[#575757] text-white':'bg-[#c0c0c0] border-[#b1b0b0] text-black'} w-full  shadow-lg rounded-sm px-1 py-1`}>
            {notification.map((msg:any,idx:number)=>{return<div key={idx} className={`${theme?'bg-black bg-opacity-20':'bg-[#dbdbfa]'} shadow-md rounded-md mb-1 flex justify-between py-[10px] pl-2`}>
              <div>{msg}</div>
              </div>})}
          </div>
        </div>
        </>
        :<>
        {(showNotification=='user' && role==='USER' && userNotification.every((str:any)=>str.includes(data.userName)))?<>
        <div className={`absolute top-1 left-0 z-10 flex flex-col justify-center  w-full sm:w-[50%] lg:w-[30%] p-1 ${theme?'shadow-[#616060] shadow-2xl bg-[#3d3d3d] border-[#575757]':'shadow-[#898888] shadow-2xl bg-[#c0c0c0]'} rounded-lg`}>
        <div className={`text-xl ${theme?'text-white':'text-[#24243b]'} px-[6px] rounded-full`} >
                <i className="fa-solid fa-xmark hover:bg-red-500 rounded-full p-1" onClick={()=>{setShowNotification("");setUserNotification([])}}></i>
              </div>
          <div className={`${theme?'bg-[#3d3d3d] border-[#575757] text-white':'bg-[#c0c0c0] border-[#b1b0b0] text-black'} w-full  shadow-lg rounded-sm px-1 py-1`} >
            {userNotification.map((msg:any,idx:number)=>{return<div key={idx} className={`${theme?'bg-black bg-opacity-20':'bg-[#dbdbfa]'} shadow-md rounded-md mb-1 flex justify-between py-[10px] pl-2`}>
              <div>{msg}</div>
              </div>})}
          </div>
        </div>
        </>:<></>}
        </>}

        <div className='w-full rounded-t-md flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center px-2 py-2'>

          {/* SEARCH BAR UPTO:132 */}
          <div className="relative text-[#818080]">
            <span className="absolute left-2 top-1"><i className="fa-solid fa-magnifying-glass"></i></span>
            <input type="text" className="pl-7 h-8 w-28 sm:w-56 border-1 bg-transparent text-[#929191] rounded-full transition-all duration-300 ease-in-out sm:focus:w-80 focus:w-full focus:border-2 focus:border-[#7878bc]" onChange={(e)=>setQuery(e.target.value)}/>
          </div>
          <div className='flex gap-3 mb-2 pr-4'>
            {/* BELL ICON FOR MESSAGE UPTO 139 */}
            <div className='relative'>
            <button onClick={()=>{setMessage(!message);setUserInfo(false)}}>
              {(role==='ADMIN' && count>0)?<p className='absolute top-0 right-0 bg-red-400 rounded-full text-white text-[10px] px-[3px]'>{count}</p>:<></>}
              <i className={`fa-regular fa-bell ${message?'text-[#7878bc]':theme?'text-[#ffffff]':'text-[#24243b]'} text-2xl`}></i>
            </button>
            <div className={`${(data.role=='ADMIN' && message===true)?'solid':'hidden'} sm:w-[300px] sm:h-[100px] rounded-md absolute top-10 right-0 z-10`}><Notifications/></div>
            </div>
            {/* USER PROFILE INFO UPTO 155 */}
            <div className='h-8 w-8 rounded-full flex justify-center items-center text-xl text-[#ebebfe] cursor-pointer relative'>
              <img src={data.url} className='h-8 w-8 rounded-full' onClick={()=>{setUserInfo(!userInfo);setMessage(false)}} />
              
              <div className={` z-10 ${(userInfo===true)?'solid':'hidden'} w-[300px] h-[300px] rounded-md ${theme?'bg-[#161616]':'bg-[#f3f2f2] border-[1px] border-[#b1b0b0]'}  p-3 absolute top-10 left-0 sm:-left-72 `} onClick={()=>setUserInfo(true)}>
                <div className={`${theme?'bg-[#24243b]':'bg-[#d2d1d1]'} w-full h-12 py-1 px-2 rounded-t-md`}><img src={data.url} className={`w-24 h-24 rounded-full ${theme?'bg-[#161616]':'bg-[#f3f2f2]'}  p-2`}/></div>
                <div className={`${theme?'bg-[#000000] text-[#e0dfdf]':'bg-[#ededfc] text-[#232323]'} mt-12 rounded-md p-3`}>
                  <p>{data.userName}</p>
                  <p className={`text-sm ${theme?'text-[#c0bfbf]':'text-black'}  mb-2`}>{data.email}</p>
                  <div className='h-[0.8px] bg-[#444343] mb-2'></div>
                  <p className='text-sm text-[#919191]'>Role</p>
                  <p className='text-sm mb-2'>{data.role}</p>
                  <p className='text-sm text-[#919191]'>Gender</p>
                  <p className='text-sm'>{data.gender && data.gender.toUpperCase()}</p>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center" onClick={()=>{setUserInfo(false);setMessage(false)}}>
          <div className={`h-[0.8px] bg-gradient-to-r ${theme?'from-[#1c1c1c] via-[#3c3c54] to-[#7878bc]':'from-[#ededfc] to-[#7878bc]'}  flex-grow shadow-md shadow-white`}></div>
          <span className={`mx-2 ${theme?'text-[#ffffff]':'text-[#5d5d5d]'}`}>Inventory Items</span>
          <div className={`h-[0.8px] bg-gray-400 bg-gradient-to-r ${theme?'to-[#1c1c1c] via-[#3c3c54] from-[#7878bc]':'to-[#ededfc] from-[#7878bc]'}   flex-grow`}></div>
        </div>

        <div className='p-4' onClick={()=>{setUserInfo(false);setMessage(false)}}>
        <div className='flex text-[#8a8a8b] justify-between'>
          <div>
            <button className={`px-3 py-1 mr-2 rounded-t-md ${(field=='allitems')?theme?'bg-[#232323]':'bg-[#ffffff] text-[#636363]':theme?'bg-[#24243b]':'bg-[#d2d1d1] text-[#636363]'}`} onClick={()=>{setField("allitems")}}>All items</button>
            <button className={`px-3 py-1 mr-2 rounded-t-md ${(field=='requested')?theme?'bg-[#232323]':'bg-[#ffffff] text-[#636363]':theme?'bg-[#24243b]':'bg-[#d2d1d1] text-[#636363]'}`} onClick={()=>{setField("requested")}}>Requested</button>
            <button className={`px-3 py-1 rounded-t-md ${(field=='approved')?theme?'bg-[#232323]':'bg-[#ffffff] text-[#636363]':theme?'bg-[#24243b]':'bg-[#d2d1d1] text-[#636363]'}`} onClick={()=>{setField("approved")}}>Approved</button>
          </div>
          <div className={`${data.role==='ADMIN'?'solid':'hidden'}`}>
            <button className={`mr-1 px-2 py-[2px] border-2 rounded-md text-[#ffffff] border-[#7878bc] ${theme?'hover:bg-[#7878bc]':'bg-[#7878bc]'}  hover:scale-105 '`} onClick={()=>setShowAddItem(true)}><i className="fa-solid fa-plus mr-1"></i><span className='hidden sm:inline'>Add Item</span></button>
          </div>          
        </div>

        {/* LOAD DATA TO DISPLAY */}
        {((field=='requested'&& showAddItem==false && data)?<>
        <div className={`${theme?'bg-[#232323] text-[#c3c3c4]':'bg-[#ffffff] text-[#464646]'} py-2 px-3 rounded-b-md rounded-r-md overflow-x-auto scrollbar-thin ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'}  scrollbar-track-[#7878bc] overflow-scroll overflow-y-hidden`}>
        <RequestedItems user={data} query={query}/>
        </div>
        </>
        :<>
        {(field=='approved' && data)?
        <div className={`${theme?'bg-[#232323] text-[#c3c3c4]':'bg-[#ffffff] text-[#464646]'} py-2 px-3 rounded-b-md rounded-r-md overflow-x-auto scrollbar-thin ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'}  scrollbar-track-[#7878bc] overflow-scroll overflow-y-hidden`}>
          <ApprovedItems user={data} query={query}/>
          </div>:<>
          <div className={`${theme?'bg-[#232323] text-[#c3c3c4]':'bg-[#ffffff] text-[#464646]'} py-2 px-3 rounded-b-md rounded-r-md overflow-x-auto scrollbar-thin ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'}  scrollbar-track-[#7878bc] overflow-scroll overflow-y-hidden`}>
            <div className='flex justify-between pb-2 min-w-[600px]'>
            <p className='flex-1'>Name</p>
            <p className='flex-1'>Available</p>
            <p className='flex-1'>Reserved</p>
            <p className='flex-1'>Action</p>
            </div>
            <div className={`h-[3px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'} mb-3 min-w-[600px]`}></div> 
            {(data.role=='ADMIN')?<InventoryItemsAdmin query={query}/>:<InventoryItemsUser query={query} user={data} /> } 
               
          </div>
          </>
        }
        </>
        )}
        </div>
      </div>
    </div>
    :<></>}
    </>
  );
};

export default ProtectedRoute;
