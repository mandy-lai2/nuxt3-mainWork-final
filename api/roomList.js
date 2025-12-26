// export const RoomListUrl = `${BASE_URL}/rooms/`;
// import { RoomListUrl} from "@/api/apiUrls"

export const getRoomList = async()=>{
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiUrl
  return await useAsyncData("roomList", () => $fetch(`${BASE_URL}/rooms/`), {
    transform: (response) => {
      const { result } = response;
      return result;
    },
  });
}
