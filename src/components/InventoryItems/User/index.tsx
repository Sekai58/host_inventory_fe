import axios from "axios";
import { IItems} from "../../../types/User";
import {useEffect, useState} from 'react'
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from 'socket.io-client';
import ClipLoader from "react-spinners/ClipLoader";

const InventoryItemsUser = (props:any) => {
  const [items,setItems] = useState<IItems[]>([])
  const [request,setRequest] = useState(false)
  const [loading,setLoading] = useState(true)
  const [data,setData] = useState<any[]>([])
  const [filteredData,setfilteredData] = useState<string[]>([])

  console.log("at user line 16",props.user)

  const theme = useSelector((state:any)=>{
    return state.theme.dark
  })

  useEffect(()=>{
    axios.get('http://localhost:7000/api/admin/list-item',{
      headers: {
        Authorization: `${(localStorage.getItem('token'))}`,
      },
    })
    .then(res=>{setItems(res.data)
    })
    .catch(e=>console.log(e))
    setRequest(false)
    console.log("items",items)
  },[request])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/list-requested-item',{
          headers: {
            Authorization: `${(localStorage.getItem('token'))}`,
          },
        });
        setData(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
    setfilteredData(data.filter(item=>item.userInfo.userName===props.user.userName).map(a=>a.productInfo.name))
    console.log("filtered data",filteredData)

  }, [items,request]);

  const handleRequest =(id:string,name:string,available:number)=>{
    console.log("id here",id)
    if(available<=0)return 0
    axios.post('http://localhost:7000/api/user/requests',{"id":id,"userName":props.user._id,"message":`${props.user.userName} requested ${name}`},{
      headers: {
        Authorization: `${(localStorage.getItem('token'))}`,
      },
    })
    .then(response => {
        console.log(response.data)
        toast.success("Item successfully requested",{theme:theme?"dark":"light"})
        
        const socket = io('http://localhost:7000')
        console.log(socket)
        const notify:string = `${props.user.userName} requested ${name}`
        socket?.emit("sendMessage",notify)
        setRequest(true)
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error("Item already requested",{theme:theme?"dark":"light"})
    }),[]
  }

  return (
  <div className={`h-[400px] min-w-[600px] overflow-auto scrollbar-thin ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'}  scrollbar-track-[#7878bc] overflow-scroll overflow-x-hidden`}>
    {!loading?<>
    {items.map((item,idx)=>{return<div key={idx}>
      <div className={`flex justify-between items-center py-4 ${(item.name.toLowerCase().includes(props.query.toLowerCase()))?"solid":"hidden"}  ${theme?'hover:bg-[#3a3a3a]':'hover:bg-[#e9e9fe]'}`}>
        <div className="flex-1 flex"><img src={item.url} className="h-8 w-10 mr-2"/>{item.name}</div>
        <div className="flex-1">{item.available}</div>
        <div className="flex-1">{item.reserved}</div>
        <div className="flex-1">
          <button className={`px-2 py-1 border-2  ${(filteredData.includes(item.name) || item.available<=0)?theme?'border-[#862a2a] bg-[#e9585f] bg-opacity-30':'bg-[#f95b5b]':theme?'bg-[#3de97c] border-[#1b662d] bg-opacity-10 hover:bg-opacity-30 hover:text-white':'bg-[#57c371] bg-opacity-90 hover:bg-opacity-100 hover:text-[#232323]'} rounded-md`} onClick={()=>{handleRequest(item._id,item.name,item.available)}}>
            {filteredData.includes(item.name)?<>Requested</>:<>Request</>}
          </button>
        </div>
      </div>
      <div className={`h-[0.8px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'} ${(item.name.toLowerCase().includes(props.query.toLowerCase()))?"solid":"hidden"}`}></div>  
    </div>})}
    </>:
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
  );
};

export default InventoryItemsUser;
