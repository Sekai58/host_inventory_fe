import axios from 'axios';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {useNavigate,useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { useSelector } from 'react-redux';

type LoginFormInput = {
    password: string;
    confirmpassword:string
  };

const ResetPassword = ()=>{
    const navigate = useNavigate()
    const [progress,setProgress] =useState(0)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const theme = useSelector((state:any)=>{
      console.log(state.theme)
      return state.theme.dark
    })

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
      } = useForm<LoginFormInput>();

      const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
        setProgress(70)
        console.log("over here",data)
        await axios.post("http://localhost:7000/api/user/auth/resetpassword",{"password":data.password},{
            headers: {
              Authorization: `${token}`,
            },})
        .then(res=>{console.log(res.data.token)
          toast.success("Password successfully updated")
          navigate('/login')
        })
        .catch(error=>{console.log(error)
        toast.error("Unauthorized")})
        console.log(data);
        setProgress(100)
        reset();
      };

    return<>
    <LoadingBar color="#7878bc"  progress={progress} onLoaderFinished={() => setProgress(0)} />
      <div className={`fixed top-0 left-0 min-h-screen w-full ${theme?'bg-black':'bg-white'} bg-opacity-80 z-[999] flex justify-center items-center`}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justi gap-5 w-[70%] sm:w-[30%]  border-2 border-[#888787] p-5 bg-[#706b6b] bg-opacity-10 z-[89] shadow-[#121212] shadow-2xl'>
        <div>
        <label className="text-[#ffffff] ">New Password:</label>
        <input type="password" placeholder='Enter password' {...register('password', { required: 'Password is required',pattern:/^.{6,}$/ })} className=" mb-3 py-2 px-2 bg-opacity-20 text-[#c4c3c3] border-0 border-b-2 border-[#888787] focus:border-[#888787] focus:border-b-0 bg-black w-full" />
        {errors.password && <p className='text-red-400'>{errors.password.message}</p>}
        <label className="text-[#ffffff] ">Confirm Password:</label>
        <input type="password" placeholder='Enter password' {...register('confirmpassword', { required: 'Password is required',pattern:/^.{6,}$/,validate: (value) =>value === watch('password') || 'Passwords do not match' })} className=" mb-3 py-2 px-2 bg-opacity-20 text-[#c4c3c3] border-0 border-b-2 border-[#888787] focus:border-[#888787] focus:border-b-0 bg-black w-full" />
        {errors.confirmpassword && <p className='text-red-400'>{errors.confirmpassword.message}</p>}
      </div>
      <button type="submit" className="border-2 border-[#888787] bg-[#7878b2] text-[#ffffff] rounded-2xl px-2 py-2 hover:shadow-md hover:shadow-white hover:border-0">Update Password</button>
        </form>
      </div>
    </>
}

export default ResetPassword