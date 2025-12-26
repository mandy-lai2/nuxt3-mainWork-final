export const getOrderList = (token)=>{
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiUrl
  return useAsyncData("orderList", () => $fetch(`${BASE_URL}/orders`,{
    headers: {
      authorization: token,
    },
  }), 
  {
    transform: (response) => {
      const { result } = response;
      return result;
    },
  });
}
