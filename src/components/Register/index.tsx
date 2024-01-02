import { useForm, SubmitHandler } from "react-hook-form"
import axios from "axios";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'

type Inputs = {
  firstName:string,
  lastName:string,
  userName: string,
  email: string,
  gender:string,
  password:string,
}

const Forms=()=> {
  const navigate = useNavigate()

  const theme = useSelector((state:any)=>{
    console.log(state.theme)
    return state.theme.dark
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    axios.post("http://localhost:7000/api/user/register",data)
    .then(res=>{
      console.log(res.data)
      toast.success(res.data,{theme:theme?"dark":"light"});
      navigate('/login')
    })
    .catch(error=>{console.log(error.message)
    toast.error("User already exists",{theme:theme?"dark":"light"})})
    console.log(JSON.stringify(data))
    reset();
  }

  return (
    <div className="flex justify-center rounded-xl">
    < div className='flex justify-center items-center w-full lg:w-[1000px] shadow-2xl shadow-[#555454] rounded-xl'>
      <div className={`border-0 rounded-xl hidden sm:flex flex-col text-white w-[30%] h-[550px] ${theme?'bg-[#2c2c2c]':'bg-white'}`}>
        <div className='h-[30%] bg-[#7878bc] w-full border-0 rounded-tl-xl'></div>
        <div className=' bg-[#7878bc] w-full flex items-end justify-end rounded-br-[20px] '><button className='rounded-br-[20px] px-5 py-3 text-[#ffffff]'><Link to='/login'>LOGIN</Link></button></div>
        <div className="bg-[#7878bc] w-full flex items-end justify-end"><button className={`${theme?'bg-[#2c2c2c]':'bg-white'} rounded-l-full px-5 py-3 text-[#7878bc] font-semibold`}>SIGN UP</button></div>
        <div className='h-full bg-[#7878bc] w-full rounded-tr-[20px] border-0 text-end rounded-bl-xl'></div>
      </div>
    <>
    <div className={`${theme?'bg-[#2c2c2c] bg-opacity-70':'bg-hero-pattern bg-cover'} w-full lg:w-[70%] h-[550px] rounded-r-xl`}>
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center px-20 gap-3 border-0 rounded-r-xl w-full h-full p-5 backdrop-blur-[2px]'>
      <h2 className="text-[#7878b2] font-semibold text-xl">SIGN UP</h2>
      
      <div>
      <label className={`${theme?'text-[#d5d5d5]':'text-[#191919]'}`}>Fullname:</label>
      <input defaultValue="" placeholder="Enter name" {...register("firstName",{required:true})} className={`${theme?'text-[#d5d5d5]':'text-[#191919]'} py-2 px-2 bg-opacity-20 border-0  border-b-2 border-[#888787] focus:border-[#888787] focus:border-b-0 bg-black w-full`} />
      {errors.firstName && <span className="text-[#f34242]">{errors.firstName?.message}</span>}
      </div>

      <div>
      <label className={`${theme?'text-[#d5d5d5]':'text-[#191919]'}`}>Username:</label>
      <input defaultValue="" placeholder="Enter username" {...register("userName",{required:true})} className={`${theme?'text-[#d5d5d5]':'text-[#191919]'} py-2 px-2 bg-opacity-20 border-0 border-b-2 border-[#888787] focus:border-[#888787] focus:border-b-0 bg-black w-full`} />
      {errors.userName && <span className="text-[#f34242]">This field is required</span>}
      </div>
      
      <div>
      <label className={`${theme?'text-[#d5d5d5]':'text-[#191919]'}`}>Email:</label>
      <input placeholder="Enter email" {...register("email", { required: true,pattern:/^[\w\.-]+@[\w\.-]+\.\w+$/ })} className={`${theme?'text-[#d5d5d5]':'text-[#191919]'} py-2 px-2 bg-opacity-20 border-0 border-b-2 border-[#888787] focus:border-[#888787] focus:border-b-0 bg-black w-full`} />
      {errors.email && <span className="text-[#f34242] ">Incorrect email</span>}
      </div>

      <div>
      <label className={`${theme?'text-[#d5d5d5]':'text-[#191919]'}`}>Password:</label>
      <input type="password" placeholder='Enter password' {...register('password', { required: 'Password is required',pattern:/^.{6,}$/ })} className={`${theme?'text-[#d5d5d5]':'text-[#191919]'} mb-3 py-2 px-2 bg-opacity-20 border-0 border-b-2 border-[#888787] focus:border-[#888787] focus:border-b-0 bg-black w-full`} />
      {errors.password && <p className='text-red-400'>{errors.password.message}</p>}
      </div>
      
      <div>
      <label className={`${theme?'text-[#d5d5d5]':'text-[#191919]'}`}>Gender:</label>
      <div className={`${theme?'text-[#d5d5d5]':'text-[#000000]'} flex justify-between`}>
        <div><input type="radio" value="male" className="checked:bg-slate-400 text-slate-400 focus:border-white" {...register("gender",{required:true})} checked /><span className="px-1">MALE</span></div>
        <div><input type="radio" value="female" className="checked:bg-slate-400 text-slate-400 focus:border-white" {...register("gender",{required:true})} /><span className="px-1">FEMALE</span></div>
        <div><input type="radio" value="other" className="checked:bg-slate-400 text-slate-400 border-0 focus:border-white" {...register("gender",{required:true})} /><span className="px-1">OTHER</span></div>
      </div>
      </div>

      <div className="w-full flex justify-center mt-5">
      <input type="submit" value='Sign Up' className="border-2 border-[#888787] w-1/2 bg-[#7878b2] text-[#ffffff] rounded-2xl px-2 py-2 cursor-pointer hover:shadow-md hover:shadow-white hover:border-0" />
      </div>

    </form>
    </div>
    </>
    </div>
    </div>
  )
}

export default Forms