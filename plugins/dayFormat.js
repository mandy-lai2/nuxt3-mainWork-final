import dayjs from "dayjs";

export default defineNuxtPlugin((nuxtApp) => {
  //註冊 Vue 自訂指令
  nuxtApp.vueApp.directive("dayFormat", {
    //mounted 生命週期鉤子，(el元素, binding傳遞的值)
    mounted(el, binding) {
      const dayWeek = ["日", "一", "二", "三", "四", "五", "六"];
      // 轉換 dayjs 物件
      const dayjsObj = dayjs(binding.value); 
      const day = dayWeek[dayjsObj.day()];
      el.textContent = el.textContent.replace(
        "[day]",
        dayjsObj.format(`M月D日 星期${day}`)
      );
    },
  });
});