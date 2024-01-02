import React from 'react';
import { useSelector } from 'react-redux';
interface IConfirm {
    isOpen:boolean,
    message:string,
    onConfirm:any,
    onCancel:any
}

const ConfirmModal:React.FC<IConfirm> = ({ isOpen, message, onConfirm, onCancel }) => {

    const theme = useSelector((state:any)=>{
        return state.theme.dark
    })
      
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`absolute top-0 left-0 h-full w-full ${theme?'bg-black  bg-opacity-50':'bg-[#c1c0c0] bg-opacity-30'} z-[999] flex justify-center items-center`}>
      <div className={`w-full sm:w-[30%] h-[20%] ${theme?'bg-[#232323]  text-white':'bg-[#ececff] text-[#232323]'} rounded-md border-[#494949] shadow-[#5e5e5e] shadow-md p-2 flex flex-col justify-between`}>
        <div className='flex'>
            <p className='text-[18px] font-serif'>{message}</p>
        </div>
        <div className="flex justify-end">
          <button className={`px-4 py-1 mr-2  border-[1.6px] text-white border-[#7878bc] shadow-[#7878bc] bg-[#7878bc] hover:scale-105  rounded-md`} onClick={onConfirm}>Confirm</button>
          <button className={`px-4 py-1 mr-2  border-[1.6px] text-white border-[#cb3e3e] bg-[#cb3e3e] shadow-[#cb3e3e] hover:scale-105 rounded-md`} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
