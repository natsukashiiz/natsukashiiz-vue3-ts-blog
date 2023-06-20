<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NLayout } from 'naive-ui';
import { onBeforeMount } from 'vue';
import request from '@/api/request';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();

onBeforeMount(() => {
    if (authStore.isAuthenticated()) {
        request.interceptors.request.use(
            (config) => {
                // TODO try auth
                config.headers.Authorization = `Bearer ${authStore.token}`;
                return config;
            },
            (error) => {
                console.log('interceptors: ', error);
            }
        );
    }
});
</script>

<template>
    <n-layout position="absolute" style="top: 60px; bottom: 50px">
        <n-layout content-style="padding: 15px;">
            <RouterView />
        </n-layout>
    </n-layout>
</template>
