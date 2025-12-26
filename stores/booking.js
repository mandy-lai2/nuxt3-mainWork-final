import { defineStore } from "pinia";

export const useBookingStore = defineStore("booking", ()=>{
  const bookingLatest= ref({})
  const setBookingLatest = (bookingInfo)=>{
    bookingLatest.value = bookingInfo
    console.log("bookingLatest->",bookingLatest.value);
  }

  return{
    bookingLatest,
    setBookingLatest
  }
})