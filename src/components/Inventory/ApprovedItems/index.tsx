import React, { useEffect, useState } from "react";
import {IUser } from "../../../types/User";
import axios from "axios";
import { useSelector } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

export interface IRequestedItems{
  user:IUser,
  query:string
}

const ApprovedItems: React.FC<IRequestedItems> = ({user,query}) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useSelector((state:any)=>{
    return state.theme.dark
  })

  const role = useSelector((status:any)=>{
    return status.role.role
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/list-approved-item',{
          headers: {
            Authorization: `${(localStorage.getItem('token'))}`,
          },
        });
        console.log("approvedatahere",response.data);
        setRequests(response.data);
        console.log(requests)
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div >
      <div className={`flex justify-between items-center py-1 min-w-[600px]`}>
        <div className={`flex-1 ${user.role=="USER"?'hidden':'solid'}`}>User</div>
        <div className={`flex-1`}>Item</div>
        <div className="flex-1">Date</div>
        <div className={`flex-1 `}>Status</div>
      </div>
      <div className={`h-[3px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'} mb-3 min-w-[600px]`}></div> 
      <div className={`h-[400px] min-w-[600px] overflow-auto scrollbar-thin ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'}  scrollbar-track-[#7878bc] overflow-x-hidden`}>
      {!loading ? (
        requests.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <>
            {(user.role==='ADMIN')?<>
            <div key={idx} className={`flex flex-col justify-between py-4 ${item.productInfo.name.toLowerCase().includes(query)?'solid':'hidden'}  ${theme?'hover:bg-[#3a3a3a]':'hover:bg-[#e9e9fe]'}`}>
              <div className="flex justify-between items-center">
                <div className="flex-1 flex"><img src={item.userInfo.url} className="h-8 w-8 rounded-full mr-2"/>{item.userInfo.userName}</div>
                <div className="flex-1 flex"><img src={item.productInfo.url} className="h-8 w-10 mr-2"/>{item.productInfo.name}</div>
                <div className="flex-1">{item.date}</div>
                <div className={`flex-1 ${item.status==='Approved'?'text-green-500':'text-red-500'}`}>{item.status}</div>
              </div>
            </div>
            </>
            :
            <>
            <div key={idx} className={`flex flex-col justify-between py-3 ${(item.userInfo.userName.toLowerCase().includes(user.userName.toLowerCase()) && item.productInfo.name.toLowerCase().includes(query))?"solid":"hidden"}  ${theme?'hover:bg-[#3a3a3a]':'hover:bg-[#e9e9fe]'}`}>
              <div className="flex justify-between items-center">
              <div className="flex-1 flex"><img src={item.productInfo.url} className="h-8 w-10 mr-2"/>{item.productInfo.name}</div>
              <div className="flex-1">{item.date}</div>
              <div className={`flex-1 ${(item.status==="Approved")?'text-green-500':'text-red-600'}`}>{item.status}</div>
              </div>
            </div>
            </>
            }  
            </>
            <div className={`h-[0.8px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'} ${(role=='USER')?(item.userInfo.userName.toLowerCase().includes(user.userName.toLowerCase()) && item.productInfo.name.toLowerCase().includes(query.toLowerCase()))?"solid":"hidden":item.productInfo.name.toLowerCase().includes(query.toLowerCase())?"solid":"hidden"}`}></div>
          </div>
        ))
      ) : (
        <div className="flex h-full justify-center items-center">
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

export default ApprovedItems;
