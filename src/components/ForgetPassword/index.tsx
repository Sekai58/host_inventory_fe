import axios from 'axios';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { useSelector } from 'react-redux';

type LoginFormInput = {
    email: string;
  };

const ForgetPassword = ()=>{
    const navigate = useNavigate()
    const [progress,setProgress] =useState(0)
    const theme = useSelector((state:any)=>{
      console.log(state.theme)
      return state.theme.dark
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<LoginFormInput>();

      const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
        setProgress(70)
        await axios.post("http://localhost:7000/api/user/resetpassword",data)
        .then(res=>{console.log(res.data.token)
          toast.success("Check your email to reset password")
          navigate('/login')
        })
        .catch(error=>{console.log(error)
        toast.error("Email not found")})
        // console.log(data);
        setProgress(100)
        reset();
      };

    return<>
    <LoadingBar color="#7878bc"  progress={progress} onLoaderFinished={() => setProgress(0)} />
      <div className={`fixed top-0 left-0 min-h-screen w-full ${theme?'bg-black':'bg-white'} bg-opacity-80 z-[999] flex justify-center items-center`}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justi gap-5 w-[70%] sm:w-[30%]  border-2 border-[#888787] p-5 bg-[#706b6b] bg-opacity-10 z-[89] shadow-[#121212] shadow-2xl'>
        <div>
        <label className="text-[#ffffff] ">Email:</label>
        <input type="text" placeholder='Enter email' {...register('email', { required: 'Email is required'})} className=" mb-2 py-2 px-2 bg-opacity-20 text-[#c4c3c3] border-0 border-b-2 border-[#888787] focus:border-[#888787] focus:border-b-0 bg-black w-full" />
        {errors.email && <p className='text-red-400'>{errors.email.message}</p>}
        </div>
        <button type="submit" className="border-2 border-[#888787] bg-[#7878b2] text-[#ffffff] rounded-2xl px-2 py-2 hover:shadow-md hover:shadow-white hover:border-0">Send Email</button>
      </form>
      </div>
    </>
}

export default ForgetPassword