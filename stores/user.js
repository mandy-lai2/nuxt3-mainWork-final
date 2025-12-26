import { defineStore } from "pinia";

export const useUserStore = defineStore("user", ()=>{
  const userInfo= ref({})
  const setUserInfo = (info)=>{
    userInfo.value = info
    console.log("userInfo->",userInfo);
  }
  return{
    userInfo,
    setUserInfo
  }
})