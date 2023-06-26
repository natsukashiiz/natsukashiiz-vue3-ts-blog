<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NLayout, NLayoutSider } from 'naive-ui';
import { onBeforeMount } from 'vue';
import request from '@/api/request';
import { useAuthStore } from '@/stores/AuthStore';
import MAvatar from '@/components/MAvatar.vue';
import { useIsMobile } from '@/tools/Comm';

const isMobile = useIsMobile();
const authStore = useAuthStore();
const payload = authStore.payload;

onBeforeMount(() => {
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
});
</script>

<template>
    <n-layout has-sider position="absolute" style="top: 60px; bottom: 60px">
        <n-space v-if="isMobile" vertical>
            <MAvatar
                vertical
                show-titile
                :uid="payload?.uid"
                :name="payload?.name"
                style="margin-top: 15px"
            />
            <n-layout content-style="padding: 10px;">
                <RouterView />
            </n-layout>
        </n-space>
        <n-layout-sider v-if="!isMobile" bordered content-style="padding: 50px;">
            <MAvatar vertical show-titile :uid="payload?.uid" :name="payload?.name" />
        </n-layout-sider>
        <n-layout v-if="!isMobile" content-style="padding: 15px;">
            <RouterView />
        </n-layout>
    </n-layout>
</template>
