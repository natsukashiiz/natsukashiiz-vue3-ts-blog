<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import type { BlogResponse, UserBlogResponse } from '@/api';
import { findByUser } from '@/api/blog';
import 'md-editor-v3/lib/preview.css';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';
import { onBeforeRouteUpdate } from 'vue-router';
import { SyncOutline as SyncIcon } from '@vicons/ionicons5';
import MBlog from '@/components/MBlog.vue';
import MAvatar from '@/components/MAvatar.vue';
import MEmpty from '@/components/MEmpty.vue';
import { updateTitle, useIsMobile } from '@/tools/Comm';
import request from '@/api/request';

const message = useMessage();
const loading = useLoadingBar();
const authStore = useAuthStore();
const route = useRoute();
const isMobile = useIsMobile();

const data = ref<UserBlogResponse>();
const uname = ref<string>('');
const loadMoreShow = ref<boolean>(false);

const page = ref<number>(1);
const pageSize = ref<number>(5);
const dataCount = ref<number>(10);

async function fetchData() {
    loading.start();
    try {
        const res = await findByUser(uname.value, {
            page: page.value,
            limit: pageSize.value
        });
        if (res.status === 200 && res.data.code === 0) {
            loading.finish();
            if (res.data.result) data.value = res.data.result;
            if (res.data.records) dataCount.value = res.data.records;
        }
        if (res.data && res.data.code && res.data.text) {
            loading.error();
            message.error(res.data.code + ': ' + res.data.text);
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof Error) {
            e.message; // works, `e` narrowed to Error
            message.error(e.message);
        }
        loading.error();
    }
}

async function loadMore() {
    page.value++;
    loading.start();
    try {
        const res = await findByUser(uname.value, {
            page: page.value,
            limit: pageSize.value
        });
        if (res.status === 200 && res.data.code === 0) {
            loading.finish();
            if (res.data.result) data.value?.blog.push(...res.data.result.blog);
            if (res.data.records) dataCount.value = res.data.records;
            if (dataCount.value <= page.value * pageSize.value) loadMoreShow.value = false;
        }
        if (res.data && res.data.code && res.data.text) {
            loading.error();
            message.error(res.data.code + ': ' + res.data.text);
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof Error) {
            e.message; // works, `e` narrowed to Error
            message.error(e.message);
        }
        loading.error();
    }
}

onBeforeMount(async () => {
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

    uname.value = String(route.params.uname);
    await fetchData();

    updateTitle(uname.value);

    if (dataCount.value > pageSize.value) loadMoreShow.value = true;
});

onBeforeRouteUpdate(async (to, from) => {
    // only fetch the user if the id changed as maybe only the query or the hash changed
    if (to.params.uname !== from.params.uname) {
        uname.value = String(to.params.uname);
        await fetchData();
    }
});
</script>

<template>
    <n-layout has-sider position="absolute" style="top: 60px; bottom: 60px">
        <n-space v-if="isMobile" vertical style="margin-top: 15px">
            <MAvatar vertical show-titile :name="uname" :avatar="data?.user.avatar" can-preview />
            <MEmpty v-if="data?.blog.length === 0" />
            <div v-else v-for="val in data?.blog" :key="val.id">
                <MBlog :data="val">
                    <template #header-extra v-if="authStore.payload?.uid == val.uid">
                        <n-tag v-if="val.publish" type="success">{{ $t('common.publish') }}</n-tag>
                        <n-tag v-else type="error">{{ $t('common.private') }}</n-tag>
                    </template>
                </MBlog>
            </div>
        </n-space>
        <n-layout-sider v-if="!isMobile" bordered content-style="padding: 50px;">
            <MAvatar vertical show-titile :name="uname" :avatar="data?.user.avatar" can-preview />
        </n-layout-sider>
        <n-layout v-if="!isMobile" content-style="padding: 15px;">
            <MEmpty v-if="data?.blog.length === 0" />
            <n-space v-else vertical>
                <div v-for="val in data?.blog" :key="val.id">
                    <MBlog :data="val">
                        <template #header-extra v-if="authStore.payload?.uid == val.uid">
                            <n-tag v-if="val.publish" type="success">{{
                                $t('common.publish')
                            }}</n-tag>
                            <n-tag v-else type="error">{{ $t('common.private') }}</n-tag>
                        </template>
                    </MBlog>
                </div>
            </n-space>
            <n-space justify="center" style="margin-top: 10px">
                <n-button @click="loadMore" v-show="loadMoreShow" size="small">
                    <n-icon>
                        <SyncIcon />
                    </n-icon>
                </n-button>
            </n-space>
        </n-layout>
    </n-layout>
</template>
