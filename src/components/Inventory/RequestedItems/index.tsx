import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {IUser } from "../../../types/User";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { io } from 'socket.io-client';


export interface IRequestedItems{
  user:IUser,
  query:string
}

const RequestedItems: React.FC<IRequestedItems> = ({user,query}) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approve,setApprove] =useState(false)
  const [decline,setDecline] =useState(false)

  const theme = useSelector((state:any)=>{
    return state.theme.dark
  })

  const role = useSelector((status:any)=>{
    return status.role.role
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/list-requested-item',{
          headers: {
            Authorization: `${(localStorage.getItem('token'))}`,
          },
        });
        // console.log("requestdatahere",response.data);
        setRequests(response.data);
        console.log(requests)
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
    setApprove(false)
    setDecline(false)
  }, [approve,decline]);

  const handleApprove =(id:any,userName:string,name:string)=>{
    axios.delete(`http://localhost:7000/api/user/requests/${id}`,{
      headers: {
        Authorization: `${(localStorage.getItem('token'))}`,
      },
    })
    .then(response => {
        console.log(response.data)
        toast.success("Item successfully approved",{theme:theme?"dark":"light"})
        setApprove(true)
        const socket = io('http://localhost:7000')
        const notify:string = `${userName}, ${name} was approved`
        socket?.emit("replyMessage",notify)
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error("Unauthorized! Check items in inventory",{theme:theme?"dark":"light"})
    })
  }

  const handleDecline =(id:any)=>{
    axios.put(`http://localhost:7000/api/admin/decline-item/${id}`,{},{
      headers: {
        Authorization: `${(localStorage.getItem('token'))}`,
      },
    })
    .then(response => {
        console.log(response.data)
        toast.success("Item successfully declined",{theme:theme?"dark":"light"})
        setDecline(true)
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error("Unauthorized",{theme:theme?"dark":"light"})
    })
  }

  return (
    <div >
      <div className="flex justify-between items-center py-1 min-w-[600px]">
        <div className={`flex-1 ${user.role=="USER"?'hidden':'solid'}`}>User</div>
        <div className={`flex-1`}>Item</div>
        <div className={`flex-1 ${user.role=="USER"?'hidden':'solid'}`}>Action</div>
        <div className={`flex-1 ${user.role=="USER"?'solid':'hidden'}`}>Date</div>
        <div className={`flex-1 ${user.role=="USER"?'solid':'hidden'}`}>Status</div>
      </div>
      <div className={`h-[3px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'} mb-3 min-w-[600px]`}></div> 
      <div className={`h-[400px] min-w-[600px] overflow-auto scrollbar-thin ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'}  scrollbar-track-[#7878bc] overflow-x-hidden`}>
      {!loading ? (
        requests.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <>
            {(user.role==='ADMIN')?<>
            <div key={idx} className={`flex flex-col justify-between py-4 ${item.productInfo.name.toLowerCase().includes(query)?'solid':'hidden'} ${theme?'hover:bg-[#3a3a3a]':'hover:bg-[#e9e9fe]'}`}>
              <div className="flex flex-col justify-between">
              <div className={`flex justify-between items-center`}>
                <div className="flex-1 flex"><img src={item.userInfo.url} className="h-8 w-8 rounded-full mr-2"/>{item.userInfo.userName}</div>
                <div className="flex-1 flex"><img src={item.productInfo.url} className="h-8 w-10 mr-2"/>{item.productInfo.name}</div>
                <div className="flex-1 flex">
                  <button className={`px-2 py-1 border-2 mr-1 ${theme?'bg-[#cbbf34] border-[#cbbf34] bg-opacity-10 hover:bg-opacity-30 hover:text-white':'bg-[#fae653] border-[#fae653] bg-opacity-90 hover:bg-opacity-100 hover:text-[#191919]'}  rounded-md  `} onClick={()=>{handleApprove(item._id,item.userInfo.userName,item.productInfo.name)}}>Approve</button>
                  <button className={`px-2 py-1 border-2 ${theme?'bg-[#cb3434] border-[#cb3434] bg-opacity-10 hover:bg-opacity-30 hover:text-white':'bg-[#cb3434] border-[#cb3434] bg-opacity-90 hover:bg-opacity-100 hover:text-[#191919]'}  rounded-md  `} onClick={()=>handleDecline(item._id)}>Decline</button>
                </div>
              </div>
              </div>
            </div>
            </>
            :
            <>
            <div key={idx} className={`flex flex-col justify-between py-4 ${(item.userInfo.userName.toLowerCase().includes(user.userName.toLowerCase()) && item.productInfo.name.toLowerCase().includes(query))?"solid":"hidden"}  ${theme?'hover:bg-[#3a3a3a]':'hover:bg-[#e9e9fe]'}`}>
              <div className="flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="flex-1 flex"><img src={item.productInfo.url} className="h-8 w-10 mr-2"/>{item.productInfo.name}</div>
                <div className="flex-1 ">{item.date}</div>
                <div className={`flex-1 text-yellow-500`}>{item.status}</div>
              </div>
              </div>
            </div>
            </>
            }   
            </>
            <div className={`h-[0.8px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'} ${(role=='USER')?(item.userInfo.userName.toLowerCase().includes(user.userName.toLowerCase()) && item.productInfo.name.toLowerCase().includes(query.toLowerCase()))?"solid":"hidden":item.productInfo.name.toLowerCase().includes(query.toLowerCase())?"solid":"hidden"}`}></div>
          </div>
        ))
      ) : (
        <div className="h-full flex justify-center items-center">
          <ClipLoader
            color='#7878bc'
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default RequestedItems;
