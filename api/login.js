export const getLogin = async (userInfo)=>{
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiUrl

  try {
    const data = await $fetch(`${BASE_URL}/user/login` ,{
      method: "post",
      body: { ...userInfo },
    })
    return data
    
  } catch (error) {
    let message = ref("密碼錯誤")

    if(error.status === 404){
      message.value = "此使用者不存在"
    }

    return{
      "status": false,
      message
    }
    
  }

// {
//   "email": "timmothy.ramos@example.com",
//   "password": "Dirt5528295"
// }
}
