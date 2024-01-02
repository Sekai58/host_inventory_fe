import { Navigate} from "react-router-dom";
// import useAxios from "../../libs/useAxios"
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import {useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../Model/Confirm";

const Users:React.FC =()=>{
    const [title,setTitle] = useState('all')
    const [change,setChange] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirm,setConfirm] = useState<any>()
    // const {itemsCount,loading,error}  = useAxios('http://localhost:7000/api/admin/list-user',title,change,isModalOpen)

    const [itemsCount, setData] = useState<any>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
      
   useEffect(() => {
      axios
      .get('http://localhost:7000/api/admin/list-user',{
        headers: {
          Authorization: `${(localStorage.getItem('token'))}`,
        },
      })
      .then((res) => {
        setData(res.data)
        console.log(res.data)
        // setChange(false)
      })
      .catch((err) => setError(err))
      .finally(() => {
      setLoading(false);
      });
      setChange(false)
    }, [title,change,isModalOpen,confirm]);

    const theme = useSelector((state:any)=>{
        return state.theme.dark
      })

    const role = useSelector((status:any)=>{
       return status.role.role
    })
    
    const name = localStorage.getItem("user")

    const handleConfirm = () => {
        const fetch = async() =>{
          await axios.put(`http://localhost:7000/api/admin/change-role/${confirm}`,{},{
            headers: {
              Authorization: `${(localStorage.getItem('token'))}`,
            },
          })
          .then(res=>{
            console.log(res.data)
            toast.success("Role successfully updated",{theme:theme?'dark':'light'})
            setChange(true)
          })
          .catch(err=>{toast.error("Role update failed",{theme:theme?'dark':'light'});console.log(err)})
      }
      fetch()
      setIsModalOpen(false); 
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };



    return(
      <>
      {(role==='ADMIN')?
      <>
        <ConfirmModal isOpen={isModalOpen} message="Are you sure you want to change Role?" onConfirm={handleConfirm} onCancel={handleCancel}/>
        <div className={`min-h-[300px] w-[95%] ${theme?'bg-[rgba(34,33,33,0.5)] shadow-black shadow-2xl':'bg-[#ededfc] shadow-xl'}  rounded-md `}>
            {!loading && !error?
            <div className={`p-3`}>
                <div className="flex ">
                <div><button className={`px-3 py-1 mr-2 rounded-t-md  ${(title=='all')?theme?'bg-[#232323] text-[#7e7d7d]':'bg-[#ffffff] text-[#636363]':theme?'bg-[#24243b] text-[#7e7d7d]':'bg-[#d2d1d1] text-[#636363]'}`} onClick={()=>setTitle('all')}>All Users</button></div>
                <div><button className={`px-3 py-1 mr-2 rounded-t-md  ${(title=='manage')?theme?'bg-[#232323] text-[#7e7d7d]':'bg-[#ffffff] text-[#636363]':theme?'bg-[#24243b] text-[#7e7d7d]':'bg-[#d2d1d1] text-[#636363]'}`} onClick={()=>setTitle('manage')}>Manage roles</button></div>
                </div>
                <div className={`${theme?'bg-[#232323] text-[#c3c3c4]':'bg-[#ffffff] text-[#464646]'} py-2 px-3 rounded-b-md rounded-r-md overflow-x-auto scrollbar-thin ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'}  scrollbar-track-[#7878bc] overflow-scroll overflow-y-hidden`}>
                <div className='flex justify-between pb-2 min-w-[600px]'>
                <p className='flex-1'>Username</p>
                {(title==='all')?<>
                <p className='flex-1'>Email</p>
                <p className='flex-1'>Gender</p>
                </>:<></>}
                <p className='flex-1'>Role</p>
                {(title==='manage')?<p className="flex-1">Change Role</p>:<></>}
                </div>
                <div className={`h-[3px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'} mb-3 min-w-[600px]`}></div>
                {itemsCount.map((user:any,idx:number)=>{return<div key={idx} className={`${theme?'text-[#c3c3c4]':'text-[#636363]'} min-w-[600px] ${(name===user.userName && title==='manage')?'hidden':'block'}`}>
                    <div key={idx} className={`flex flex-col justify-between py-3 ${theme?'hover:bg-[#3a3a3a]':'hover:bg-[#e9e9fe]'} `}>
                      <div className="flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 flex items-center"><img src={user.url} className="w-8 h-8 rounded-full mr-2" />{user.userName}</div>
                        {(title==='all')?<>
                        <div className="flex-1 ">{user.email}</div>
                        <div className="flex-1 ">{user.gender.toUpperCase()}</div>
                        </>:<></>}
                        <div className="flex-1">{user.role}</div>
                        {(title==='manage')?
                        <div className="flex-1">
                          <button className={`px-2 py-1 border-2 rounded-md ${theme?'bg-[#cbbf34] border-[#cbbf34] bg-opacity-10 hover:bg-opacity-30 hover:text-white':'bg-[#fae653] border-[#fae653] bg-opacity-90 hover:bg-opacity-100 hover:text-[#191919]'}`} onClick={()=>{setConfirm(user._id);setIsModalOpen(true)}}>{user.role==="ADMIN"?'Make USER':'Make ADMIN'}</button>
                        </div>:<></>}
                      </div>
                      </div>
                    </div>
                    <div className={` h-[0.8px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'}`}></div>
                    </div>
                })}
                </div>
            </div>
            :
            <div className="h-full flex justify-center items-center">
            <ClipLoader
              color='#7878bc'
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
            }
        </div>
        </>
        :
        <Navigate to='/auth'></Navigate>
        }
        </>
    )
}

export default Users