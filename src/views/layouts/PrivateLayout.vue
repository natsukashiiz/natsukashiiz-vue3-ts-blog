<script setup lang="ts">
import { RouterView } from "vue-router";
import { NLayout, NLayoutSider } from "naive-ui";
import { onBeforeMount } from "vue";
import request from "@/api/request";
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();

onBeforeMount(() => {
  request.interceptors.request.use(config => {
      // TODO try auth
      config.headers.Authorization = `Bearer ${authStore.token}`;
      return config;
    }, error => {
      console.log("interceptors: ",error);
    }
  );
});
</script>

<template>
  <n-layout has-sider position="absolute" style="top: 60px; bottom: 60px">
    <n-layout-sider bordered content-style="padding: 15px;">
      Coming Soon...
    </n-layout-sider>
    <n-layout content-style="padding: 15px;">
      <RouterView />
    </n-layout>
  </n-layout>
</template>