<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { NLayout, NLayoutSider } from 'naive-ui';
import { onBeforeMount, ref } from 'vue';
import request from '@/api/request';
import { useAuthStore } from '@/stores/AuthStore';
import MAvatar from '@/components/MAvatar.vue';
import { updateTitle, useIsMobile } from '@/tools/Comm';

const isMobile = useIsMobile();
const authStore = useAuthStore();
const route = useRoute();
const uname = ref<string>('');

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

onBeforeMount(async () => {
    uname.value = String(route.params.uname);
    updateTitle(uname.value);
});
</script>

<template>
    <n-layout has-sider position="absolute" style="top: 60px; bottom: 60px">
        <n-space v-if="isMobile" vertical>
            <MAvatar vertical show-titile :name="uname" style="margin-top: 15px" />
            <n-layout content-style="padding: 10px;">
                <RouterView />
            </n-layout>
        </n-space>
        <n-layout-sider v-if="!isMobile" bordered content-style="padding: 50px;">
            <MAvatar vertical show-titile :name="uname" />
        </n-layout-sider>
        <n-layout v-if="!isMobile" content-style="padding: 15px;">
            <RouterView />
        </n-layout>
    </n-layout>
</template>
