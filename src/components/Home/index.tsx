import {DoughnutChart,ScatterChart} from "../Chart"
import useAxios from "../../libs/useAxios"
import {useSelector} from 'react-redux'
import { Navigate} from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = ()=>{
    const {itemsCount,error,loading} = useAxios('https://inventoryserver.adaptable.app/api/count-item')
    const [items,setItems] = useState<any>([])

    useEffect(()=>{
        axios.get('https://inventoryserver.adaptable.app/api/admin/list-item',{
            headers: {
              Authorization: `${(localStorage.getItem('token'))}`,
            },
          })
        .then(res=>{setItems(res.data)
        })
        .catch(e=>console.log(e))
        console.log("items",items)
      },[])

    const data = items && items.map((obj:any) => ({ x: obj.available, y: obj.reserved ,label:obj.name}));
    // console.log("sactter chart here",data)


    const theme = useSelector((state:any)=>{
        return state.theme.dark
      })
    
    const role = useSelector((status:any)=>{
       return status.role.role
     })

    return(<>
        {(role==='ADMIN')?
        <>
        {!loading && !error?
        <>
        <div className={`grid gap-5 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-5 px-2 sm:px-10 ${theme?'text-white':'text-[#ffffff]'}`}>
            <div className={`${theme?'bg-[rgba(226,104,248,0.2)] shadow-[rgba(226,104,248,1)]':'bg-[#0071ff] shadow-[#7c7c7c]'} min-h-28 shadow-md  rounded-md hover:scale-105 flex flex-col justify-between`}>
                <div className="p-5 text-xl">AVAILABLE ITEMS</div>
                <div className="p-5  text-2xl text-end">{itemsCount && itemsCount.available}</div>
            </div>
            <div className={`${theme?'bg-[rgba(137,251,103,0.2)] shadow-[rgba(137,251,103,1)]':'bg-[#9385f7] shadow-[#7c7c7c]'}  min-h-28 shadow-md  rounded-md hover:scale-105 flex flex-col justify-between`}>
                <div className="p-5 text-xl">RESERVED ITEMS</div>
                <div className="p-5  text-2xl text-end">{itemsCount && itemsCount.requests}</div>
            </div>
            <div className={`${theme?'bg-[rgba(106,106,249,0.2)] shadow-[rgba(106,106,249,1)]':'bg-[#04d5c7] shadow-[#7c7c7c]'} min-h-28 shadow-md  rounded-md hover:scale-105 flex flex-col justify-between`}>
                <div className="p-5 text-xl">TOTAL USERS</div>
                <div className="p-5 text-2xl text-end">{itemsCount && itemsCount.users}</div>
            </div>
            <div className={`${theme?'bg-[rgba(250,228,103,0.2)] shadow-[rgba(250,228,103,1)]':'bg-[#fe996c] shadow-[#7c7c7c]'} min-h-28 shadow-md  rounded-md hover:scale-105 flex flex-col justify-between`}>
                <div className="p-5 text-xl">CATEGORIES</div>
                <div className="p-5 text-2xl text-end">2</div>
            </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between sm:px-10 gap-8">
            <div className="flex flex-grow">
                <div className={`flex-1 ${theme?'bg-[rgba(36,36,59,0.5)] shadow-black':'bg-[#eeeefc]'} shadow-2xl rounded-md`}>
                <div><h2 className={`${theme?'text-[#ffffff]':'text-[#232323]'} py-5 px-2`}>Inventory Items</h2><div className="h-[0.8px] bg-[#444444]"></div></div>
                    <div className="p-3"><ScatterChart item={data}/></div>
                </div>
            </div>
            <div className={`${theme?'bg-[rgba(36,36,59,0.5)] shadow-black':'bg-[#eeeefc]'} shadow-2xl rounded-md`}>
                <div><h2 className={` ${theme?'text-[#ffffff]':'text-[#232323]'} py-5 px-2`}>Inventory Items</h2><div className="h-[0.8px] bg-[#444444]"></div></div>
                <div className="p-5 flex items-end"><DoughnutChart available={itemsCount && itemsCount.available} reserved={itemsCount && itemsCount.requests}/></div>
                <div className="h-[0.8px] bg-[#444444] mx-4"></div>
                <div className={`flex ${theme?'text-[#c3c3fc]':'text-[#232323]'} justify-between text-2xl px-4 py-1 lg:px-5 lg:py-10`}>
                    <div className="flex flex-col">{Math.floor((itemsCount.available-itemsCount.requests)/itemsCount.available*100)}%<div className="flex gap-1 items-center text-sm"><div className="h-3 w-3 rounded-full bg-[#44df78]"></div>Unallocated</div></div>
                    <div className="">{Math.ceil(itemsCount.requests/itemsCount.available*100)}%<div className="flex gap-1 items-center text-sm"><div className="h-3 w-3 rounded-full bg-[#c83737]"></div>Reserved</div></div>
                </div>
                <div className="h-[0.8px] bg-[#444444] mx-4"></div>
            </div>
        </div>
        <div>
            {/* <ScatterChart /> */}
        </div>
        </>
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
        </>
        :
        <Navigate to='/auth'></Navigate>
        }
        </>
    )
}

export default Home