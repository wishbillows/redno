import {create} from 'zustand';


export const usePostsStore = create((set)=>(
    {
     pendingReview:[],
    setPendingReview:(pendingReview:any)=>set({pendingReview})
})
)