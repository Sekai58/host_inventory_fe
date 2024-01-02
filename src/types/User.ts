export interface IUser{
    userName:string,
    role:string
}

export interface IItems{
    _id:string
    name:string,
    available:number,
    reserved:number,
    url:string
}

export interface IRequest{
    userName:string,
    name:string
}