// All of the logic to be passed to the reducer
import {createSlice} from "@reduxjs/toolkit"

// CHECK IF USER LOGIN WITH CORRECT CREDENTIALS
const initialState ={value:false}
export const showSlice = createSlice({
    name: "show",
    initialState,
    reducers:{
        showAuthenticate:(state)=>{
            state.value = state.value
        },
        authenticate:(state)=>{
            state.value = true
        },
        unauthenticate:(state)=>{
            state.value = false
        },
    }
})

//SET ROLE
const initialRole={}
export const roleSlice = createSlice({
    name: "role",
    initialState:initialRole,
    reducers:{
        showRole:(state,action)=>{
            state = {...state,...action.payload}
            return state
        }
    }
})

//VALUE FOR ITEM TO EDIT
const editItem ={_id:'',name:'',available:0,reserved:0}
export const itemSlice = createSlice({
    name: "item",
    initialState:editItem,
    reducers:{
        showItem:(state,action)=>{
           state ={ ...state, ...action.payload}
           return state
        },
    }
})

//
const initialaddItem:any = {value:false}
export const addItemSlice = createSlice({
    name:"addItem",
    initialState:initialaddItem,
    reducers:{
        addItem:(state,action)=>{
            state.value =  action.payload
            return state
        }
    }
})

//THEME FOR APP
const initialTheme = {dark:true}
export const themeSlice = createSlice({
    name:"theme",
    initialState:initialTheme,
    reducers:{
        changeTheme:(state)=>{
            state =  {...state,dark:!state.dark}
            return state
        }
    }
})

//NOTIFICATION COUNT
const initialCount = {count:0,showCount:false}
export const countSlice = createSlice({
    name:"theme",
    initialState:initialCount,
    reducers:{
        changeCount:(state,action)=>{
            state =  {...state,count:action.payload}
            return state
        },
        setShowCount:(state,action)=>{
            state = {...state,showCount:action.payload}
            return state
        }
    }
})

export const {showAuthenticate,authenticate,unauthenticate} = showSlice.actions
export const {showItem} = itemSlice.actions
export const {addItem} = addItemSlice.actions
export const {showRole} = roleSlice.actions
export const {changeTheme} = themeSlice.actions
export const {changeCount,setShowCount} = countSlice.actions


export default {show:showSlice.reducer,edit:itemSlice.reducer,add:addItemSlice.reducer,role:roleSlice.reducer,theme:themeSlice.reducer,count:countSlice.reducer}