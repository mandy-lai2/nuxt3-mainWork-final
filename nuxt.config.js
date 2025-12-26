// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: [
    '@/assets/styles/all.scss', 
  ],
  runtimeConfig: {
    public: {
      apiUrl: 'https://nuxr3.zeabur.app/api/v1'
    }
  },
  modules: ["@pinia/nuxt","@vee-validate/nuxt"],
  veeValidate: {
    componentNames: {
      Form: "VForm",
      Field: "VField",
      ErrorMessage: "VErrorMessage",
    },
  },
  
})