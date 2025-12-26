export const getDeleteOrder = (orderId, token)=>{
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiUrl
  return useAsyncData("deleteOrder", () => $fetch(`${BASE_URL}/orders/${orderId}`,{
    headers: {
      authorization: token,
    },
  }), 
  {
    transform: (response) => {
      // console.log("OrderResponse->",response);
      if(!response.status){
        return "訂單錯誤"
      }
      const { result } = response;
      return result;
    },
  });
}
