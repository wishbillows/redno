import request from "@/utils/request";
interface data {
    pageSize:number
    page:number
    toltal:number
}
export const getPostsList = (list:data)=>{
    return request.post('/posts',list);
}