import { Link} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import {changeTheme, showRole, unauthenticate} from '../../features/showSlice';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch()
  const location = useLocation();

  const data = useSelector((status:any)=>{
    return status.show.value
  })

  const theme = useSelector((state:any)=>{
    return state.theme.dark
  })

  const role = useSelector((status:any)=>{
    return status.role.role
  })

  const storedrole = localStorage.getItem("role")
  if(storedrole){
    dispatch(showRole({"role":storedrole,"userName":''}))
  }

  const handleTheme =()=>{
    dispatch(changeTheme())
  }

  const handleLogout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    dispatch(showRole({}))
    dispatch(unauthenticate())
  }

  return (
  <div className={`fixed top-0 left-0 z-[99] w-full ${theme?' bg-gradient-to-r from-[#0b0b0b] via-[#383838] to-[#060606]':''} ${(data)?'bg-[#f5f7fb]':'bg-[#f5f7fb]'}`}>
    <div className={`flex px-3 py-3 justify-between sm:px-10 sm:py-5 items-center`}>
        <div className="flex gap-6 items-center">
          <div className="flex items-center">
            {/* <i className={`fa-regular fa-snowflake bg-transparent ${theme?'text-[#7878bc]':'text-[#7878bc]'} text-2xl`}></i> */}
            {/* <i className={`fa-brands fa-battle-net bg-transparent ${theme?'text-[#7878bc]':'text-[#7878bc]'} text-2xl`}></i> */}
            <i className={`fa-solid fa-biohazard bg-transparent ${theme?'text-[#7878bc]':'text-[#7878bc]'} text-2xl`}></i>
            <div className={`font-bold text:xl sm:text-2xl lg:text-3xl ${theme?'text-white':'text-[#24243b]'}`}>inventory</div>
          </div>
        </div>
        {data?
        <>
        <div className='flex'>
        <Link to='/'>
          <button className={`${(role==='ADMIN')?'flex':'hidden'} items-center pr-3 pl-1 mr-4 border-r-[3px] rounded-[4px] ${(location.pathname=='/')?'border-[#7878bc] text-[#7878bc]':'border-[#ababab] text-[#555555]'}  hover:border-[#7878bc] hover:text-[#7878bc] hover:shadow-sm hover:shadow-[#7878bc]`}>
            <i className="fa-solid fa-gauge"></i>
            <span className={`${theme?'text-[#ababab]':'text-[#232323]'} hidden sm:block`}>Dashboard</span>
          </button>
          </Link>
          <Link to='/users'>
          <button className={`${(role==='ADMIN')?'flex':'hidden'} items-center pr-3 pl-1 mr-4 border-r-[3px] rounded-[4px] ${(location.pathname=='/users')?'border-[#7878bc] text-[#7878bc]':'border-[#ababab] text-[#555555]'}  hover:border-[#7878bc] hover:text-[#7878bc] hover:shadow-sm hover:shadow-[#7878bc]`}>
            <i className="fa-solid fa-user-group"></i>
            <span className={`${theme?'text-[#ababab]':'text-[#232323]'} hidden sm:block`}>Users</span>
          </button>
          </Link>
          <Link to='/auth'>
          <button className={`flex items-center pr-3 pl-1 mr-4 border-r-[3px] rounded-[4px] ${(location.pathname=='/auth')?'border-[#7878bc] text-[#7878bc]':'border-[#ababab] text-[#555555]'}  hover:border-[#7878bc] hover:text-[#7878bc] hover:shadow-sm hover:shadow-[#7878bc]`}>
            <i className="fa-solid fa-boxes-stacked"></i>
            <span className={`${theme?'text-[#ababab]':'text-[#232323]'} hidden sm:flex`}>Inventory</span>
          </button>
          </Link>
        </div>
        </>
        :<></>}

        {data?(
          <div className="flex">
            <div className={`${theme?'text-[#ffffff]':'text-[#24243b]'} cursor-pointer`}>
              <i className={`fa-solid fa-star-and-crescent text-2xl mr-2 -rotate-45`} onClick={handleTheme}></i>
            </div>
            <div>
              <Link to='/logout'>
                <button className={`px-1 sm:px-4 py-1 mr-2 border-[#7878bc] ${theme?'text-white  shadow-[#7878bc] hover:shadow-[#7878bc]':'bg-[#7878bc] shadow-[#7878bc] text-[#ffffff] hover:shadow-[#7878bc]'} rounded-md  border-[1.6px]  shadow-sm hover:shadow-md `} onClick={handleLogout} >Log out</button>
              </Link>
            </div>
          </div>
        ):(
          <div className="flex">
          <div className={`${theme?'text-[#ffffff]':'text-[#24243b]'} cursor-pointer`}>
          <i className={`fa-solid fa-star-and-crescent text-2xl mr-2 -rotate-45`} onClick={handleTheme}></i>
          </div>
          <div className='sm:hidden'>
            <Link to="/login">
              <button className= {`px-4 py-1 mr-2  border-[1.6px] text-white ${theme?' border-[#7878bc] bg-transparent shadow-[#7878bc]':'bg-[#7878bc]'}    shadow-sm hover:shadow-md hover:shadow-[#7878bc] rounded-md`} >Log in</button>
            </Link>
          </div>
          <div className='sm:hidden'>
            <Link to="/register">
              <button className="px-4 py-1 border-[1.5px] border-[#7878bc] bg-[#7878bc] shadow-[#ffffff] shadow-sm hover:shadow-md hover:shadow-[#ffffff] rounded-md text-white" >Sign up</button>
            </Link>
          </div>
        </div>  
        )}
    </div>
</div>
  )
  }
export default Navbar