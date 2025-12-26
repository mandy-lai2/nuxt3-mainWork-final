import { defineRule, configure } from "vee-validate";
import { required, min, email } from "@vee-validate/rules";
// import * as allRules from "@vee-validate/rules";

import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

export default defineNuxtPlugin((nuxtApp) => {
  // 定義全域的規則
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);

  // 自訂驗證規則
  defineRule("username", (value) => {
    const regex = /^[a-zA-Z0-9_]{3,15}$/;
    return (
      regex.test(value) ||
      "使用者名稱只能包含字母、數字與底線，且長度須為 3 至 15 字元"
    );
  });
  defineRule("isPhone", (value) => {
    const phoneNumberRegex = /^(09)[0-9]{8}$/;
    return phoneNumberRegex.test(value) ? true : "需要正確的電話號碼";
  });


  // 設定多國語系與驗證訊息
  configure({
    // 載入繁體中文的設定檔，產生繁體中文的驗證訊息
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true, // 輸入文字時立即進行驗證
  });

  // 設定預設語言為繁體中文
  setLocale("zh_TW");
});