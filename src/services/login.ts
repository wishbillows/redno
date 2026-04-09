// /login
import request from '@/utils/request';

export const login = (data:{username:string,password:string})=>{
    console.log(data);
    return request.post('/login',data);
}