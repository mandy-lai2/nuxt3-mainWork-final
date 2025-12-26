export const postBookingOrders = async (orderInfo, token)=>{
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiUrl

  try {
    const data = await $fetch(`${BASE_URL}/orders` ,{
      method: "post",
      headers: {
        authorization: token,
      },
      body: { ...orderInfo },
    })
    return data
    
  } catch (error) {
    let message = ref("錯誤!")

    if(error.status === 404){
      message.value = "不存在"
    }else if(error.status === 403){
      message.value = "請重新登入"
    }

    return{
      // "status": false,
      message
    }
    
  }

}
