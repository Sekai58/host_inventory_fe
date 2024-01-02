import { useSelector,useDispatch } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { changeCount, setShowCount } from '../../features/showSlice';


const Notifications: React.FC= () => {
  const dispatch = useDispatch()
  const theme = useSelector((state:any)=>{
    return state.theme.dark
  })

  const [data, setData] = useState<any>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [countChange,setCountChange] = useState(false)

  const showCount = useSelector((state:any)=>{
    return state.count.showCount
  })
    
 useEffect(() => {
    axios
    .get('http://localhost:7000/api/admin/list-message',{
      headers: {
        Authorization: `${(localStorage.getItem('token'))}`,
      },
    })
    .then((res) => {
        setData(res.data)
        dispatch(changeCount(res.data.count))
    })
    .catch((err) => setError(err))
    .finally(() => {
    setLoading(false);
    setCountChange(false)
    dispatch(setShowCount(false))
    });
  }, [countChange,showCount]);

  const handleCount = (id:any)=>{
    axios.put(`http://localhost:7000/api/admin/update-message/${id}`,{},{
      headers: {
        Authorization: `${(localStorage.getItem('token'))}`,
      },
    })
    .then((res)=>{
      console.log(res.data)
      setCountChange(true)
    })
    .catch((err)=>console.log(err))
  }

  return (
    <div className="absolute left-0 sm:top-0 z-10">
      <div className={`${theme?'bg-[#24243b] text-white':'bg-[#d2d1d1] border-[1px] border-[#b1b0b0]'} w-full h-12 flex items-center text-xl pl-3 justify-between rounded-t-md`}>Notifications</div>
      <div className={`h-[300px] w-[300px] overflow-auto scrollbar-none ${theme?'scrollbar-thumb-[#24243b]':'scrollbar-thumb-[#c3c3c4]'} ${theme?'bg-[#161616] text-[#e0dfdf]':'bg-[#f3f2f2] border-[1px] border-[#b1b0b0]'}  scrollbar-track-[#7878bc] rounded-b-md`}>
      {!loading  && !error ? (
        data.messages.map((item:any, idx:number) => (
          <div key={idx} className="flex flex-col">
            <>
            <>
            <div key={idx} className={` pt-4 pb-2  ${theme?'hover:bg-[#3a3a3a] text-[#a1a1a1]':'hover:bg-[#e9e9fe] text-[#424242]'}`}>
                <div className="px-3 mb-0 flex items-center"><img className='h-6 w-6 rounded-full mr-2' src={item.url} />{item.message}</div>
                {item.status==='Unread'?
                <div className={`px-3 text-right text-[10px] underline hover:scale-105 ${theme?'':' text-[#5c5b5b]'}`}><button className='hover:scale-105 underline' onClick={()=>handleCount(item._id)}>Mark as read</button></div>
                :<></>}
            </div>
            </>
            </>
            <div className={`h-[0.8px] ${theme?'bg-[#444444]':'bg-[#c3c3c4]'}`}></div>
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

export default Notifications;
