export const postVerifyEmail = async (emailVal)=>{
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiUrl

  try {
    const data = await $fetch(`${BASE_URL}/verify/email` ,{
      method: "post",
      body: { ...emailVal },
    })
    return data
    
  } catch (error) {
    let message = ref("格式不正確!")
    console.log("400格式不正確->",error.message);
    
    return{
      // "status": false,
      message
    }
    
  }

}
