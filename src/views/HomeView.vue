<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import type { BlogResponse } from '@/api';
import { findAll } from '@/api/blog';
import 'md-editor-v3/lib/preview.css';
import MBlog from '@/components/MBlog.vue';
import MAvatar from '@/components/MAvatar.vue';
import router from '@/router';
import { AxiosError } from 'axios';
import { defaultTitle } from '@/tools/Comm';
import { ChevronDownCircleOutline as LoadMoreIcon } from '@vicons/ionicons5';

const message = useMessage();
const loading = useLoadingBar();

const dataList = ref<Array<BlogResponse>>([]);

const page = ref<number>(1);
const pageSize = ref<number>(5);
const dataCount = ref<number>(4);

const loadMoreShow = ref<boolean>(false);

async function fetchData() {
    loading.start();
    try {
        const res = await findAll({
            page: page.value,
            limit: pageSize.value
        });
        if (res.status === 200 && res.data.code === 0) {
            loading.finish();
            if (res.data.result) dataList.value = res.data.result;
            if (res.data.records) dataCount.value = res.data.records;
        }
        if (res.data && res.data.code && res.data.text) {
            loading.error();
            message.error(res.data.code + ': ' + res.data.text);
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof AxiosError) {
            if (e.code == 'ERR_NETWORK') {
                router.push('/server-error');
            }
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
        const res = await findAll({
            page: page.value,
            limit: pageSize.value
        });
        if (res.status === 200 && res.data.code === 0) {
            loading.finish();
            if (res.data.result) dataList.value.push(...res.data.result);
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
        } else if (e instanceof AxiosError) {
            if (e.code == 'ERR_NETWORK') {
                router.push('/server-error');
            }
            e.message; // works, `e` narrowed to Error
            message.error(e.message);
        }
        loading.error();
    }
}

onBeforeMount(async () => {
    await fetchData();
    defaultTitle();

    if (dataCount.value > pageSize.value) loadMoreShow.value = true;
});
</script>

<template>
    <n-space vertical>
        <div v-for="data in dataList" :key="data.id">
            <MBlog :data="data">
                <template #header>
                    <router-link :to="{ path: `/@${data.uname}` }">
                        <MAvatar :name="data.uname" :show-name="true" :avatar="data.avatar"
                    /></router-link>
                </template>
            </MBlog>
        </div>
    </n-space>
    <n-space justify="center" style="margin-top: 10px">
        <n-tooltip trigger="hover">
            <template #trigger>
                <n-button @click="loadMore" v-show="loadMoreShow" size="small" text>
                    <n-icon :size="30">
                        <LoadMoreIcon />
                    </n-icon>
                </n-button>
            </template>
            {{ $t('common.loadMore') }}
        </n-tooltip>
    </n-space>
</template>
