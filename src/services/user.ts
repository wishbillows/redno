import request  from "../utils/request";

export const getUser = ()=>{
   return request.post('/notes/users')
}