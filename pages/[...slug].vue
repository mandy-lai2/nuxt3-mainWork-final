<script setup>
const route = useRoute();
const event = useRequestEvent(); // 獲取當前請求的事件

// 設定 HTTP 404 狀態碼
setResponseStatus(event, 404);
</script>

<template>
  <div>
    <h1>404 Not Found</h1>
    <p>你所請求的頁面：{{ route.params.slug.join('/') }}，不存在。</p>
  </div>
</template>

<style scoped>
h1 {
  color: red;
  text-align: center;
}
p {
  text-align: center;
}
</style>