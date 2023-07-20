<script setup lang="ts">
import { ref } from 'vue';
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
import { useQuery } from '@tanstack/vue-query';

const message = useMessage();
const loading = useLoadingBar();

const dataList = ref<Array<BlogResponse>>([]);

const page = ref<number>(1);
const pageSize = ref<number>(5);
const dataCount = ref<number>(4);
const moreShow = ref<boolean>(false);

const { isSuccess, isPreviousData, data } = useQuery({
    queryKey: ['blogs', page],
    queryFn: async () => {
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
                if (dataCount.value <= page.value * pageSize.value) moreShow.value = false;
                else moreShow.value = true;
                return dataList.value;
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
        return null;
    },
    keepPreviousData: true
});

defaultTitle();
const loadMore = () => {
    if (!isPreviousData.value) {
        page.value++;
    }
};
</script>

<template>
    <n-space v-if="isSuccess" vertical>
        <div v-for="item in data" :key="item.id">
            <MBlog :data="item">
                <template #header>
                    <router-link :to="{ path: `/@${item.uname}` }">
                        <MAvatar :name="item.uname" :show-name="true" :avatar="item.avatar"
                    /></router-link>
                </template>
            </MBlog>
        </div>
    </n-space>
    <n-space justify="center" style="margin-top: 10px">
        <n-tooltip trigger="hover">
            <template #trigger>
                <n-button @click="loadMore" v-show="moreShow" size="small" text>
                    <n-icon :size="30">
                        <LoadMoreIcon />
                    </n-icon>
                </n-button>
            </template>
            {{ $t('common.loadMore') }}
        </n-tooltip>
    </n-space>
</template>
