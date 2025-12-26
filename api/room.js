export const getRoom = (roomId)=>{
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiUrl
  return useAsyncData("room", () => $fetch(`${BASE_URL}/rooms/${roomId}`), {
    transform: (response) => {
      const { result } = response;
      return result;
    },
  });
}

